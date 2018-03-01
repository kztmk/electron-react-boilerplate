// @flow
import type { Saga } from 'redux-saga';
import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure
} from './actions';
import { Actions } from './actionTypes';
import type { AuthType } from '../../types/auth';
import type { FirebaseUserType, FirebaseErrorType } from '../../types/firebase';
import { firebase } from '../../database/db';

function getErrorMessage(error: FirebaseErrorType): string {
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

/*

 */
function* requestLogout(): Saga<void> {
    yield put(logoutRequest());

    try {
      const firebaseAuth = () => firebase.auth().signOut()
      yield call(firebaseAuth)
      yield put(logoutSuccess());
    } catch (err) {
      const authInfo: AuthType = yield select(state => state.Login);
      yield put(logoutFailure({...authInfo, errorMessage: err});
   }
}

function* requestLogin() {
  yield put(loginRequest());
  const authInfo: AuthType = yield select(state => state.Login);

  try {
    const firebaseAuth = ({ email, password }) =>
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => {
          throw error;
        });

    const user: FirebaseUserType = yield call(firebaseAuth, {
      email: authInfo.mailAddress,
      password: authInfo.password
    });
    yield put(loginSuccess({ ...authInfo, userId: user.uid }));
  } catch (error) {
    yield put(loginFailure({ ...authInfo, errorMessage: getErrorMessage(error) }));
  }
}

function* rootSaga() {
  yield takeEvery(Actions.SET_AUTH_INFO, requestLogin);
  yield takeEvery(Actions.LOGOUT_REQUEST, requestLogout);
}

export default rootSaga;
