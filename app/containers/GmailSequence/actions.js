// @flow
import type { GmailSequenceType } from '../../types/gmail';

import {
  CREATE_GMAIL_SEQUENCE_REQUEST,
  CREATE_GMAIL_SEQUENCE_SUCCESS,
  CREATE_GMAIL_SEQUENCE_FAILURE,
  UPDATE_GMAIL_SEQUENCE_REQUEST,
  UPDATE_GMAIL_SEQUENCE_SUCCESS,
  UPDATE_GMAIL_SEQUENCE_FAILURE,
  GET_GMAIL_SEQUENCE_REQUEST,
  GET_GMAIL_SEQUENCE_SUCCESS,
  GET_GMAIL_SEQUENCE_FAILURE,
  DELETE_GMAIL_SEQUENCE_REQUEST,
  DELETE_GMAIL_SEQUENCE_SUCCESS,
  DELETE_GMAIL_SEQUENCE_FAILURE
} from './actionTypes';
import type {
  CreateGmailSequenceRequest,
  CreateGmailSequenceSuccess,
  CreateGmailSequenceFailure,
  UpdateGmailSequenceRequest,
  UpdateGmailSequenceSuccess,
  UpdateGmailSequenceFailure,
  GetGmailSequenceRequest,
  GetGmailSequenceSuccess,
  GetGmailSequenceFailure,
  DeleteGmailSequenceRequest,
  DeleteGmailSequenceSuccess,
  DeleteGmailSequenceFailure
} from './actionTypes';

export function createGmailSequenceRequest(
  payload: GmailSequenceType
): CreateGmailSequenceRequest {
  return {
    type: CREATE_GMAIL_SEQUENCE_REQUEST,
    payload
  };
}
export function createGmailSequenceSuccess(
  payload: Array<GmailSequenceType>
): CreateGmailSequenceSuccess {
  return {
    type: CREATE_GMAIL_SEQUENCE_SUCCESS,
    payload
  };
}
export function createGmailSequenceFailure(meta: {
  errorMessage: string
}): CreateGmailSequenceFailure {
  return {
    type: CREATE_GMAIL_SEQUENCE_FAILURE,
    meta
  };
}
export function updateGmailSequenceRequest(
  payload: GmailSequenceType
): UpdateGmailSequenceRequest {
  return {
    type: UPDATE_GMAIL_SEQUENCE_REQUEST,
    payload
  };
}
export function updateGmailSequenceSuccess(
  payload: Array<GmailSequenceType>
): UpdateGmailSequenceSuccess {
  return {
    type: UPDATE_GMAIL_SEQUENCE_SUCCESS,
    payload
  };
}
export function updateGmailSequenceFailure(meta: {
  errorMessage: string
}): UpdateGmailSequenceFailure {
  return {
    type: UPDATE_GMAIL_SEQUENCE_FAILURE,
    meta
  };
}
export function getGmailSequenceRequest(): GetGmailSequenceRequest {
  return {
    type: GET_GMAIL_SEQUENCE_REQUEST
  };
}
export function getGmailSequenceSuccess(
  payload: Array<GmailSequenceType>
): GetGmailSequenceSuccess {
  return {
    type: GET_GMAIL_SEQUENCE_SUCCESS,
    payload
  };
}
export function getGmailSequenceFailure(meta: {
  errorMessage: string
}): GetGmailSequenceFailure {
  return {
    type: GET_GMAIL_SEQUENCE_FAILURE,
    meta
  };
}
export function deleteGmailSequenceRequest(
  payload: GmailSequenceType
): DeleteGmailSequenceRequest {
  return {
    type: DELETE_GMAIL_SEQUENCE_REQUEST,
    payload
  };
}
export function deleteGmailSequenceSuccess(
  payload: Array<GmailSequenceType>
): DeleteGmailSequenceSuccess {
  return {
    type: DELETE_GMAIL_SEQUENCE_SUCCESS,
    payload
  };
}
export function deleteGmailSequenceFailure(meta: {
  errorMessage: string
}): DeleteGmailSequenceFailure {
  return {
    type: DELETE_GMAIL_SEQUENCE_FAILURE,
    meta
  };
}
