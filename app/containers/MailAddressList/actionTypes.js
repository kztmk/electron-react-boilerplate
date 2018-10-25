// @flow
import type MailAccountType from '../../types/mailAccount';

export const GET_MAIL_ADDRESS_REQUEST: 'MailAddressList/GET_MAIL_ADDRESS_REQUEST' =
  'MailAddressList/GET_MAIL_ADDRESS_REQUEST';
export const GET_MAIL_ADDRESS_SUCCESS: 'MailAddressList/GET_MAIL_ADDRESS_SUCCESS' =
  'MailAddressList/GET_MAIL_ADDRESS_SUCCESS';
export const GET_MAIL_ADDRESS_FAILURE: 'MailAddressList/GET_MAIL_ADDRESS_FAILURE' =
  'MailAddressList/GET_MAIL_ADDRESS_FAILURE';
export const CREATE_MAIL_ADDRESS_REQUEST: 'MailAddressList/CREATE_MAIL_ADDRESS_REQUEST' =
  'MailAddressList/CREATE_MAIL_ADDRESS_REQUEST';
export const CREATE_MAIL_ADDRESS_SUCCESS: 'MailAddressList/CREATE_MAIL_ADDRESS_SUCCESS' =
  'MailAddressList/CREATE_MAIL_ADDRESS_SUCCESS';
export const CREATE_MAIL_ADDRESS_FAILURE: 'MailAddressList/CREATE_MAIL_ADDRESS_FAILURE' =
  'MailAddressList/CREATE_MAIL_ADDRESS_FAILURE';
export const UPDATE_MAIL_ADDRESS_REQUEST: 'MailAddressList/UPDATE_MAIL_ADDRESS_REQUEST' =
  'MailAddressList/UPDATE_MAIL_ADDRESS_REQUEST';
export const UPDATE_MAIL_ADDRESS_SUCCESS: 'MailAddressList/UPDATE_MAIL_ADDRESS_SUCCESS' =
  'MailAddressList/UPDATE_MAIL_ADDRESS_SUCCESS';
export const UPDATE_MAIL_ADDRESS_FAILURE: 'MailAddressList/UPDATE_MAIL_ADDRESS_FAILURE' =
  'MailAddressList/UPDATE_MAIL_ADDRESS_FAILURE';
export const DELETE_MAIL_ADDRESS_REQUEST: 'MailAddressList/DELETE_MAIL_ADDRESS_REQUEST' =
  'MailAddressList/DELETE_MAIL_ADDRESS_REQUEST';
export const DELETE_MAIL_ADDRESS_SUCCESS: 'MailAddressList/DELETE_MAIL_ADDRESS_SUCCESS' =
  'MailAddressList/DELETE_MAIL_ADDRESS_SUCCESS';
export const DELETE_MAIL_ADDRESS_FAILURE: 'MailAddressList/DELETE_MAIL_ADDRESS_FAILURE' =
  'MailAddressList/DELETE_MAIL_ADDRESS_FAILURE';
export const IMPORT_MAIL_ADDRESS_REQUEST: 'MailAddressList/IMPORT_MAIL_ADDRESS_REQUEST' =
  'MailAddressList/IMPORT_MAIL_ADDRESS_REQUEST';
export const IMPORT_MAIL_ADDRESS_SUCCESS: 'MailAddressList/IMPORT_MAIL_ADDRESS_SUCCESS' =
  'MailAddressList/IMPORT_MAIL_ADDRESS_SUCCESS';
export const IMPORT_MAIL_ADDRESS_FAILURE: 'MailAddressList/IMPORT_MAIL_ADDRESS_FAILURE' =
  'MailAddressList/IMPORT_MAIL_ADDRESS_FAILURE';
export const CLEAR_MAIL_ADDRESS: 'MailAddressList/CLEAR_MAIL_ADDRESS' =
  'MailAddressList/CLEAR_MAIL_ADDRESS';
export const UPDATE_LAST_LOGIN_REQUEST: 'MailAddressList/UPDATE_LAST_LOGIN_REQUEST' =
  'MailAddressList/UPDATE_LAST_LOGIN_REQUEST';
export const UPDATE_LAST_LOGIN_SUCCESS: 'MailAddressList/UPDATE_LAST_LOGIN_SUCCESS' =
  'MailAddressList/UPDATE_LAST_LOGIN_SUCCESS';
export const UPDATE_LAST_LOGIN_FAILURE: 'MailAddressList/UPDATE_LAST_LOGIN_FAILURE' =
  'MailAddressList/UPDATE_LAST_LOGIN_FAILURE';
export const SET_PAGE_SIZE_REQUEST: 'MailAddressList/SET_PAGE_SIZE_REQUEST' =
  'MailAddressList/SET_PAGE_SIZE_REQUEST';
export const SET_PAGE_SIZE_SUCCESS: 'MailAddressList/SET_PAGE_SIZE_SUCCESS' =
  'MailAddressList/SET_PAGE_SIZE_SUCCESS';
export const SET_PAGE_SIZE_FAILURE: 'MailAddressList/SET_PAGE_SIZE_FAILURE' =
  'MailAddressList/SET_PAGE_SIZE_FAILURE';

export const Actions = {
  GET_MAIL_ADDRESS_REQUEST,
  GET_MAIL_ADDRESS_SUCCESS,
  GET_MAIL_ADDRESS_FAILURE,
  CREATE_MAIL_ADDRESS_REQUEST,
  CREATE_MAIL_ADDRESS_SUCCESS,
  CREATE_MAIL_ADDRESS_FAILURE,
  UPDATE_MAIL_ADDRESS_REQUEST,
  UPDATE_MAIL_ADDRESS_SUCCESS,
  UPDATE_MAIL_ADDRESS_FAILURE,
  DELETE_MAIL_ADDRESS_REQUEST,
  DELETE_MAIL_ADDRESS_SUCCESS,
  DELETE_MAIL_ADDRESS_FAILURE,
  IMPORT_MAIL_ADDRESS_REQUEST,
  IMPORT_MAIL_ADDRESS_SUCCESS,
  IMPORT_MAIL_ADDRESS_FAILURE,
  CLEAR_MAIL_ADDRESS,
  UPDATE_LAST_LOGIN_REQUEST,
  UPDATE_LAST_LOGIN_SUCCESS,
  UPDATE_LAST_LOGIN_FAILURE,
  SET_PAGE_SIZE_REQUEST,
  SET_PAGE_SIZE_SUCCESS,
  SET_PAGE_SIZE_FAILURE
};

export type GetMailAddressRequest = {
  type: typeof GET_MAIL_ADDRESS_REQUEST
};
export type GetMailAddressSuccess = {
  type: typeof GET_MAIL_ADDRESS_SUCCESS,
  payload: Array<MailAccountType>
};
export type GetMailAddressFailure = {
  type: typeof GET_MAIL_ADDRESS_FAILURE,
  payload: string
};
export type CreateMailAddressRequest = {
  type: typeof CREATE_MAIL_ADDRESS_REQUEST,
  payload: MailAccountType
};
export type CreateMailAddressSuccess = {
  type: typeof CREATE_MAIL_ADDRESS_SUCCESS,
  payload: Array<MailAccountType>
};
export type CreateMailAddressFailure = {
  type: typeof CREATE_MAIL_ADDRESS_FAILURE,
  payload: string
};
export type UpdateMailAddressRequest = {
  type: typeof UPDATE_MAIL_ADDRESS_REQUEST,
  payload: MailAccountType
};
export type UpdateMailAddressSuccess = {
  type: typeof UPDATE_MAIL_ADDRESS_SUCCESS,
  payload: Array<MailAccountType>
};
export type UpdateMailAddressFailure = {
  type: typeof UPDATE_MAIL_ADDRESS_FAILURE,
  payload: string
};
export type DeleteMailAddressRequest = {
  type: typeof DELETE_MAIL_ADDRESS_REQUEST,
  payload: MailAccountType
};
export type DeleteMailAddressSuccess = {
  type: typeof DELETE_MAIL_ADDRESS_SUCCESS,
  payload: Array<MailAccountType>
};
export type DeleteMailAddressFailure = {
  type: typeof DELETE_MAIL_ADDRESS_FAILURE,
  payload: string
};

export type ImportMailAddressRequest = {
  type: typeof IMPORT_MAIL_ADDRESS_REQUEST,
  payload: Array<MailAccountType>
};
export type ImportMailAddressSuccess = {
  type: typeof IMPORT_MAIL_ADDRESS_SUCCESS,
  payload: Array<MailAccountType>,
  meta: {
    errorAccounts: Array<MailAccountType>,
    req: number,
    in: number,
    out: number
  }
};
export type ImportMailAddressFailure = {
  type: typeof IMPORT_MAIL_ADDRESS_FAILURE,
  payload: string
};

export type ClearMailAddress = {
  type: typeof CLEAR_MAIL_ADDRESS
};

export type UpdateLastLoginRequest = {
  type: typeof UPDATE_LAST_LOGIN_REQUEST,
  payload: MailAccountType
};
export type UpdateLastLoginSuccess = {
  type: typeof UPDATE_LAST_LOGIN_SUCCESS,
  payload: Array<MailAccountType>
};
export type UpdateLastLoginFailure = {
  type: typeof UPDATE_LAST_LOGIN_FAILURE,
  meta: {
    errorMessage: string
  }
};

export type SetPageSizeRequest = {
  type: typeof SET_PAGE_SIZE_REQUEST,
  payload: number
};
export type SetPageSizeSuccess = {
  type: typeof SET_PAGE_SIZE_SUCCESS,
  payload: number
};
export type SetPageSizeFailure = {
  type: typeof SET_PAGE_SIZE_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | GetMailAddressRequest
  | GetMailAddressSuccess
  | GetMailAddressFailure
  | CreateMailAddressRequest
  | CreateMailAddressSuccess
  | CreateMailAddressFailure
  | UpdateMailAddressRequest
  | UpdateMailAddressSuccess
  | UpdateMailAddressFailure
  | DeleteMailAddressRequest
  | DeleteMailAddressSuccess
  | DeleteMailAddressFailure
  | ImportMailAddressRequest
  | ImportMailAddressSuccess
  | ImportMailAddressFailure
  | ClearMailAddress
  | UpdateLastLoginRequest
  | UpdateLastLoginSuccess
  | UpdateLastLoginFailure
  | SetPageSizeRequest
  | SetPageSizeSuccess
  | SetPageSizeFailure;
