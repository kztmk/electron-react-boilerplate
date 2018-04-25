/* eslint-disable function-paren-newline */
// @flow
import type Saga from 'redux-saga';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import {
  createMailAddressFailure,
  createMailAddressSuccess,
  deleteMailAddressFailure,
  deleteMailAddressSuccess,
  getMailAddressFailure,
  getMailAddressSuccess,
  importMailAddressFailure,
  importMailAddressSuccess,
  updateMailAddressFailure,
  updateMailAddressSuccess
} from './actions';
import { Actions } from './actionTypes';

import {
  firebaseDbDelete,
  firebaseDbInsert,
  firebaseDbRead,
  firebaseDbUpdate
} from '../../database/db';
import type MailAccountType from '../../types/mailAccount';
import type { AuthType } from '../../types/auth';

/**
 * メールアカウントソート 第1優先：最終ログイン、第2優先：提供元
 * @param a
 * @param b
 * @returns {number}
 */
const mailAccountSort = (a: MailAccountType, b: MailAccountType) => {
  if (a.lastLogin > b.lastLogin) return -1;
  if (a.lastLogin < b.lastLogin) return 1;
  if (a.provider > b.provider) return -1;
  if (a.provider < b.provider) return 1;
  return 0;
};

function* getExistsAccounts(userId) {
  return existsAccounts;
}

/**
 * メールアカウントの一括インポート
 * @param action importMailAddressRequest
 * @returns {IterableIterator<*>}
 */
function* importMailAccounts(action) {
  try {
    const userAuth = yield select(state => state.Login);
    // import用に受け取ったmailAddressが既に存在するかをチェック
    const mailAccounts: Array<MailAccountType> = action.payload;

    if (mailAccounts.length > 0) {
      // stateから現在のmailAccoutsを取得
      const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/mailAccount`);
      const existsMailAccounts: Array<MailAccountType> = [];

      snapshot.forEach(childSnapshot => {
        existsMailAccounts.push({
          key: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      // mailAddressを現在のstateにあるかチェック
      // 現在のmailAccountsに存在しないimport用mailAccounts
      const importAccounts = mailAccounts.filter(importAccount => {
        const notDupAccounts = existsMailAccounts.filter(
          existsAccount => importAccount.mailAddress !== existsAccount.mailAddress
        );
        return notDupAccounts.length === existsMailAccounts.length;
      });

      // 現在のmailAccountsに存在するdup mailAccounts
      const errorAccounts = mailAccounts.filter(importAccount => {
        const notDupAccounts = existsMailAccounts.filter(
          existsMailAccount => importAccount.mailAddress !== existsMailAccount.mailAddress
        );
        return notDupAccounts.length !== existsMailAccounts.length;
      });

      // 提供元がV5対応以外をunknownでマークしてあるものをdupアカウントへ追加
      const checkedAccounts = [];
      importAccounts.forEach(m => {
        if (m.provider !== 'unknown') {
          checkedAccounts.push(m);
        } else {
          errorAccounts.push(m);
        }
      });

      // importAccountsをfirebaseへ登録
      yield all(
        checkedAccounts.map(m =>
          call(firebaseDbInsert, `/users/${userAuth.userId}/mailAccount`, {
            accountId: m.accountId,
            password: m.password,
            mailAddress: m.mailAddress,
            provider: m.provider,
            createDate: m.createDate,
            lastLogin: m.lastLogin,
            tags: m.tags,
            detailInfo:
              m.detailInfo === undefined || m.detailInfo === null || m.detailInfo.length === 0
                ? ['詳細情報なし']
                : m.detailInfo
          })
        )
      );

      // firebaseから現在のmailAccountsを取得
      const snapshotLatest = yield call(firebaseDbRead, `/users/${userAuth.userId}/mailAccount`);
      const latestMailAccounts: Array<MailAccountType> = [];

      snapshotLatest.forEach(childSnapshot => {
        latestMailAccounts.push({
          key: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      latestMailAccounts.sort(mailAccountSort);

      // import出来なかったerrorAccountsを、state.importAccountsへ
      yield put(
        importMailAddressSuccess(latestMailAccounts, {
          errorAccounts,
          req: mailAccounts.length,
          in: checkedAccounts.length,
          out: errorAccounts.length
        })
      );
    }
  } catch (error) {
    yield put(importMailAddressFailure(error.toString()));
  }
}

function* createMailAccount(action) {
  const userAuth = yield select(state => state.Login);
  const newAccount: MailAccountType = { ...action.payload };
  try {
    const ref = yield call(firebaseDbInsert, `/users/${userAuth.userId}/mailAccount`, newAccount);
    const mailAccounts = yield select(state => state.MailAddressList.mailAccounts);
    yield put(
      createMailAddressSuccess(
        ...mailAccounts.push({ ...newAccount, key: ref.key }).sort(mailAccountSort)
      )
    );
  } catch (error) {
    yield put(createMailAddressFailure(error.toString()));
  }
}

/**
 * メールアカウント取得メソッド
 * firebaseから、userIdのメールアカウントを取得
 * @returns {IterableIterator<*>}
 */
function* getMailAccounts() {
  const userAuth = yield select(state => state.Login);

  try {
    const mailAccounts: Array<MailAccountType> = [];
    const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/mailAccount`);

    snapshot.forEach(childSnapshot => {
      mailAccounts.push({
        key: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    // Sort
    mailAccounts.sort(mailAccountSort);

    yield put(getMailAddressSuccess(mailAccounts));
  } catch (error) {
    yield put(getMailAddressFailure(error.toString()));
  }
}

/**
 * メールアカウント更新メソッド
 * @param action
 * @returns {IterableIterator<*>}
 */
function* updateMailAccount(action) {
  const userAuth = yield select(state => state.Login);
  try {
    // firebaseをアップデート
    yield call(firebaseDbUpdate, `/users/${userAuth.userId}/mailAccount/${action.payload.key}`, {
      password: action.payload.password,
      lastLogin: action.payload.lastLogin,
      tags: action.payload.tags
    });
    // 更新前のmailAccountsを取得
    const mailAccounts: Array<MailAccountType> = yield select(
      state => state.MailAddressList.mailAccounts
    );

    // 更新前のmailAccountsから対象accountを入替
    const updatedList = mailAccounts.filter(m => m.key !== action.payload.key);
    updatedList.push(action.payload);
    updatedList.sort(mailAccountSort);

    yield put(updateMailAddressSuccess(updatedList));
  } catch (error) {
    yield put(updateMailAddressFailure(error.toString()));
  }
}

/**
 * メールアカウント削除メソッド
 * @param action deleteMailAddressRequest
 * @returns {IterableIterator<*>}
 */
function* deleteMailAccount(action) {
  const userAuth: AuthType = yield select(state => state.Login);

  try {
    // firebaseから削除
    yield call(firebaseDbDelete, `/users/${userAuth.userId}/mailAccount/${action.payload.key}`);
    const mailAccounts: Array<MailAccountType> = yield select(
      state => state.MailAddressList.mailAccounts
    );
    // 現在のmailAccountsから対象を削除
    const deletedAccounts = mailAccounts.filter(acc => acc.key !== action.payload.key);
    deletedAccounts.sort(mailAccountSort);
    yield put(deleteMailAddressSuccess(deletedAccounts));
  } catch (error) {
    yield put(deleteMailAddressFailure(error.toString()));
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.IMPORT_MAIL_ADDRESS_REQUEST, importMailAccounts);
  yield takeEvery(Actions.CREATE_MAIL_ADDRESS_REQUEST, createMailAccount);
  yield takeEvery(Actions.GET_MAIL_ADDRESS_REQUEST, getMailAccounts);
  yield takeEvery(Actions.UPDATE_MAIL_ADDRESS_REQUEST, updateMailAccount);
  yield takeEvery(Actions.DELETE_MAIL_ADDRESS_REQUEST, deleteMailAccount);
}

export default rootSaga;
