// @flow
import type Saga from "redux-saga";
import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  getCpanelsSuccess,
  getCpanelsFailure,
  createCpanelSuccess,
  createCpanelFailure,
  updateCpanelSuccess,
  updateCpanelFailure,
  deleteCpanelSuccess,
  deleteCpanelFailure
} from "./actions";
import {Actions} from './actionTypes';
import { firebaseDbDelete, firebaseDbInsert, firebaseDbRead, firebaseDbUpdate } from "../../database/db";
import type CpanelType from "../../types/cpanelType";

const cpanelSort = (a: CpanelType, b: CpanelType) =>{
  if (a.domain > b.domain) return 1;
  if (a.domain < b.domain) return -1;
}


function* createCpanel(action) {
  const userAuth = yield select(state => state.Login);
  // dup check
  const currentCpanels = yield select(state => state.Cpanel.cpanels);
  const newCpanel = {
    host: action.payload.host,
    domain: action.payload.domain,
    loginName: action.payload.loginName,
    password: action.payload.password
  }
  try {
    const dup = currentCpanels.find(c => c.domain === action.payload.domain);

    if (!dup) {
      const ref = yield call(firebaseDbInsert, `/users/${userAuth.userId}/cpanels`, newCpanel);
      const addCpanel = { ...newCpanel, key: ref.key };
      currentCpanels.push(addCpanel);
      yield put(createCpanelSuccess(currentCpanels));
    } else {
      yield put(createCpanelFailure({errorMessage: 'このURLは既に登録されています。'}));
    }
  }
  catch (error) {
    yield put(createCpanelFailure({errorMessage: error.toString()}))
  }
}

function* getCpanels() {
  const userAuth = yield select(state => state.Login);

  try {
    const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/cpanels`);
    const cpanels: Array<CpanelType> = [];

    snapshot.forEach(childSnapshot => {
      cpanels.push({
        key: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    cpanels.sort(cpanelSort);

    yield put(getCpanelsSuccess(cpanels));
  } catch (error) {
    yield put(getCpanelsFailure({errorMessage: error.toString()}));
  }
}


function* updateCpanel(action) {
  const userAuth = yield select(state => state.Login);
  const currentCpanels = yield select(state => state.Cpanel.cpanels);

  try {
    // firebaseをupdate
    yield call(firebaseDbUpdate, `/users/${userAuth.userId}/cpanels/${action.payload.key}`, {
      host: action.payload.host,
      domain: action.payload.domain,
      loginName: action.payload.loginName,
      password: action.payload.password
    });

    const updateCpanels = currentCpanels.filter(c => c.domain !== action.payload.domain);
    updateCpanels.push(action.payload.domain);
    updateCpanels.sort(cpanelSort);

    yield put(updateCpanelSuccess(updateCpanels))
  } catch (error) {
    yield put(updateCpanelFailure({errorMessage: error.toString()}));
  }

}

function* deleteCpanel(action) {
  const userAuth = yield select(state => state.Login);

  try {
    yield call(firebaseDbDelete, `/users/${userAuth.userId}/cpanels/${action.payload.key}`);
    const currentCpanels = yield select(state => state.Cpanel.cpanels);

    const deletedCpanels = currentCpanels.find(c => c.domain !== action.payload.domain);

    yield put(deleteCpanelSuccess(deletedCpanels));
  } catch (error) {
    yield put(deleteCpanelFailure({errorMessage: error.toString()}));
  }

}

function* rootSaga(): Saga {
  yield takeEvery(Actions.GET_CPANELS_REQUEST, getCpanels);
  yield takeEvery(Actions.CREATE_CPANEL_REQUEST, createCpanel);
  yield takeEvery(Actions.UPDATE_CPANEL_REQUEST, updateCpanel);
  yield takeEvery(Actions.DELETE_CPANEL_REQUEST, deleteCpanel);
}


export default rootSaga;
