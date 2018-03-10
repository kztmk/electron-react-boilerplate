// @flow
import { Actions } from './actionTypes';
import { call, select, takeEvery, put } from 'redux-saga/effects';
import {
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearFields
} from './actions';
import type { AuthType } from '../../types/auth';
import { firebase } from '../../database/db';
import { push } from 'react-router-redux';

const getErrorMessage = error => {
  if (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return '無効、または、登録されていないメールアドレスです。';
      case 'auth/user-not-found':
        return 'ユーザーが見つかりません。';
      default:
        return error.message;
    }
  } else {
    return '';
  }
};

function* passwordReset() {
  const authInfo: AuthType = yield select(state => state.ResetPassword);
  yield put(clearFields(authInfo));
  yield put(resetPasswordRequest());

  try {
    const firebaseResetPassword = email =>
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .catch(error => {
          throw error;
        });

    console.log(authInfo.mailAddress);
    yield call(firebaseResetPassword, authInfo.mailAddress);

    yield put(resetPasswordSuccess());
  } catch (error) {
    yield put(resetPasswordFailure({ ...authInfo, errorMessage: getErrorMessage(error) }));
  }
}

/**
 *  ResetPassword SetAuthInfoアクションを待機
 *
 */
function* rootSaga() {
  yield takeEvery(Actions.SET_AUTH_INFO, passwordReset);
}

export default rootSaga;
