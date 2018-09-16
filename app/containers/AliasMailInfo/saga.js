// @flow
import type Saga from 'redux-saga';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Actions } from './actionTypes';
import {
  deleteAliasMailFailure,
  deleteAliasMailSuccess,
  getAliasMailFailure,
  getAliasMailSuccess,
  saveAliasMailFailure,
  saveAliasMailSuccess
} from './actions';
import { firebaseDbDelete, firebaseDbRead, firebaseDbSet } from '../../database/db';
import type AliasMailType from '../../types/aliasMailInfo';

function* saveAliasMail(action) {
  try {
    const userAuth = yield select(state => state.Login);
    console.log('----g alias');
    console.log(action.payload);
    const alias = { ...action.payload }
    // update
    yield call(firebaseDbSet, `/users/${userAuth.userId}/aliasMails/${alias.provider}`, {
      accountId: alias.accountId,
      password: alias.password,
      domain: alias.domain,
      firstName: alias.firstName,
      firstNameKana: alias.firstNameKana,
      lastName: alias.lastName,
      lastNameKana: alias.lastNameKana,
      gender: alias.gender,
      birthDate: alias.birthDate,
      contactMail: alias.contactMail,
      postalCode: alias.postalCode,
      prefecture: alias.prefecture,
      secretQuestion: alias.secretQuestion,
      secretAnswer: alias.secretAnswer
    });

    console.log('---db complete--')
    const originalAliases: Array<AliasMailType> = yield select(state => state.AliasMailInfo.aliasMailInfo);

    console.log('----state aliases--');
    console.log(originalAliases);
    const restAliases = originalAliases.filter(a => a.provider !== alias.provider);
    console.log('---after delete');
    console.log(restAliases);
    console.log('--alias--');
    console.log(alias);
    restAliases.push(alias);

    yield put(saveAliasMailSuccess(restAliases));

  } catch (error) {
    yield put(saveAliasMailFailure({ errorMessage: error.toString() }));
  }
}

function* getAliasMails() {
  try {
    const userAuth = yield select(state => state.Login);

    if (userAuth.userId.length > 0) {
      const aliases: Array<AliasMailType> = [];
      const gmailSnapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/aliasMails/gmail`);

      if (gmailSnapshot.child('accountId').val() !== null) {
        const gmailAlias: AliasMailType = {
          provider: 'gmail',
          accountId: gmailSnapshot.child('accountId').val(),
          password: gmailSnapshot.child('password').val(),
          domain: gmailSnapshot.child('domain').val(),
          contactMail: gmailSnapshot.child('contactMail').val(),
          firstName: gmailSnapshot.child('firstName').val(),
          lastName: gmailSnapshot.child('lastName').val(),
          firstNameKana: gmailSnapshot.child('firstNameKana').val(),
          lastNameKana: gmailSnapshot.child('lastNameKana').val(),
          gender: gmailSnapshot.child('gender').val(),
          birthDate: gmailSnapshot.child('birthDate').val(),
          postalCode: gmailSnapshot.child('postalCode').val(),
          prefecture: gmailSnapshot.child('prefecture').val(),
          secretQuestion: gmailSnapshot.child('secretQuestion').val(),
          secretAnswer: gmailSnapshot.child('secretAnswer').val()
        };
        aliases.push(gmailAlias);
      }

      const yandexSnapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/aliasMails/yandex`);
      if (yandexSnapshot.child('accountId').val() !== null) {
        const yandexAlias: AliasMailType = {
          provider: 'yandex',
          accountId: yandexSnapshot.child('accountId').val(),
          password: yandexSnapshot.child('password').val(),
          domain: yandexSnapshot.child('domain').val(),
          contactMail: yandexSnapshot.child('contactMail').val(),
          firstName: yandexSnapshot.child('firstName').val(),
          lastName: yandexSnapshot.child('lastName').val(),
          firstNameKana: yandexSnapshot.child('firstNameKana').val(),
          lastNameKana: yandexSnapshot.child('lastNameKana').val(),
          gender: yandexSnapshot.child('gender').val(),
          birthDate: yandexSnapshot.child('birthDate').val(),
          postalCode: yandexSnapshot.child('postalCode').val(),
          prefecture: yandexSnapshot.child('prefecture').val(),
          secretQuestion: yandexSnapshot.child('secretQuestion').val(),
          secretAnswer: yandexSnapshot.child('secretAnswer').val()
        };
        aliases.push(yandexAlias);
      }

      yield put(getAliasMailSuccess(aliases));
    }
  } catch (error) {
    yield put(getAliasMailFailure({ errorMessage: error.toString() }));
  }
}

function* deleteAliasMail(action) {
  const userAuth = yield select(state => state.Login);
  try {
    yield call(firebaseDbDelete, `/users/${userAuth.userId}/aliasMails/${action.payload.provider}`);

    const aliases = yield select(state => state.AliasMailInfo.aliasMailInfo);
    const updatedAliases = aliases.filter(alias => alias.provider !== action.payload.provider);

    yield put(deleteAliasMailSuccess(updatedAliases));
  } catch (error) {
    yield put(deleteAliasMailFailure({ errorMessage: error.toString() }));
  }
}


function* rootSaga(): Saga {
  yield takeEvery(Actions.SAVE_ALIAS_MAIL_REQUEST, saveAliasMail);
  yield takeEvery(Actions.GET_ALIAS_MAIL_REQUEST, getAliasMails);
  yield takeEvery(Actions.DELETE_ALIAS_MAIL_REQUEST, deleteAliasMail);
}

export default rootSaga;
