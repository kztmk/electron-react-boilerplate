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
import rsf from '../../database/db';
import type { AuthType } from '../../types/auth';

function* createProfile() {
  yield put(createProfileRequest());
  console.log('call create.profile');

  //validate fields
  //mailAddress
  /*  const userInfo: UserAccountType = yield select(state => state.Profile);
  const authInfo: AuthType = yield select(state => state.Login);

  try {
    const key = yield call(rsf.database.create, `users/${authInfo.userId}/profile`, {
      expireDate: userInfo.expireDate,
      paymentMethod: userInfo.paymentMethod,
      registeredMailAddress: userInfo.registeredMailAddress
    });
    yield put(createProfileSuccess({ ...userInfo, key }));
  } catch (error) {
    yield put(createProfileFailure({ ...userInfo, errorMessage: error.message }));
  }*/
}

function* getProfile() {
  const userAuth: AuthType = yield select(state => state.Login);
  if (userAuth.userId.length === 0) throw 'ログインが完了していません。';
  const userInfo: UserAccountType = yield select(state => state.Profile);

  try {
    const profile = yield call(rsf.database.read, `/users/${userAuth.userId}/profile`);
    console.log('profile:' + profile);
    const registMailAddress = profile ? profile.registeredMailAddress : userAuth.mailAddress;
    yield put(
      getProfileSuccess({
        ...userInfo,
        userId: userAuth.userId,
        mailAddress: userAuth.mailAddress,
        password: userAuth.password,
        registeredMailAddress: registMailAddress
      })
    );
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
