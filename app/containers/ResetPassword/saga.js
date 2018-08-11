// @flow
import { call, select, takeEvery, put } from 'redux-saga/effects';
import { Actions } from './actionTypes';

import {
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearFields
} from './actions';
import type { AuthType } from '../../types/auth';
import { firebaseSendPasswordResetEmail } from '../../database/db';

/**
 * Firebaseからのエラーを日本語化
 * @param error
 * @returns {*}
 */
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

/**
 * パスワードのリセットをFirebaseへ要求
 * PasswordReset stateから値を取得後、stateを初期化
 * エラーなしの場合resetPasswordSuccessをdispatch
 * エラーの場合resetPasswordFailureをdispatch
 */
function* passwordReset() {
  const authInfo: AuthType = yield select(state => state.ResetPassword);
  yield put(clearFields());
  yield put(resetPasswordRequest());

  try {
    yield call(firebaseSendPasswordResetEmail, authInfo.mailAddress);

    yield put(resetPasswordSuccess());
  } catch (error) {
    yield put(
      resetPasswordFailure({
        ...authInfo,
        errorMessage: getErrorMessage(error)
      })
    );
  }
}

// eslint-disable
/**
 * ResetPassword SetAuthInfoアクションを待機
 */
function* rootSaga() {
  yield takeEvery(Actions.SET_AUTH_INFO, passwordReset);
}

export default rootSaga;
