// @flow
import type { Saga } from 'redux-saga';
import { put, call, takeEvery } from 'redux-saga/effects';
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

function login(authInfo: AuthType): Saga<void> {
  return firebase
    .auth()
    .signInWithEmailAndPassword(authInfo.mailAddress, authInfo.password)
    .then(user => ({ user }))
    .catch(error => ({ error }));
}

function* logout(authInfo: AuthType): Saga<void> {
  try {
    yield put(logoutRequest(authInfo));
    yield put(logoutSuccess());
  } catch (err) {
    yield put(logoutFailure(authInfo));
  }
}

export function* requestLogin(authInfo: AuthType) {
  const { user, error } = yield call(login(authInfo));
  if (user && !error) {
    authInfo.userId = user.uid;
    return authInfo;
  } else {
    console.log('error');
  }
}

function* rootSaga(): Saga<void> {
  yield takeEvery(Actions.LOGIN_REQUEST, requestLogin);
  yield takeEvery(Actions.LOGOUT_REQUEST, logout);
}

export default rootSaga();
