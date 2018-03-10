// @flow
import type { AuthType } from '../../types/auth';

export const SET_AUTH_INFO: 'ResetPassword/SET_AUTH_INFO' = 'ResetPassword/SET_AUTH_INFO';
export const RESET_PASSWORD_REQUEST: 'ResetPassword/RESET_PASSWORD_REQUEST' =
  'ResetPassword/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS: 'ResetPassword/RESET_PASSWORD_SUCCESS' =
  'ResetPassword/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE: 'ResetPassword/RESET_PASSWORD_FAILURE' =
  'ResetPassword/RESET_PASSWORD_FAILURE';
export const CLEAR_FIELDS: 'ResetPassword/CLEAR_FIELDS' = 'ResetPassword/CLEAR_FIELDS';

export const Actions = {
  SET_AUTH_INFO,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  CLEAR_FIELDS
};

export type SetAuthInfo = {
  type: typeof SET_AUTH_INFO,
  payload: AuthType
};
export type ResetPasswordRequest = {
  type: typeof RESET_PASSWORD_REQUEST
};
export type ResetPasswordSuccess = {
  type: typeof RESET_PASSWORD_SUCCESS
};
export type ResetPasswordFailure = {
  type: typeof RESET_PASSWORD_FAILURE,
  payload: AuthType
};

export type ClearFields = {
  type: typeof CLEAR_FIELDS
};

export type Action =
  | SetAuthInfo
  | ResetPasswordRequest
  | ResetPasswordSuccess
  | ResetPasswordFailure
  | ClearFields;
