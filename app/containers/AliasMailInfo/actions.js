// @flow
import type AliasMailType from '../../types/aliasMailInfo';

import {
  SAVE_ALIAS_MAIL_REQUEST,
  SAVE_ALIAS_MAIL_SUCCESS,
  SAVE_ALIAS_MAIL_FAILURE,
  GET_ALIAS_MAIL_REQUEST,
  GET_ALIAS_MAIL_SUCCESS,
  GET_ALIAS_MAIL_FAILURE,
  DELETE_ALIAS_MAIL_REQUEST,
  DELETE_ALIAS_MAIL_SUCCESS,
  DELETE_ALIAS_MAIL_FAILURE
} from './actionTypes';
import type {
  SaveAliasMailRequest,
  SaveAliasMailSuccess,
  SaveAliasMailFailure,
  GetAliasMailRequest,
  GetAliasMailSuccess,
  GetAliasMailFailure,
  DeleteAliasMailRequest,
  DeleteAliasMailSuccess,
  DeleteAliasMailFailure
} from './actionTypes';

export function saveAliasMailRequest(
  payload: AliasMailType
): SaveAliasMailRequest {
  return {
    type: SAVE_ALIAS_MAIL_REQUEST,
    payload
  };
}
export function saveAliasMailSuccess(
  payload: Array<AliasMailType>
): SaveAliasMailSuccess {
  return {
    type: SAVE_ALIAS_MAIL_SUCCESS,
    payload
  };
}
export function saveAliasMailFailure(meta: {
  errorMessage: string
}): SaveAliasMailFailure {
  return {
    type: SAVE_ALIAS_MAIL_FAILURE,
    meta
  };
}
export function getAliasMailRequest(): GetAliasMailRequest {
  return {
    type: GET_ALIAS_MAIL_REQUEST
  };
}
export function getAliasMailSuccess(
  payload: Array<AliasMailType>
): GetAliasMailSuccess {
  return {
    type: GET_ALIAS_MAIL_SUCCESS,
    payload
  };
}
export function getAliasMailFailure(meta: {
  errorMessage: string
}): GetAliasMailFailure {
  return {
    type: GET_ALIAS_MAIL_FAILURE,
    meta
  };
}
export function deleteAliasMailRequest(
  payload: AliasMailType
): DeleteAliasMailRequest {
  return {
    type: DELETE_ALIAS_MAIL_REQUEST,
    payload
  };
}
export function deleteAliasMailSuccess(
  payload: Array<AliasMailType>
): DeleteAliasMailSuccess {
  return {
    type: DELETE_ALIAS_MAIL_SUCCESS,
    payload
  };
}
export function deleteAliasMailFailure(meta: {
  errorMessage: string
}): DeleteAliasMailFailure {
  return {
    type: DELETE_ALIAS_MAIL_FAILURE,
    meta
  };
}
