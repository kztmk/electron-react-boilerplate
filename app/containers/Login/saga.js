// @flow
import type { Saga } from 'redux-saga';
import { push } from 'react-router-redux';
import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  logoutFailure,
  clearAuthInfo
} from './actions';
import { Actions } from './actionTypes';
import type { AuthType } from '../../types/auth';
import type { FirebaseUserType, FirebaseErrorType } from '../../types/firebase';
import rsf from '../../database/db';
import { getProfileRequest } from '../Profile/actions';
import type { UserAccountType } from '../../types/userAccount';

/**
 * firebae error.codeからerror内容を日本語化する
 * @param error
 * @returns 日本語に翻訳したエラーメッセージ
 */
function getErrorMessage(error): string {
  if (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return '有効なメールアドレスではありません。';
      case 'anth/user-disabled':
        return '有効なユーザーではありません。';
      case 'auth/wrong-password':
        return 'パスワードが一致しません。';
      case 'auth/user-not-found':
        return 'このメールアドレスでのユーザーは見つかりません。';
      default:
        return error.message;
    }
  } else {
    return '';
  }
}

/**
 *   firebaseからログアウトする
 *
 *   firebase API signOutを呼び、logoutSuccessアクションをdispatch
 *   errorの場合は、logoutFailureアクションをdispatch.
 *
 *   firebase API signOUtは、voidを返すので完了を待たない。
 */
function* requestLogout() {
  try {
    /*    firebase
      .auth()
      .signOut()
      .catch(error => {
        throw error;
      });*/

    yield call(rsf.signOut);
    yield put(logoutSuccess());
    yield put(clearAuthInfo());
  } catch (err) {
    const authInfo: AuthType = yield select(state => state.Login);
    yield put(logoutFailure({ ...authInfo, errorMessage: err }));
  }
}

/**
 *   1. loginRequestアクションをdispatch(ローディングをONにする)、
 *   2. firebase API signInWithEmailAndPasswordを実行
 *        success=> loginSuccessをdispatch
 *        error=>loginFailureをdispatch
 */
function* requestLogin() {
  yield put(loginRequest());
  const authInfo: AuthType = yield select(state => state.Login);

  try {
    /*    const firebaseAuth = ({ email, password }) =>
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => {
          throw error;
        });

    const user = yield call(firebaseAuth, {
      email: authInfo.mailAddress,
      password: authInfo.password
    });

*/
    const user = yield call(
      rsf.auth.signInWithEmailAndPassword,
      authInfo.mailAddress,
      authInfo.password
    );

    yield put(loginSuccess({ ...authInfo, userId: user.uid }));

    // ログインに成功した場合、profileを取得する。
    yield put(getProfileRequest());
    const profile: UserAccountType = yield select(state => state.Profile);
    if (!profile.expireDate) console.log('expireDate not set');
  } catch (error) {
    yield put(loginFailure({ ...authInfo, errorMessage: getErrorMessage(error) }));
  }
}

/**
 *  login SetAuthInfoアクションを待機
 *  logout logoutRequestアクションを待機
 */
function* rootSaga() {
  yield takeEvery(Actions.SET_AUTH_INFO, requestLogin);
  yield takeEvery(Actions.LOGOUT_REQUEST, requestLogout);
}

export default rootSaga;
