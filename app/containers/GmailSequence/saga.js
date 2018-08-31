// @flow
import type Saga from 'redux-saga';
import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
  createGmailSequenceSuccess,
  createGmailSequenceFailure,
  updateGmailSequenceSuccess,
  updateGmailSequenceFailure,
  getGmailSequenceSuccess,
  getGmailSequenceFailure,
  deleteGmailSequenceSuccess,
  deleteGmailSequenceFailure
} from './actions';
import { Actions } from './actionTypes';
import {
  firebaseDbInsert,
  firebaseDbUpdate,
  firebaseDbRead,
  firebaseDbDelete
} from '../../database/db';
import type { GmailSequenceType } from '../../types/gmail';

/**
 * gmail用連番データ並べ替え方法
 *
 * 優先: 接頭語(prefix), 接尾語(suffix), 連番
 * @param a
 * @param b
 * @returns {number}
 */
const sequenceSort = (a: GmailSequenceType, b: GmailSequenceType) => {
  const prefixA = a.prefix.toLowerCase();
  const prefixB = b.prefix.toLowerCase();
  const suffixA = a.suffix.toLowerCase();
  const suffixB = b.suffix.toLowerCase();

  if (prefixA < prefixB) return -1;
  if (prefixA > prefixB) return 1;
  if (suffixA < suffixB) return -1;
  if (suffixA > suffixB) return 1;
  if (a.sequence < b.sequence) return -1;
  if (a.sequence > b.sequence) return 1;
  return 0;
};

/**
 * gmail用連番追加
 * @param action
 * @returns {IterableIterator<*>}
 */
function* createGmailSequence(action) {
  try {
    const userAuth = yield select(state => state.Login);
    const currentSequences = yield select(state => state.GmailSequence.gmailSequences);

    const ref = yield call(
      firebaseDbInsert,
      `/users/${userAuth.userId}/gmailInfo/sequences`,
      action.payload
    );
    const newSequence = { ...action.payload, key: ref.key };
    currentSequences.push(newSequence);
    currentSequences.sort(sequenceSort);
    yield put(createGmailSequenceSuccess(currentSequences));
  } catch (error) {
    yield put(createGmailSequenceFailure({ errorMessage: error.toString() }));
  }
}

/**
 * gmail用連番更新
 * @param action
 * @returns {IterableIterator<*>}
 */
function* updateGmailSequence(action) {
  try {
    const userAuth = yield select(state => state.Login);
    yield call(
      firebaseDbUpdate,
      `/users/${userAuth.userId}/gmailInfo/sequences/${action.payload.key}`,
      {
        sequence: action.payload.sequence,
        sequenceDigit: action.payload.sequenceDigit,
        prefix: action.payload.prefix,
        suffix: action.payload.suffix
      }
    );

    const currentSequences = yield select(state => state.GmailSequence.gmailSequences);
    const updatedSequences = currentSequences.filter(s => s.key !== action.payload.key);
    updatedSequences.push(action.payload);
    updatedSequences.sort(sequenceSort);
    yield put(updateGmailSequenceSuccess(updatedSequences));
  } catch (error) {
    yield put(updateGmailSequenceFailure({ errorMessage: error.toString() }));
  }
}

/**
 * gmail用連番データ取得
 * @returns {IterableIterator<*>}
 */
function* getGmailSequence() {
  try {
    const userAuth = yield select(state => state.Login);
    const gmailInfo = yield select(state => state.Gmail.gmailInfo);
    const sequences = [];

    if (gmailInfo && gmailInfo.accountId.length > 0) {
      const snapshot = yield call(firebaseDbRead(`/users/${userAuth.userId}/gmailInfo/sequences`));

      snapshot.forEach(childSnapshot => {
        sequences.push({
          key: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      sequences.sort(sequenceSort);
    }
    yield put(getGmailSequenceSuccess(sequences));
  } catch (error) {
    yield put(getGmailSequenceFailure({ errorMessage: error.toString() }));
  }
}

/**
 * gmail用連番データ削除
 * @param action
 * @returns {IterableIterator<*>}
 */
function* deleteGmailSequence(action) {
  try {
    const userAuth = yield select(state => state.Login);
    yield call(
      firebaseDbDelete,
      `/users/${userAuth.userId}/gmailInfo/sequences/${action.payload.key}`
    );

    const currentSequences = yield select(state => state.GmailSequence.gmailSequences);
    const deletedSequences = currentSequences.filter(s => s.key !== action.payload.key);
    yield put(deleteGmailSequenceSuccess(deletedSequences));
  } catch (error) {
    yield put(deleteGmailSequenceFailure({ errorMessage: error.toString() }));
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.CREATE_GMAIL_SEQUENCE_REQUEST, createGmailSequence);
  yield takeEvery(Actions.UPDATE_GMAIL_SEQUENCE_REQUEST, updateGmailSequence);
  yield takeEvery(Actions.GET_GMAIL_SEQUENCE_REQUEST, getGmailSequence);
  yield takeEvery(Actions.DELETE_GMAIL_SEQUENCE_REQUEST, deleteGmailSequence);
}

export default rootSaga;
