// @flow
import type Saga from 'redux-saga';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  createSequenceFailure,
  createSequenceSuccess,
  deleteSequenceFailure,
  deleteSequenceSuccess,
  getSequenceFailure,
  getSequenceSuccess,
  updateSequenceFailure,
  updateSequenceSuccess
} from './actions';
import { Actions } from './actionTypes';
import { firebaseDbDelete, firebaseDbInsert, firebaseDbRead, firebaseDbUpdate } from '../../database/db';
import type SequenceType from '../../types/sequence';

/**
 * 用連番データ並べ替え方法
 *
 * 優先: 接頭語(prefix), 接尾語(suffix), 連番
 * @param a
 * @param b
 * @returns {number}
 */
const sequenceSort = (a: SequenceType, b: SequenceType) => {
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
 * 連番追加
 * @param action
 * @returns {IterableIterator<*>}
 */
function* createSequence(action) {
  try {
    const userAuth = yield select(state => state.Login);
    const currentSequences = yield select(state => state.Sequence.sequences);

    const ref = yield call(firebaseDbInsert, `/users/${userAuth.userId}/sequences`, {
      sequence: action.payload.sequence,
      sequenceDigit: action.payload.sequenceDigit,
      prefix: action.payload.prefix,
      suffix: action.payload.suffix
    });
    const newSequence = { ...action.payload, key: ref.key };
    currentSequences.push(newSequence);
    currentSequences.sort(sequenceSort);
    yield put(createSequenceSuccess(currentSequences));
  } catch (error) {
    yield put(createSequenceFailure({ errorMessage: error.toString() }));
  }
}

/**
 * 用連番更新
 * @param action
 * @returns {IterableIterator<*>}
 */
function* updateSequence(action) {
  try {
    const userAuth = yield select(state => state.Login);
    yield call(firebaseDbUpdate, `/users/${userAuth.userId}/sequences/${action.payload.key}`, {
      sequence: action.payload.sequence,
      sequenceDigit: action.payload.sequenceDigit,
      prefix: action.payload.prefix,
      suffix: action.payload.suffix
    });

    const currentSequences = yield select(state => state.Sequence.sequences);
    const updatedSequences = currentSequences.filter(s => s.key !== action.payload.key);
    updatedSequences.push(action.payload);
    updatedSequences.sort(sequenceSort);
    yield put(updateSequenceSuccess(updatedSequences));
  } catch (error) {
    yield put(updateSequenceFailure({ errorMessage: error.toString() }));
  }
}

/**
 * 用連番データ取得
 * @returns {IterableIterator<*>}
 */
function* getSequence() {
  try {
    const userAuth = yield select(state => state.Login);
    const sequences: Array<SequenceType> = [];

    const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/sequences`);

    snapshot.forEach(childSnapshot => {
      sequences.push({
        key: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    sequences.sort(sequenceSort);
    yield put(getSequenceSuccess(sequences));
  } catch (error) {
    yield put(getSequenceFailure({ errorMessage: error.toString() }));
  }
}

/**
 * 用連番データ削除
 * @param action
 * @returns {IterableIterator<*>}
 */
function* deleteSequence(action) {
  try {
    const userAuth = yield select(state => state.Login);
    yield call(firebaseDbDelete, `/users/${userAuth.userId}/sequences/${action.payload.key}`);

    const currentSequences = yield select(state => state.Sequence.sequences);
    const deletedSequences = currentSequences.filter(s => s.key !== action.payload.key);
    yield put(deleteSequenceSuccess(deletedSequences));
  } catch (error) {
    yield put(deleteSequenceFailure({ errorMessage: error.toString() }));
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.CREATE_SEQUENCE_REQUEST, createSequence);
  yield takeEvery(Actions.UPDATE_SEQUENCE_REQUEST, updateSequence);
  yield takeEvery(Actions.GET_SEQUENCE_REQUEST, getSequence);
  yield takeEvery(Actions.DELETE_SEQUENCE_REQUEST, deleteSequence);
}

export default rootSaga;
