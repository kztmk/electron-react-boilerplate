// @flow
import type Saga from 'redux-saga';
import moment from 'moment';
import { put, call, takeEvery, select, delay } from 'redux-saga/effects';
import {
  getPersonalInfoSuccess,
  getPersonalInfoFailure,
  getPersonalInfoForBlogSuccess,
  getPersonalInfoForBlogFailure,
  getRandomPersonalInfoSuccess,
  getRandomPersonalInfoFailure,
  savePersonalInfoSuccess,
  savePersonalInfoFailure,
  savePersonalInfoForBlogSuccess,
  savePersonalInfoForBlogFailure,
  clearPersonalInfoSuccess,
  clearPersonalInfoFailure
} from './actions';
import { Actions } from './actionTypes';
import { firebaseDbSet, firebaseDbRead } from '../../database/db';
import type PersonalInfoType from '../../types/personalInfo';
import { initialMailAccount } from './reducer';

const initialPersonalInfo: PersonalInfoType = {
  lastName: '',
  firstName: '',
  lastNameKana: '',
  firstNameKana: '',
  gender: 0,
  birthDate: '',
  postalCode: '',
  prefecture: '',
  address1: '',
  useDefault: false,
  mailAccount: initialMailAccount
};

function* savePersonalInfo(action) {
  try {
    // check personalInfo exists
    const userAuth = yield select(state => state.Login);
    const personalInfo = {
      ...action.payload
    };
    // save
    yield call(firebaseDbSet, `/users/${userAuth.userId}/personalInfo`, personalInfo);

    yield put(savePersonalInfoSuccess(personalInfo));
  } catch (error) {
    yield put(savePersonalInfoFailure({ errorMessage: error.toString() }));
  }
}

function* getRandomPersonalInfo() {
  let personalData = null;
  try {
    console.log('start to get random personal data');
    personalData = yield fetch(
      'https://us-central1-yoriki5-prod.cloudfunctions.net/getPersonalData'
    )
      .then(response => response.json())
      .then(data => {
        let postCode = '00';
        if (data.postalCode.length < 7) {
          postCode += data.postalCode;
          postCode = postCode.substr(1, 7);
        } else {
          postCode = data.postalCode;
        }
        personalData = {
          lastName: data.lname,
          firstName: data.fname,
          lastNameKana: data.lnameFurigana,
          firstNameKana: data.fnameFurigana,
          gender: data.gender,
          birthDate: moment(data.birthDate, 'MM/DD/YYYY').format('YYYY/MM/DD'),
          postalCode: postCode,
          prefecture: data.prefectName,
          address1: data.address1,
          useDefault: false,
          mailAccount: initialMailAccount
        };
        return personalData;
      })
      .catch(error => {
        throw new Error(error.toString());
      });
    yield put(getRandomPersonalInfoSuccess(personalData));
  } catch (error) {
    yield put(getRandomPersonalInfoFailure({ errorMessage: error.toString() }));
  }
}

function* getPersonalInfo() {
  try {
    const userAuth = yield select(state => state.Login);
    let personalInfo: PersonalInfoType = {
      ...initialPersonalInfo
    };

    if (userAuth.userId.length !== 0) {
      const snapshot = yield call(firebaseDbRead, `/users/${userAuth.userId}/personalInfo`);
      if (snapshot.child('lastName').val() !== null) {
        personalInfo = {
          lastName: snapshot.child('lastName').val(),
          firstName: snapshot.child('firstName').val(),
          lastNameKana: snapshot.child('lastNameKana').val(),
          firstNameKana: snapshot.child('firstNameKana').val(),
          gender: snapshot.child('gender').val(),
          birthDate: snapshot.child('birthDate').val(),
          postalCode: snapshot.child('postalCode').val(),
          prefecture: snapshot.child('prefecture').val(),
          address1: snapshot.child('address1').val(),
          useDefault: snapshot.child('useDefault').val(),
          mailAccount: initialMailAccount
        };
      }
    }
    yield put(getPersonalInfoSuccess(personalInfo));
  } catch (error) {
    yield put(getPersonalInfoFailure({ errorMessage: error.toString() }));
  }
}

function* getPersonalInfoForBlog(action) {
  try {
    yield put(getPersonalInfoForBlogSuccess(...action.payload));
  } catch (error) {
    yield put(getPersonalInfoForBlogFailure({ errorMessage: error.toString() }));
  }
}

/**
 * 新規ブログアカウント作成時に、使用するメールアドレスの個人情報をstateに格納
 *
 * @param action
 * @returns {IterableIterator<*>}
 */
function* savePersonalInfoForBlog(action) {
  try {
    const personalInfo: PersonalInfoType = yield select(state => state.PersonalInfo.personalInfo);
    let randomPersonalInfo = initialPersonalInfo;
    // detailInfoを持たない場合、
    //  ---> useDefaultをチェック
    if (!personalInfo.useDefault) {
      // use random
      if (action.payload.lastName.length === 0 || action.payload.prefecture.length === 0) {
        // detailInfoを持たないため、ランダムを取得
        randomPersonalInfo = yield fetch(
          'https://us-central1-yoriki5-prod.cloudfunctions.net/getPersonalData'
        )
          .then(response => response.json())
          .then(data => {
            let postCode = '00';
            if (data.postalCode.length < 7) {
              postCode += data.postalCode;
              postCode = postCode.substr(1, 7);
            } else {
              postCode = data.postalCode;
            }
            const personalData = {
              lastName: data.lname,
              firstName: data.fname,
              lastNameKana: data.lnameFurigana,
              firstNameKana: data.fnameFurigana,
              gender: data.gender,
              birthDate: moment(data.birthDate, 'MM/DD/YYYY').format('YYYY/MM/DD'),
              postalCode: postCode,
              prefecture: data.prefectName,
              address1: action.payload.address1,
              useDefault: false,
              mailAccount: action.payload.mailAccount
            };
            return personalData;
          })
          .catch(error => {
            throw new Error(error.toString());
          });
      } else {
        // detailInfo exists
        randomPersonalInfo = { ...action.payload };
      }
    } else {
      // use default
      randomPersonalInfo = { ...personalInfo, address1: action.payload.address1 };
    }
    yield put(savePersonalInfoForBlogSuccess(randomPersonalInfo));
  } catch (error) {
    yield put(savePersonalInfoForBlogFailure({ errorMessage: error.toString() }));
  }
}

function* clearRandomPersonalInfo() {
  try {
    yield put(clearPersonalInfoSuccess(initialPersonalInfo));
  } catch (error) {
    yield put(clearPersonalInfoFailure({ errorMessage: error.toString() }));
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.GET_PERSONAL_INFO_REQUEST, getPersonalInfo);
  yield takeEvery(Actions.GET_RANDOM_PERSONAL_INFO_REQUEST, getRandomPersonalInfo);
  yield takeEvery(Actions.SAVE_PERSONAL_INFO_REQUEST, savePersonalInfo);
  yield takeEvery(Actions.SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST, savePersonalInfoForBlog);
  yield takeEvery(Actions.GET_PERSONAL_INFO_FOR_BLOG_REQUEST, getPersonalInfoForBlog);
  yield takeEvery(Actions.CLEAR_PERSONAL_INFO_REQUEST, clearRandomPersonalInfo);
}

export default rootSaga;
