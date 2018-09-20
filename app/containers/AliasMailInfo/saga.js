// @flow
import type Saga from 'redux-saga';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import moment from 'moment';
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
import { createMailAddressRequest, updateMailAddressRequest } from '../MailAddressList/actions';

function* saveAliasMail(action) {
  try {
    const userAuth = yield select(state => state.Login);
    console.log('----g alias');
    console.log(action.payload);
    const alias = { ...action.payload };
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

    console.log('---db complete--');
    const originalAliases: Array<AliasMailType> = yield select(
      state => state.AliasMailInfo.aliasMailInfo
    );

    console.log('----state aliases--');
    console.log(originalAliases);
    const restAliases = originalAliases.filter(a => a.provider !== alias.provider);
    console.log('---after delete');
    console.log(restAliases);
    console.log('--alias--');
    console.log(alias);
    restAliases.push(alias);

    yield put(saveAliasMailSuccess(restAliases));
    console.log('----Alias save---');
    // mailAccountsに登録がない場合には、新規登録
    // check mailAddress exists
    const mailAccounts = yield select(state => state.MailAddressList.mailAccounts);
    const aliasBase = `${alias.accountId}@${alias.domain}`;
    console.log(`mailAddress:${aliasBase}`);
    const existsAccount = mailAccounts.find(m => m.mailAddress === aliasBase);

    if (existsAccount) {
      // mailAccountsに登録がある場合には、更新
      // accountId  編集不可
      existsAccount.password = alias.password;
      // mailAddress 編集不可
      // provider 編集不可
      // createDate 編集不可
      // lastLogin 編集の必要なし
      // tags AliasBaseでは入力欄なし
      console.log('------exists alias then update');
      yield put(updateMailAddressRequest(existsAccount));
    } else {
      // 新規
      const detailInfo = [];
      detailInfo.push(`氏名(漢字):${alias.lastName} ${alias.firstName}`);
      detailInfo.push(`しめい(ふりがな):${alias.lastNameKana} ${alias.firstNameKana}`);
      detailInfo.push(`生年月日: ${alias.birthDate}`);
      detailInfo.push(`郵便番号: ${alias.postalCode}`);
      if (alias.gender) {
        detailInfo.push(`性別: 女`);
      } else {
        detailInfo.push(`性別: 男`);
      }
      detailInfo.push(`都道府県: ${alias.prefecture}`);
      if (alias.secretQuestion.length > 0) {
        detailInfo.push(`秘密の質問:${alias.secretQuestion}`);
        detailInfo.push(`質問の答え:${alias.secretAnswer}`);
      }
      const provider = alias.provider === 'gmail' ? 'Gmail' : 'Yandex';
      const newMailAccount = {
        key: '',
        accountId: alias.accountId,
        password: alias.password,
        mailAddress: `${alias.accountId}@${alias.domain}`,
        provider,
        createDate: moment().valueOf(),
        lastLogin: 0,
        tags: '',
        detailInfo
      };
      console.log('------not exists alias then create');
      yield put(createMailAddressRequest(newMailAccount));
    }
  } catch (error) {
    yield put(saveAliasMailFailure({ errorMessage: error.toString() }));
  }
}

function* getAliasMails() {
  try {
    const userAuth = yield select(state => state.Login);

    if (userAuth.userId.length > 0) {
      const aliases: Array<AliasMailType> = [];
      const gmailSnapshot = yield call(
        firebaseDbRead,
        `/users/${userAuth.userId}/aliasMails/gmail`
      );

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

      const yandexSnapshot = yield call(
        firebaseDbRead,
        `/users/${userAuth.userId}/aliasMails/yandex`
      );
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
