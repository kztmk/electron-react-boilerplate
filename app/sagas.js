// @flow
import { fork, all } from 'redux-saga/effects'; // eslint-disable-line
import Login from './containers/Login/saga';

function* root(): Generator<*, void, void> {
  yield fork(Login);
}

export default root;
