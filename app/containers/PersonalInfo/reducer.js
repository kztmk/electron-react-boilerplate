// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type PersonalInfoType from '../../types/personalInfo';
import type MailAccountType from '../../types/mailAccount';

export type State = {
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  personalInfo: PersonalInfoType,
  randomPersonalInfo: PersonalInfoType
};

export const initialMailAccount = {
  key: '',
  accountId: '',
  password: '',
  mailAddress: '',
  provider: '',
  createDate: 0,
  lastLogin: 0,
  tags: '',
  detailInfo: []
};

const initialPersonalInfo = {
  lastName: '',
  firstName: '',
  lastNameKana: '',
  firstNameKana: '',
  lastNameKatakana: '',
  firstNameKatakana: '',
  lastNameHepburn: '',
  firstNameHepburn: '',
  gender: 0,
  birthDate: '',
  postalCode: '',
  prefecture: '',
  address1: '',
  useDefault: false,
  mailAccount: initialMailAccount
};
export const initialState: State = {
  isLoading: false,
  isFailure: false,
  errorMessage: '',
  personalInfo: initialPersonalInfo,
  randomPersonalInfo: initialPersonalInfo
};

export default function(state: State = initialState, action: Action): Exact<State> {
  switch (action.type) {
    case Actions.CLEAR_PERSONAL_INFO_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.CLEAR_PERSONAL_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        randomPersonalInfo: initialPersonalInfo
      };

    case Actions.CLEAR_PERSONAL_INFO_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.SAVE_PERSONAL_INFO_FOR_BLOG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        randomPersonalInfo: action.payload
      };

    case Actions.SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.SAVE_PERSONAL_INFO_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.SAVE_PERSONAL_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        personalInfo: action.payload
      };

    case Actions.SAVE_PERSONAL_INFO_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.GET_RANDOM_PERSONAL_INFO_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.GET_RANDOM_PERSONAL_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        randomPersonalInfo: action.payload
      };

    case Actions.GET_RANDOM_PERSONAL_INFO_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.GET_PERSONAL_INFO_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.GET_PERSONAL_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        personalInfo: action.payload
      };

    case Actions.GET_PERSONAL_INFO_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.GET_PERSONAL_INFO_FOR_BLOG_REQUEST:
      return {
        ...state,
        personalInfo: action.payload,
        isLoading: true
      };

    case Actions.GET_PERSONAL_INFO_FOR_BLOG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        personalInfo: action.payload
      };

    case Actions.GET_PERSONAL_INFO_FOR_BLOG_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    default:
      return state;
  }
}
