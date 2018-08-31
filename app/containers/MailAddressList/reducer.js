// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type MailAccountType from '../../types/mailAccount';

/**
 * mailAccounts: data accounts
 * targetAccount: target account for creating , updating, deleting
 * isGetting: status for get accounts process
 * isCreating: status for creating
 * isUpdating: status for updating
 * isDeleting: status for deleting
 * isImporting: status for importing
 * isFailure: success/fail
 * metaMessage: error or notes
 * trasAccounts: import accounts/error accounts
 */
export type State = {
  mailAccounts: Array<MailAccountType>,
  isGetting: boolean,
  isCreating: boolean,
  isUpdating: boolean,
  isDeleting: boolean,
  isImporting: boolean,
  isFailure: boolean,
  metaMessage: string,
  transAccounts: Array<MailAccountType>
};

/**
 * Mail Accounts manage initial state
 * @type {{
 *   mailAccounts: Array,
 *  isGetting: boolean,
 *  isCreating: boolean,
 *  isUpdating: boolean,
 *  isDeleting: boolean,
 *  isImporting: boolean,
 *  isFailure: boolean,
 *  metaMessage: string,
 *  transAccounts: Array}}
 */
export const initialState: State = {
  mailAccounts: [],
  isGetting: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isImporting: false,
  isFailure: false,
  metaMessage: '',
  transAccounts: []
};

// eslint-disable-next-line space-before-function-paren
export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.UPDATE_LAST_LOGIN_REQUEST:
      return {
        ...state,
        isUpdating: true
      };

    case Actions.UPDATE_LAST_LOGIN_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        isUpdating: false
      };

    case Actions.UPDATE_LAST_LOGIN_FAILURE:
      return {
        ...state,
        isUpdating: false,
        isFailure: true,
        metaMessage: action.payload
      };

    case Actions.CLEAR_MAIL_ADDRESS:
      return {
        ...state
      };

    /**
     * mailAccount全件取得
     */
    case Actions.GET_MAIL_ADDRESS_REQUEST:
      return {
        ...initialState,
        isGetting: true
      };

    case Actions.GET_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        isGetting: false
      };

    case Actions.GET_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isGetting: false,
        isFailure: true,
        metaMessage: action.payload
      };

    /**
     * mailAccount新規追加
     */
    case Actions.CREATE_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        isGetting: false,
        isCreating: true,
        isUpdating: false,
        isDeleting: false,
        isImporting: false,
        isFailure: false,
        metaMessage: '',
        transAccounts: []
      };

    case Actions.CREATE_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        isCreating: false
      };

    case Actions.CREATE_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isCreating: false,
        isFailure: true,
        metaMessage: action.payload
      };

    /**
     * mailAccount更新
     */
    case Actions.UPDATE_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        isGetting: false,
        isCreating: false,
        isUpdating: true,
        isDeleting: false,
        isImporting: false,
        isFailure: false,
        metaMessage: '',
        transAccounts: []
      };

    case Actions.UPDATE_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        isUpdating: false
      };

    case Actions.UPDATE_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isUpdating: false,
        isFailure: true,
        metaMessage: action.payload
      };

    /**
     * mailAccount削除
     */
    case Actions.DELETE_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        isGetting: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: true,
        isImporting: false,
        isFailure: false,
        metaMessage: '',
        transAccounts: []
      };

    case Actions.DELETE_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        isDeleting: false
      };

    case Actions.DELETE_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isDeleting: false,
        isFailure: true,
        metaMessage: action.payload
      };

    /**
     * mailAccount import
     */
    case Actions.IMPORT_MAIL_ADDRESS_REQUEST:
      return {
        ...state,
        isGetting: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isImporting: true,
        isFailure: false,
        metaMessage: '',
        transAccounts: action.payload
      };

    case Actions.IMPORT_MAIL_ADDRESS_SUCCESS:
      return {
        ...state,
        mailAccounts: action.payload,
        isImporting: false,
        transAccounts: action.meta.errorAccounts,
        metaMessage: `リクエスト:${action.meta.req}件/インポート:${
          action.meta.in
        }件/エラー(重複含む):${action.meta.out}件`
      };

    case Actions.IMPORT_MAIL_ADDRESS_FAILURE:
      return {
        ...state,
        isImporting: false,
        isFailure: true,
        metaMessage: action.payload,
        transAccounts: []
      };

    default:
      return state;
  }
}
