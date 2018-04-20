/* eslint-disable function-paren-newline */
// @flow
import type Saga from 'redux-saga';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import {
  createBlogFailure,
  createBlogSuccess,
  deleteBlogFailure,
  deleteBlogSuccess,
  getBlogsFailure,
  getBlogsSuccess,
  importBlogsFailure,
  importBlogsSuccess,
  updateBlogFailure,
  updateBlogSuccess
} from './actions';
import { Actions } from './actionTypes';

import {
  firebaseDbDelete,
  firebaseDbInsert,
  firebaseDbRead,
  firebaseDbUpdate
} from '../../database/db';
import type BlogAccountType from '../../types/blogAccount';
import type { AuthType } from '../../types/auth';

/**
 * ブログアカウントソート 第1優先:提供元  第2優先：ブログ名
 * @param a
 * @param b
 * @returns {number}
 */
const blogAccountSort = (a: BlogAccountType, b: BlogAccountType) => {
  if (a.provider < b.provider) return -1;
  if (a.provider > b.provider) return 1;
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  return 0;
};

/**
 * ブログアカウントの一括インポート
 * @param action
 * @returns {IterableIterator<*>}
 */
function* importBlogAccounts(action) {
  try {
    // import用に受け取ったblogAccountが既に存在しないかをチェック
    const blogAccounts: Array<BlogAccountType> = action.payload;

    if (blogAccounts.length > 0) {
      const existsBlogAccounts = yield select(state => state.BlogList.blogAccounts);

      // blogAccounts内のaccoutを現在のstateにあるかチェック
      const importAccounts = blogAccounts.filter(importAccount => {
        const notDupAccounts = existsBlogAccounts.filter(
          existsAccount => importAccount.url !== existsAccount.url
        );
        return notDupAccounts.length === existsBlogAccounts.length;
      });

      // 重複アカウントをまとめる
      const errorAccounts = blogAccounts.filter(importAccount => {
        const notDupAccounts = existsBlogAccounts.filter(
          existsAccount => importAccount.url !== existsAccount.url
        );
        return notDupAccounts.length !== existsBlogAccounts.length;
      });

      const checkedImportAccounts = [];
      importAccounts.forEach(b => {
        if (b.provider !== 'unknown') {
          checkedImportAccounts.push(b);
        } else {
          errorAccounts.push(b);
        }
      });

      // importAccountsをfirebaseへ登録
      // userIdが必要
      const userAuth: AuthType = yield select(state => state.Login);
      yield all(
        checkedImportAccounts.map(b =>
          call(firebaseDbInsert, `/users/${userAuth.userId}/blogAccount`, {
            accountId: b.accountId,
            password: b.password,
            mailAddress: b.mailAddress,
            provider: b.provider,
            title: b.title,
            description: b.description,
            url: b.url,
            remark: b.remark,
            createDate: b.createDate,
            detailInfo:
              b.detailInfo === undefined || b.detailInfo === null || b.detailInfo.length === 0
                ? ['詳細情報なし']
                : b.detailInfo,
            apiId: b.apiId,
            apiPass: b.apiPass,
            blogId: b.blogId,
            endPoint: b.endPoint,
            groupTags: b.groupTags,
            affiliateTags:
              b.affiliateTags === undefined ||
              b.affiliateTags === null ||
              b.affiliateTags.length === 0
                ? ['アフィリエイト情報なし']
                : b.affiliateTags
          })
        )
      );

      // firebaseから最新のblogAccountsを取得
      const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/blogAccount`);
      const latestBlogAccounts: Array<BlogAccountType> = [];

      snapshot.forEach(childSnapshot => {
        latestBlogAccounts.push({
          key: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      latestBlogAccounts.sort(blogAccountSort);

      // 最新アカウント、重複アカウントを返す
      yield put(
        importBlogsSuccess(latestBlogAccounts, {
          errorAccounts,
          req: blogAccounts.length,
          in: checkedImportAccounts.length,
          out: errorAccounts.length
        })
      );
    }
  } catch (error) {
    yield put(importBlogsFailure(error.toString()));
  }
}

function* createBlogAccount(action) {
  const userAuth: AuthType = yield select(state => state.Login);
  const newAccount: BlogAccountType = { ...action.payload };
  try {
    const ref = yield call(firebaseDbInsert, `/users/${userAuth.userId}/blogAccount`, newAccount);
    const blogAccounts = yield select(state => state.BlogList.blogAccounts);
    yield put(
      createBlogSuccess(...blogAccounts.push({ ...newAccount, key: ref }).sort(blogAccountSort))
    );
  } catch (error) {
    yield put(createBlogFailure(error.toString()));
  }
}

/**
 * ブログアカウント取得メソッド
 * @returns {IterableIterator<*>}
 */
function* getBlogAccounts() {
  const userAuth = yield select(state => state.Login);

  try {
    const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/blogAccount`);
    const blogAccounts: Array<BlogAccountType> = [];

    snapshot.forEach(childSnapshot => {
      blogAccounts.push({
        key: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    blogAccounts.sort(blogAccountSort);

    yield put(getBlogsSuccess(blogAccounts));
  } catch (error) {
    yield put(getBlogsFailure(error.toString()));
  }
}

/**
 * ブログアカウント情報更新メソッド
 * @param action
 * @returns {IterableIterator<*>}
 */
function* updateBlogAccount(action) {
  const userAuth = yield select(state => state.Login);
  try {
    // firebaseをアップデート
    yield call(firebaseDbUpdate, `/users/${userAuth.userId}/blogAccount/${action.payload.key}`, {
      password: action.payload.password,
      mailAddress: action.payload.mailAddress,
      title: action.payload.title,
      description: action.payload.description,
      remark: action.payload.remark,
      apiId: action.payload.apiId,
      apiPass: action.payload.apiPass,
      blogId: action.payload.blogId,
      endPoint: action.payload.endPoint,
      groupTags: action.payload.groupTags,
      affiliateTags: action.payload.affiliateTags
    });

    // 更新前のblogAccouts
    const blogAccounts: Array<BlogAccountType> = yield select(state => state.BlogList.blogAccounts);
    // 更新対象の位置を取得
    const updatedList = blogAccounts.filter(b => b.key !== action.payload.key);

    updatedList.push(action.payload);
    updatedList.sort(blogAccountSort);

    yield put(updateBlogSuccess(updatedList));
  } catch (error) {
    yield put(updateBlogFailure(error.toString()));
  }
}

/**
 * ブログ情報削除メソッド
 * @param action
 * @returns {IterableIterator<*>}
 */
function* deleteBlogAccount(action) {
  const userAuth: AuthType = yield select(state => state.Login);

  try {
    yield call(firebaseDbDelete, `/users/${userAuth.userId}/blogAccount/${action.payload.key}`);
    const blogAccounts: Array<BlogAccountType> = yield select(state => state.BlogList.blogAccounts);

    const deletedAccounts = blogAccounts.filter(acc => acc.key !== action.payload.key);
    deletedAccounts.sort(blogAccountSort);
    yield put(deleteBlogSuccess(deletedAccounts));
  } catch (error) {
    yield put(deleteBlogFailure(error.toString()));
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.IMPORT_BLOGS_REQUEST, importBlogAccounts);
  yield takeEvery(Actions.CREATE_BLOG_REQUEST, createBlogAccount);
  yield takeEvery(Actions.GET_BLOGS_REQUEST, getBlogAccounts);
  yield takeEvery(Actions.UPDATE_BLOG_REQUEST, updateBlogAccount);
  yield takeEvery(Actions.DELETE_BLOG_REQUEST, deleteBlogAccount);
}

export default rootSaga;
