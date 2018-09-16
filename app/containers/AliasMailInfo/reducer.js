// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type AliasMailType from '../../types/aliasMailInfo';

export const initialAliasBase: AliasMailType = {
  provider: '',
  accountId: '',
  password: '',
  domain: '',
  contactMail: '',
  firstName: '',
  firstNameKana: '',
  lastName: '',
  lastNameKana: '',
  gender: true,
  birthDate: '',
  postalCode: '',
  prefecture: '',
  secretQuestion: '',
  secretAnswer: ''
}

export const initialGmailBase = {
  ...initialAliasBase,
  provider: 'gmail'
}

export const initialYandexBase = {
  ...initialAliasBase,
  provider: 'yandex'
}

export type State = {
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  aliasMailInfo: Array<AliasMailType>
};

export const initialState: State = {
  isLoading: false,
  isFailure: false,
  errorMessage: '',
  aliasMailInfo: [initialGmailBase, initialYandexBase]
};

// default function(state: State = initialState, action: Action): State {
export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.SAVE_ALIAS_MAIL_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.SAVE_ALIAS_MAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        aliasMailInfo: action.payload
      };

    case Actions.SAVE_ALIAS_MAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.GET_ALIAS_MAIL_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.GET_ALIAS_MAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        aliasMailInfo: action.payload
      };

    case Actions.GET_ALIAS_MAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.DELETE_ALIAS_MAIL_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.DELETE_ALIAS_MAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        aliasMailInfo: action.payload
      };

    case Actions.DELETE_ALIAS_MAIL_FAILURE:
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
