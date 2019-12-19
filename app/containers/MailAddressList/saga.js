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
  updateLastLoginFailure,
  updateLastLoginSuccess,
  updateMailAddressFailure,
  updateMailAddressSuccess,
  setPageSizeSuccess,
  setPageSizeFailure
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
import { updateSequenceRequest } from '../Sequence/actions';
import { saveAliasMailRequest} from "../AliasMailInfo/actions";

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
      // stateから現在のmailAccountsを取得
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

/**
 * databseへメールアカウントを登録
 * 登録前に、mailAccountを使用してダブりチェック
 * @param action
 * @returns {IterableIterator<*>}
 */
function* createMailAccount(action) {
  console.log('call create account');
  const userAuth = yield select(state => state.Login);
  const newAccount = {
    accountId: action.payload.accountId,
    password: action.payload.password,
    mailAddress: action.payload.mailAddress,
    provider: action.payload.provider,
    createDate: action.payload.createDate,
    lastLogin: 0,
    tags: action.payload.tags,
    detailInfo:
      action.payload.detailInfo === undefined ||
      action.payload.detailInfo === null ||
      action.payload.detailInfo.length === 0
        ? ['詳細情報なし']
        : action.payload.detailInfo
  };
  const currentAccounts = yield select(state => state.MailAddressList.mailAccounts);

  try {
    // dup check
    console.log('dup check');
    console.log(newAccount.mailAddress);
    // eslint-disable-next-line arrow-body-style
    const dupAccount = currentAccounts.find(currentAccount => {
      return currentAccount.mailAddress === newAccount.mailAddress;
    });

    if (!dupAccount) {
      console.log('not dup');

      // gmailの場合、 連番利用時は、連番をカウントアップ
      console.log(`---gmail seq: ${action.payload.key}`);
      const sequences = yield select(state => state.Sequence.sequences);
      const selectedSequence = sequences.find(g => g.key === action.payload.key);
      console.log('---selected sequence---');
      console.log(selectedSequence);
      if (selectedSequence) {
        yield put(
          updateSequenceRequest({
            ...selectedSequence,
            sequence: selectedSequence.sequence + 1
          })
        );
      }

      // Yahoo!メールの場合、gmailアカウントのsequenceをカウントアップ
      if (newAccount.provider === 'Yahoo') {
        console.log('--provider: Yahoo')
        // key='ignore'の場合には作成をスキップ
        if (action.payload.key !== 'ignore') {
          const aliasInfos = yield select(state => state.AliasMailInfo.aliasMailInfo);
          const gmailInfo = aliasInfos.find(infos => infos.provider === 'gmail');
          console.log('--got gmailInfo');
          console.log(gmailInfo);
          if (!gmailInfo) {
            yield put(createMailAddressFailure('GmailにおいてYahoo!メール連絡先メールアドレス作成用カウンターの更新に失敗しました。'));
          }
          // "連絡先メールアドレス:"をdetailInfoから取得
          const yahooContactMailAddress = action.payload.detailInfo.find(d => d.contains('連絡先メールアドレス:'));
          // 取得出来た場合
          if (yahooContactMailAddress) {
            // SequenceCounter値を取得
            let sq = yahooContactMailAddress.replace('連絡先メールアドレス:', '');
            sq = sq.replace(/@.*$/, '');
            console.log(`delete at to end:${sq}`);
            sq = sq.replace(/^,*\+y/, '');
            console.log(`delete top to +y:${sq}`);
            // 取得部分がnumberかをチェック
            if (parseInt(sq, 10) != NaN) {
              yield put(saveAliasMailRequest({
                ...gmailInfo,
                sequenceCounter: sq + 1
              }));
              console.log('update gmail sequenceCounter');
            }
          }
        }
      }

      console.log(`start to save db:${newAccount.key}`)
      if (action.payload.key !== 'ignore') {
        const ref = yield call(firebaseDbInsert, `/users/${userAuth.userId}/mailAccount`, newAccount);
        const addAccount = { ...newAccount, key: ref.key };
        currentAccounts.unshift(addAccount);
      }

      yield put(createMailAddressSuccess(currentAccounts));
    } else {
      console.log('found dup');
      yield put(createMailAddressFailure('このメールアドレスは、既に登録されています。'));
    }
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
  console.log('----update to-');
  console.log(action.payload);
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

/**
 * メールアカウント最終ログイン更新
 * @param action
 * @returns {IterableIterator<*>}
 */
function* updateLastLogin(action) {
  const userAuth: AuthType = yield select(state => state.Login);

  try {
    // firebaseをアップデート
    yield call(firebaseDbUpdate, `/users/${userAuth.userId}/mailAccount/${action.payload.key}`, {
      lastLogin: action.payload.lastLogin
    });
    // 更新前のmailAccountsを取得
    const mailAccounts: Array<MailAccountType> = yield select(
      state => state.MailAddressList.mailAccounts
    );

    // 更新前のmailAccountsから対象accountを入替
    const updatedList = mailAccounts.filter(m => m.key !== action.payload.key);
    updatedList.push(action.payload);
    updatedList.sort(mailAccountSort);

    yield put(updateLastLoginSuccess(updatedList));
  } catch (error) {
    yield put(updateLastLoginFailure(error.toString()));
  }
}

function* setPageSize(action) {
  try {
    yield put(setPageSizeSuccess(action.payload));
  } catch (error) {
    yield put(setPageSizeFailure({ errorMessage: error.toString() }));
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.IMPORT_MAIL_ADDRESS_REQUEST, importMailAccounts);
  yield takeEvery(Actions.CREATE_MAIL_ADDRESS_REQUEST, createMailAccount);
  yield takeEvery(Actions.GET_MAIL_ADDRESS_REQUEST, getMailAccounts);
  yield takeEvery(Actions.UPDATE_MAIL_ADDRESS_REQUEST, updateMailAccount);
  yield takeEvery(Actions.DELETE_MAIL_ADDRESS_REQUEST, deleteMailAccount);
  yield takeEvery(Actions.UPDATE_LAST_LOGIN_REQUEST, updateLastLogin);
  yield takeEvery(Actions.SET_PAGE_SIZE_REQUEST, setPageSize);
}

export default rootSaga;
