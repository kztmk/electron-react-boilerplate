// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type MailAccountType from '../../types/mailAccount';

export type State = {
  mailAccounts: Array<MailAccountType>,
  targetAccount: MailAccountType,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  errorAccounts: Array<MailAccountType>
};

const initialMailAccount = {
  key: '',
  accountId: '',
  password: '',
  mailAddress: '',
  provider: '',
  createDate: 0,
  lastLogin: null,
  tags: '',
  detailInfo: []
};

export const initialState: State = {
  mailAccounts: [],
  targetAccount: initialMailAccount,
  isLoading: false,
  isFailure: false,
  errorMessage: '',
  errorAccounts: []
};

// eslint-disable-next-line space-before-function-paren
export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.CLEAR_MAIL_ADDRESS:
      return {
        ...state
      };

    case Actions.GET_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.GET_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        isLoading: false
      };

    case Actions.GET_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload
      };

    case Actions.CREATE_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        targetAccount: action.payload,
        isLoading: true
      };

    case Actions.CREATE_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        targetAccount: initialMailAccount,
        isLoading: false
      };

    case Actions.CREATE_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload
      };

    case Actions.UPDATE_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        targetAccount: action.payload,
        isLoading: true
      };

    case Actions.UPDATE_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        targetAccount: initialMailAccount,
        isLoading: false
      };

    case Actions.UPDATE_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload
      };

    case Actions.DELETE_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        targetAccount: action.payload,
        isLoading: true
      };

    case Actions.DELETE_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        targetAccount: initialMailAccount,
        isLoading: false
      };

    case Actions.DELETE_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload
      };

    case Actions.IMPORT_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        isLoading: true,
        errorAccounts: action.payload
      };

    case Actions.IMPORT_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        isLoading: false,
        errorAccounts: action.meta.errorAccounts,
        errorMessage: `リクエスト:${action.meta.req}件/インポート:${
          action.meta.in
        }件/エラー(重複含む):${action.meta.out}件`
      };

    case Actions.IMPORT_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload,
        errorAccounts: []
      };

    default:
      return state;
  }
}
