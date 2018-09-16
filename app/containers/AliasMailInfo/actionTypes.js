// @flow
import type AliasMailType from '../../types/aliasMailInfo';

export const SAVE_ALIAS_MAIL_REQUEST: 'AliasMailInfo/SAVE_ALIAS_MAIL_REQUEST' =
  'AliasMailInfo/SAVE_ALIAS_MAIL_REQUEST';
export const SAVE_ALIAS_MAIL_SUCCESS: 'AliasMailInfo/SAVE_ALIAS_MAIL_SUCCESS' =
  'AliasMailInfo/SAVE_ALIAS_MAIL_SUCCESS';
export const SAVE_ALIAS_MAIL_FAILURE: 'AliasMailInfo/SAVE_ALIAS_MAIL_FAILURE' =
  'AliasMailInfo/SAVE_ALIAS_MAIL_FAILURE';
export const GET_ALIAS_MAIL_REQUEST: 'AliasMailInfo/GET_ALIAS_MAIL_REQUEST' =
  'AliasMailInfo/GET_ALIAS_MAIL_REQUEST';
export const GET_ALIAS_MAIL_SUCCESS: 'AliasMailInfo/GET_ALIAS_MAIL_SUCCESS' =
  'AliasMailInfo/GET_ALIAS_MAIL_SUCCESS';
export const GET_ALIAS_MAIL_FAILURE: 'AliasMailInfo/GET_ALIAS_MAIL_FAILURE' =
  'AliasMailInfo/GET_ALIAS_MAIL_FAILURE';
export const DELETE_ALIAS_MAIL_REQUEST: 'AliasMailInfo/DELETE_ALIAS_MAIL_REQUEST' =
  'AliasMailInfo/DELETE_ALIAS_MAIL_REQUEST';
export const DELETE_ALIAS_MAIL_SUCCESS: 'AliasMailInfo/DELETE_ALIAS_MAIL_SUCCESS' =
  'AliasMailInfo/DELETE_ALIAS_MAIL_SUCCESS';
export const DELETE_ALIAS_MAIL_FAILURE: 'AliasMailInfo/DELETE_ALIAS_MAIL_FAILURE' =
  'AliasMailInfo/DELETE_ALIAS_MAIL_FAILURE';

export const Actions = {
  SAVE_ALIAS_MAIL_REQUEST,
  SAVE_ALIAS_MAIL_SUCCESS,
  SAVE_ALIAS_MAIL_FAILURE,
  GET_ALIAS_MAIL_REQUEST,
  GET_ALIAS_MAIL_SUCCESS,
  GET_ALIAS_MAIL_FAILURE,
  DELETE_ALIAS_MAIL_REQUEST,
  DELETE_ALIAS_MAIL_SUCCESS,
  DELETE_ALIAS_MAIL_FAILURE
};

export type SaveAliasMailRequest = {
  type: typeof SAVE_ALIAS_MAIL_REQUEST,
  payload: AliasMailType
};
export type SaveAliasMailSuccess = {
  type: typeof SAVE_ALIAS_MAIL_SUCCESS,
  payload: Array<AliasMailType>
};
export type SaveAliasMailFailure = {
  type: typeof SAVE_ALIAS_MAIL_FAILURE,
  meta: { errorMessage: string }
};
export type GetAliasMailRequest = {
  type: typeof GET_ALIAS_MAIL_REQUEST
};
export type GetAliasMailSuccess = {
  type: typeof GET_ALIAS_MAIL_SUCCESS,
  payload: Array<AliasMailType>
};
export type GetAliasMailFailure = {
  type: typeof GET_ALIAS_MAIL_FAILURE,
  meta: { errorMessage: string }
};
export type DeleteAliasMailRequest = {
  type: typeof DELETE_ALIAS_MAIL_REQUEST,
  payload: AliasMailType
};
export type DeleteAliasMailSuccess = {
  type: typeof DELETE_ALIAS_MAIL_SUCCESS,
  payload: Array<AliasMailType>
};
export type DeleteAliasMailFailure = {
  type: typeof DELETE_ALIAS_MAIL_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | SaveAliasMailRequest
  | SaveAliasMailSuccess
  | SaveAliasMailFailure
  | GetAliasMailRequest
  | GetAliasMailSuccess
  | GetAliasMailFailure
  | DeleteAliasMailRequest
  | DeleteAliasMailSuccess
  | DeleteAliasMailFailure;
