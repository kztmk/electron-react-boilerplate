// @flow
import { fork, all } from 'redux-saga/effects'; // eslint-disable-line
import Login from './containers/Login/saga';
import ResetPassword from './containers/ResetPassword/saga';
import Profile from './containers/Profile/saga';

function* root(): Generator<*, void, void> {
  yield all([fork(Login), fork(ResetPassword), fork(Profile)]);
}

export default root;