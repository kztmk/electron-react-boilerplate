// @flow
import type { AuthType } from '../../types/auth';

export const SET_AUTH_INFO: 'Login/SET_AUTH_INFO' = 'Login/SET_AUTH_INFO';
export const LOGIN_REQUEST: 'Login/LOGIN_REQUEST' = 'Login/LOGIN_REQUEST';
export const LOGIN_SUCCESS: 'Login/LOGIN_SUCCESS' = 'Login/LOGIN_SUCCESS';
export const LOGIN_FAILURE: 'Login/LOGIN_FAILURE' = 'Login/LOGIN_FAILURE';
export const LOGIN_DONE: 'Login/LOGIN_DONE' = 'Login/LOGIN_DONE';
export const LOGOUT_REQUEST: 'Login/LOGOUT_REQUEST' = 'Login/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS: 'Login/LOGOUT_SUCCESS' = 'Login/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE: 'Login/LOGOUT_FAILURE' = 'Login/LOGOUT_FAILURE';
export const CLEAR_AUTH_INFO: 'Login/CLEAR_AUTH_INFO' = 'Login/CLEAR_AUTH_INFO';
export const UPDATE_AUTH_INFO: 'Login/UPDATE_AUTH_INFO' = 'Login/UPDATE_AUTH_INFO';

export const Actions = {
  SET_AUTH_INFO,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_DONE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  CLEAR_AUTH_INFO,
  UPDATE_AUTH_INFO
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
  payload: AuthType
};
export type LoginFailure = {
  type: typeof LOGIN_FAILURE,
  payload: AuthType
};
export type LoginDone = {
  type: typeof LOGIN_DONE
};
export type LogoutRequest = {
  type: typeof LOGOUT_REQUEST
};
export type LogoutSuccess = {
  type: typeof LOGOUT_SUCCESS
};
export type LogoutFailure = {
  type: typeof LOGOUT_FAILURE,
  payload: AuthType
};
export type ClearAuthInfo = {
  type: typeof CLEAR_AUTH_INFO
};

export type UpdateAuthInfo = {
  type: typeof UPDATE_AUTH_INFO,
  payload: AuthType
};

export type Action =
  | SetAuthInfo
  | LoginRequest
  | LoginSuccess
  | LoginFailure
  | LoginDone
  | LogoutRequest
  | LogoutSuccess
  | LogoutFailure
  | ClearAuthInfo
  | UpdateAuthInfo;
