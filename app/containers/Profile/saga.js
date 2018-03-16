// @flow
import type { Saga } from 'redux-saga';
import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
  createProfileRequest,
  createProfileSuccess,
  createProfileFailure,
  getProfileRequest,
  getProfileSuccess,
  getProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  deleteProfileRequest,
  deleteProfileSuccess,
  deleteProfileFailure
} from './actions';
import type { UserAccountType } from '../../types/userAccount';
import { Actions } from './actionTypes';
import {
  firebaseDbRead,
  firebaseDbInsert,
  firebaseUpdateEmail,
  firebaseUpdatePassword
} from '../../database/db';
import type { AuthType } from '../../types/auth';
import { updateAuthInfo } from '../Login/actions';

function convertErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return '有効なメールアドレスではありません。';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは、別アカウントで使用されています。';
    case 'auth/requires-recent-login':
      return '前回のログインから既定の時間が経過しています。再度ログインしてください。';
    case 'auth/weak-password':
      return 'パスワードが弱すぎます。';
    default:
      return errorCode;
  }
}

/**
 * Profile作成
 * mailAddress, passwordの更新
 */
function* createProfile() {
  yield put(createProfileRequest());
  console.log('call create.profile');
  const profile: UserAccountType = yield select(state => state.Profile);
  const userAuth = yield select(state => state.Login);
  console.log('get profile');
  // ------validate fields----------
  // mailAddress
  const mailAddressRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const checkAddress = profile.mailAddress;
  console.log(`check:${checkAddress}`);
  if (checkAddress.match(mailAddressRegx) === null) {
    console.log('fail mailaddress check');
    yield put(
      createProfileFailure({
        ...profile,
        errorMessage: '有効なメールアドレではありません。'
      })
    );
    return;
  }
  console.log('pass mailaddress');

  console.log(`first profile:${profile.isFirstProfile}`);
  // Profile data を作成
  if (profile.isFirstProfile) {
    try {
      console.log('this is first time save profile');

      const key = yield call(firebaseDbInsert, `/users/${userAuth.userId}/profile`, {
        expireDate: profile.expireDate,
        paymentMethod: profile.paymentMethod,
        registeredMailAddress: profile.registeredMailAddress
      });
      yield put(createProfileSuccess({ ...profile, key, isFailure: false }));
    } catch (error) {
      yield put(createProfileFailure({ ...profile, errorMessage: error }));
    }
  }

  // profile update
  if (!profile.isFirstProfile) {
    console.log('this. is update profile');

    console.log('chck mailAddress:' + userAuth.mailAddress === profile.mailAddress);
    console.log('old:' + userAuth.mailAddress);
    console.log('new:' + profile.mailAddress);

    // mailAddress
    if (userAuth.mailAddress !== profile.mailAddress) {
      try {
        console.log('try mailAddress update');
        yield call(firebaseUpdateEmail, profile.mailAddress);
        yield put(updateProfileSuccess());
        // user Auth mailAddress update
        yield put(updateAuthInfo({ ...userAuth, mailAddress: profile.mailAddress }));
      } catch (error) {
        yield put(updateProfileFailure({ ...profile, errorMessage: convertErrorMessage(error) }));
      }
    }

    const latestAuthInfo = yield select(state => state.Login);
    console.log('chck password:' + latestAuthInfo.password === profile.password);
    console.log('old:' + latestAuthInfo.password);
    console.log('new:' + profile.password);
    // password
    if (latestAuthInfo.password !== profile.password) {
      try {
        console.log('try password update');
        yield call(firebaseUpdatePassword, profile.password);
        yield put(updateProfileSuccess());
        // userAuth password update
        yield put(updateAuthInfo({ ...latestAuthInfo, password: profile.password }));
      } catch (error) {
        console.log('pw error:' + error);
        yield put(updateProfileFailure({ ...profile, errorMessage: convertErrorMessage(error) }));
      }
    }
  }
}

function* getProfile() {
  const userAuth: AuthType = yield select(state => state.Login);
  if (userAuth.userId.length === 0) throw 'ログインが完了していません。';
  const userInfo: UserAccountType = yield select(state => state.Profile);

  try {
    const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/profile`);
    const profiles = [];

    snapshot.forEach(childSnapshot => {
      profiles.push({
        key: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    if (profiles.length > 1) {
      throw '複数のユーザープロフィールが作成されています。';
    }

    console.log(profiles[0]);
    if (profiles.length === 1) {
      yield put(
        getProfileSuccess({
          ...userInfo,
          userId: userAuth.userId,
          mailAddress: userAuth.mailAddress,
          password: userAuth.password,
          registeredMailAddress: profiles[0].registeredMailAddress,
          expireDate: profiles[0].expireDate,
          paymentMethod: profiles[0].paymentMethod,
          isFirstProfile: !!!profiles[0].key,
          key: profiles[0].key
        })
      );
    } else {
      yield put(
        getProfileSuccess({
          ...userInfo,
          userId: userAuth.userId,
          mailAddress: userAuth.mailAddress,
          password: userAuth.password
        })
      );
    }
  } catch (error) {
    yield put(getProfileFailure({ ...userInfo, errorMessage: error.message }));
  }
}

function* updateProfile() {
  const userInfo: UserAccountType = yield select(state => state.Profile);
  yield put(updateProfileSuccess({ ...userInfo }));
  yield put(updateProfileFailure({ ...userInfo }));
}

function* deleteProfile() {
  const userInfo: UserAccountType = yield select(state => state.Profile);
  yield put(deleteProfileSuccess());
  yield put(deleteProfileFailure());
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.SET_PROFILE, createProfile);
  yield takeEvery(Actions.GET_PROFILE_REQUEST, getProfile);
  yield takeEvery(Actions.UPDATE_PROFILE_REQUEST, updateProfile);
  yield takeEvery(Actions.DELETE_PROFILE_REQUEST, deleteProfile);
}

export default rootSaga;
