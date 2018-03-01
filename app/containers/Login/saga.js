// @flow
import type { Saga } from 'redux-saga';
import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
  setAuthInfo,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure
} from './actions';
import { Actions, LOGIN_REQUEST } from './actionTypes';
import type { AuthType } from '../../types/auth';
import type { FirebaseUserType, FirebaseErrorType } from '../../types/firebase';
import { firebase } from '../../database/db';

function login(authInfo) {
  firebase
    .auth()
    .signInWithEmailAndPassword(authInfo.mailAddress, authInfo.password)
    .then(user => {
      return { ...authInfo, userId: user.uid };
    })
    .catch(error => {
      const { code, message } = error;
      return { ...authInfo, errorMessage: code + '-' + message };
    });
}

function getErrorMessage(error: FirebaseErrorType) {
  let errorMsg = '';
  if (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return (errorMsg = '有効なメールアドレスではありません。');
      case 'anth/user-disabled':
        return (errorMsg = '有効なユーザーではありません。');
      case 'auth/user-not':
        return (errorMsg = 'メールアドレスが登録されていません。');
      case 'auth/wrong-password':
        return (errorMsg = 'パスワードが一致しません。');
      default:
        return (errorMsg = error.message);
    }
  } else {
    return errorMsg;
  }
}

/*
function* logout(authInfo: AuthType): Saga<void> {
  try {
    yield put(logoutRequest(authInfo));
    yield put(logoutSuccess());
  } catch (err) {
    yield put(logoutFailure(authInfo));
  }
}
*/

function* requestLogin() {
  yield put(loginRequest());
  const authInfo = yield select(state => state.Login);
  console.log(authInfo);

  firebase
    .auth()
    .signInWithEmailAndPassword(authInfo.mailAddress, authInfo.password)
    .then(user => {
      put(loginSuccess(authInfo));
    })
    .catch(error => {
      const { code, message } = error;
    });

  console.log('-----user------');
  console.log(authInfo);

  console.log('called requestLogin');
}

function* rootSaga() {
  yield takeEvery(Actions.SET_AUTH_INFO, requestLogin);
  /* yield takeEvery(Actions.LOGOUT_REQUEST, logout); */
}

export default rootSaga;
