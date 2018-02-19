// @flow
import type { AuthType } from '../../types/auth';
import type { UserAccountType } from '../../types/userAccount';

export const SET_AUTH_INFO: 'Login/SET_AUTH_INFO' = 'Login/SET_AUTH_INFO';
export const LOGIN_REQUEST: 'Login/LOGIN_REQUEST' = 'Login/LOGIN_REQUEST';
export const LOGIN_SUCCESS: 'Login/LOGIN_SUCCESS' = 'Login/LOGIN_SUCCESS';
export const LOGIN_FAILURE: 'Login/LOGIN_FAILURE' = 'Login/LOGIN_FAILURE';
export const LOGOUT_REQUEST: 'Login/LOGOUT_REQUEST' = 'Login/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS: 'Login/LOGOUT_SUCCESS' = 'Login/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE: 'Login/LOGOUT_FAILURE' = 'Login/LOGOUT_FAILURE';
export const CLEAR_AUTH_INFO: 'Login/CLEAR_AUTH_INFO' = 'Login/CLEAR_AUTH_INFO';

export const Actions = {
  SET_AUTH_INFO,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  CLEAR_AUTH_INFO
};

export type SetAuthInfo = {
  type: typeof SET_AUTH_INFO,
  payload: AuthType
};

export type LoginRequest = {
  type: typeof LOGIN_REQUEST
};
export type LoginSuccess = {
  type: typeof LOGIN_SUCCESS,
  payload: UserAccountType
};
export type LoginFailure = {
  type: typeof LOGIN_FAILURE,
  payload: UserAccountType
};
export type LogoutRequest = {
  type: typeof LOGOUT_REQUEST
};
export type LogoutSuccess = {
  type: typeof LOGOUT_SUCCESS
};
export type LogoutFailure = {
  type: typeof LOGOUT_FAILURE,
  payload: UserAccountType
};
export type ClearAuthInfo = {
  type: typeof CLEAR_AUTH_INFO
};

export type Action =
  | SetAuthInfo
  | LoginRequest
  | LoginSuccess
  | LoginFailure
  | LogoutRequest
  | LogoutSuccess
  | LogoutFailure
  | ClearAuthInfo;
