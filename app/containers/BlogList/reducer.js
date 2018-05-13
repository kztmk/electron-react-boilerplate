// @flow
import type { Action } from "./actionTypes";
import { Actions } from "./actionTypes";
import type { BlogAccountType } from "../../types/blogAccount";

export type State = {
  blogAccounts: Array<BlogAccountType>,
  targetAccount: BlogAccountType,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  errorAccounts: Array<BlogAccountType>
};

export const initialBlogAccount: BlogAccountType = {
  key: "",
  accountId: "",
  password: "",
  mailAddress: "",
  provider: "",
  title: "",
  description: "",
  url: "",
  remark: "",
  createDate: 0,
  detailInfo: [],
  apiId: "",
  apiPass: "",
  blogId: "",
  endPoint: "",
  groupTags: "",
  affiliateTags: []
};

export const initialState: State = {
  blogAccounts: [],
  targetAccount: initialBlogAccount,
  isLoading: false,
  isFailure: false,
  errorMessage: "",
  errorAccounts: []
};

// eslint-disable-next-line space-before-function-paren
export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.GET_BLOGS_REQUEST:
      return {
        ...initialState,
        isLoading: true,
        isFilure: false,
        errorMessage: "",
        errorAccounts: []
      };

    case Actions.GET_BLOGS_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        isLoading: false
      };

    case Actions.GET_BLOGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload
      };

    case Actions.CREATE_BLOG_REQUEST:
      return {
        ...state,
        targetAccount: action.payload,
        isLoading: true,
        errorMessage: ""
      };

    case Actions.CREATE_BLOG_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        targetAccount: initialBlogAccount,
        isLoading: false
      };

    case Actions.CREATE_BLOG_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload
      };

    case Actions.UPDATE_BLOG_REQUEST:
      return {
        ...state,
        targetAccount: action.payload,
        isLoading: true,
        errorMessage: ""
      };

    case Actions.UPDATE_BLOG_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        targetAccount: initialBlogAccount,
        isLoading: false
      };

    case Actions.UPDATE_BLOG_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload
      };

    case Actions.DELETE_BLOG_REQUEST:
      return {
        ...state,
        targetAccount: action.payload,
        isLoading: true,
        errorMessage: ""
      };

    case Actions.DELETE_BLOG_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        targetAccount: initialBlogAccount,
        isLoading: false
      };

    case Actions.DELETE_BLOG_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.payload
      };

    case Actions.IMPORT_BLOGS_REQUEST:
      return {
        ...state,
        isLoading: true,
        errorMessage: "",
        errorAccounts: action.payload
      };

    case Actions.IMPORT_BLOGS_SUCCESS:
      return {
        ...state,
        blogAccounts: action.payload,
        isLoading: false,
        errorAccounts: action.meta.errorAccounts,
        errorMessage: `リクエスト:${action.meta.req}件/インポート:${
          action.meta.in
        }件/エラー(重複を含む):${action.meta.out}件`
      };

    case Actions.IMPORT_BLOGS_FAILURE:
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
