// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type BlogAccountType from '../../types/blogAccount';

/**
 * blogAccounts: data accounts
 * isGetting: status for getting accounts process
 * isCreating: status for creating
 * isupdating: status for updating
 * isDeleting: status for deleting
 * isImporting: status for importing
 * isFailure: success/fail
 * metaMessage: error or notes
 * transAccounts: import accounts/error accounts
 */
export type State = {
  blogAccounts: Array<BlogAccountType>,
  isGetting: boolean,
  isCreating: boolean,
  isUpdating: boolean,
  isDeleting: boolean,
  isImporting: boolean,
  isFailure: boolean,
  metaMessage: string,
  transAccounts: Array<BlogAccountType>,
  pageSize: number
};

/**
 * Blog Account manage initial state
 * @type {{
 *  blogAccounts: Array,
 *  targetAccount: BlogAccountType,
 *  isLoading: boolean,
 *  isFailure: boolean,
 *  errorMessage: string,
 *  errorAccounts: Array}}
 */
export const initialState: State = {
  blogAccounts: [],
  isGetting: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isImporting: false,
  isFailure: false,
  metaMessage: '',
  transAccounts: [],
  pageSize: 10
};

/**
 * Blog Account initial state
 * @type {{
 *  key: string,
 *  accountId: string,
 *  password: string,
 *  mailAddress:
 *  string,
 *  provider: string,
 *  title: string,
 *  description:
 *  string, url: string,
 *  remark: string,
 *  createDate: number,
 *  detailInfo: Array,
 *  apiId: string,
 *  apiPass: string,
 *  blogId: string,
 *  endPoint: string,
 *  groupTags: string,
 *  affiliateTags: Array}}
 */
export const initialBlogAccount: BlogAccountType = {
  key: '',
  accountId: '',
  password: '',
  mailAddress: '',
  provider: '',
  title: '',
  description: '',
  url: '',
  remark: '',
  createDate: 0,
  detailInfo: [],
  apiId: '',
  apiPass: '',
  blogId: '',
  endPoint: '',
  groupTags: '',
  affiliateTags: []
};

// eslint-disable-next-line space-before-function-paren
export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.SET_PAGE_SIZE_REQUEST:
      return {
        ...state
      };

    case Actions.SET_PAGE_SIZE_SUCCESS:
      return {
        ...state,
        pageSize: action.payload
      };

    case Actions.SET_PAGE_SIZE_FAILURE:
      return {
        ...state,
        metaMessage: action.payload
      };

    /**
     * blogAccount全件取得
     */
    case Actions.GET_BLOGS_REQUEST:
      return {
        ...initialState,
        isGetting: true
      };

    case Actions.GET_BLOGS_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        isGetting: false
      };

    case Actions.GET_BLOGS_FAILURE:
      return {
        ...state,
        isGetting: false,
        isFailure: true,
        metaMessage: action.payload
      };

    /**
     * blogAccount新規追加
     */
    case Actions.CREATE_BLOG_REQUEST:
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

    case Actions.CREATE_BLOG_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        isCreating: false
      };

    case Actions.CREATE_BLOG_FAILURE:
      return {
        ...state,
        isCreating: false,
        isFailure: true,
        metaMessage: action.payload
      };

    /**
     * blogAccount更新
     */
    case Actions.UPDATE_BLOG_REQUEST:
      return {
        ...state,
        isGetting: false,
        isCreating: false,
        isUpdating: true,
        isDeleting: false,
        isImporting: false,
        metaMessage: '',
        transAccounts: []
      };

    case Actions.UPDATE_BLOG_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        isUpdating: false
      };

    case Actions.UPDATE_BLOG_FAILURE:
      return {
        ...state,
        isUpdating: false,
        isFailure: true,
        metaMessage: action.payload
      };

    /**
     * blogAccount削除
     */
    case Actions.DELETE_BLOG_REQUEST:
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

    case Actions.DELETE_BLOG_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        isDeleting: false
      };

    case Actions.DELETE_BLOG_FAILURE:
      return {
        ...state,
        isDeleting: false,
        isFailure: true,
        metaMessage: action.payload
      };

    /**
     * blogAccout import
     */
    case Actions.IMPORT_BLOGS_REQUEST:
      return {
        ...state,
        isGetting: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isImporting: true,
        metaMessage: '',
        transAccounts: action.payload
      };

    case Actions.IMPORT_BLOGS_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        isImporting: false,
        transAccounts: action.meta.errorAccounts,
        metaMessage: `リクエスト:${action.meta.req}件/インポート:${
          action.meta.in
        }件/エラー(重複を含む):${action.meta.out}件`
      };

    case Actions.IMPORT_BLOGS_FAILURE:
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
