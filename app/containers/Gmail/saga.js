// @flow
import type Saga from 'redux-saga';
import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
  getGmailInfoSuccess,
  getGmailInfoFailure,
  saveGmailInfoSuccess,
  saveGmailInfoFailure
} from './actions';
import { Actions } from './actionTypes';
import { firebaseDbSet, firebaseDbRead } from '../../database/db';
import type GmailType from '../../types/gmail';
import { initialGmailInfo } from './reducer';

function* saveGmailInfo(action) {
  try {
    const userAuth = yield select(state => state.Login);
    const gmailInfo = {
      ...action.payload
    };
    yield call(firebaseDbSet, `/users/${userAuth.userId}/gmailInfo`, gmailInfo);
    yield put(saveGmailInfoSuccess(gmailInfo));
  } catch (error) {
    yield put(saveGmailInfoFailure({ errorMessage: error.toString() }));
  }
}

function* getGmailInfo() {
  try {
    const userAuth = yield select(state => state.Login);
    let gmailInfo: GmailType = {
      ...initialGmailInfo
    };

    if (userAuth.userId.length !== 0) {
      const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/gmailInfo`);
      if (snapshot.child('accountId').val() !== null) {
        gmailInfo = {
          accountId: snapshot.child('accountId').val(),
          domain: snapshot.child('domain').val(),
          password: snapshot.child('password').val(),
          random: snapshot.child('random').val()
        };
      }
    }

    yield put(getGmailInfoSuccess(gmailInfo));
  } catch (error) {
    yield put(getGmailInfoFailure({ errorMessage: error.toString() }));
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.SAVE_GMAIL_INFO_REQUEST, saveGmailInfo);
  yield takeEvery(Actions.GET_GMAIL_INFO_REQUEST, getGmailInfo);
}

export default rootSaga;
