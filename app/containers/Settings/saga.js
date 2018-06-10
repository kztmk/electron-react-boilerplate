// @flow
import type Saga from 'redux-saga';
import { put, call, takeEvery, select } from 'redux-saga/effects';
import { Actions } from './actionTypes';
import type { AuthType } from '../../types/auth';
import { firebaseDbInsert, firebaseDbRead, firebaseDbUpdate } from '../../database/db';
import {
  createSettingsFailure,
  createSettingsSuccess,
  getSettingsFailure,
  getSettingsSuccess,
  updateSettingsFailure
} from './actions';

function* saveSettings(action) {
  const userAuth: AuthType = yield select(state => state.Login);
  // keyを持っていないものが新規保存対象
  const newSettings = action.payload.map(setting => setting.key === '');
  try {
    const insertedSettings = [];
    yield all(
      newSettings.forEach(setting => {
        const ref = call(firebaseDbInsert, `/users/${userAuth.userId}/settings`, {
          category: setting.category,
          name: setting.name,
          value: setting.value
        });
        insertedSettings.push({
          key: ref.key,
          category: setting.category,
          name: setting.name,
          value: setting.value
        });
      })
    );
    const currentSettings = yield select(state => state.Settings);
    const updatedSettings = { ...currentSettings, ...insertedSettings };
    yield put(createSettingsSuccess(updatedSettings));
  } catch (error) {
    yield put(createSettingsFailure({ errorMessage: error.toString() }));
  }
}

function* getSettings() {
  const userAuth: AuthType = yield select(state => state.Login);
  if (userAuth.userId.length === 0) throw Error('ログイン情報の取得に失敗しました。');

  try {
    const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/settings`);
    const settings = [];

    snapshot.forEach(childSnapshot => {
      settings.push({
        key: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    yield put(getSettingsSuccess(settings));
  } catch (error) {
    yield put(getSettingsFailure({ errorMessage: error.toString() }));
  }
}

function* updateSettings(action) {
  const userAuth: AuthType = yield select(state => state.Login);
  if (userAuth.userId.length === 0) throw Error('ログイン情報の取得に失敗しました。');

  try {
    // keyがあればupdate, keyがなければ新規追加
    const newSettings = yield all(
      action.payload.map(setting => {
        if (setting.key === '') {
          const ref = call(firebaseDbInsert, `/users/${userAuth.userId}/settings`, {
            category: setting.category,
            name: setting.name,
            value: setting.value
          });
          return {
            key: ref.key,
            category: setting.category,
            name: setting.name,
            value: setting.value
          };
        } else {
          call(firebaseDbUpdate, `/users/${userAuth.userId}/settings/${setting.key}`, {
            category: setting.category,
            name: setting.name,
            value: setting.value
          });
          return {
            key: setting.key,
            category: setting.category,
            name: setting.name,
            value: setting.value
          };
        }
      })
    );
    yield put(updateSettings(newSettings));
  } catch (error) {
    yield put(updateSettingsFailure({ errorMessage: error.toString() }));
  }
}

function* deleteSettings() {
  const userAuth: AuthType = yield select(state => state.Login);
  if (userAuth.userId.length === 0) throw Error('ログイン情報の取得に失敗しました。');
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.CREATE_SETTINGS_REQUEST, saveSettings);
  yield takeEvery(Actions.GET_SETTINGS_REQUEST, getSettings);
  yield takeEvery(Actions.UPDATE_SETTINGS_REQUEST, updateSettings);
  yield takeEvery(Actions.DELETE_SETTINGS_REQUEST, deleteSettings);
}

export default rootSaga;
