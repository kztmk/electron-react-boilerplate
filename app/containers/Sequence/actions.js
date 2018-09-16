// @flow
import type { SequenceType } from '../../types/sequence';

import {
  CREATE_SEQUENCE_REQUEST,
  CREATE_SEQUENCE_SUCCESS,
  CREATE_SEQUENCE_FAILURE,
  UPDATE_SEQUENCE_REQUEST,
  UPDATE_SEQUENCE_SUCCESS,
  UPDATE_SEQUENCE_FAILURE,
  GET_SEQUENCE_REQUEST,
  GET_SEQUENCE_SUCCESS,
  GET_SEQUENCE_FAILURE,
  DELETE_SEQUENCE_REQUEST,
  DELETE_SEQUENCE_SUCCESS,
  DELETE_SEQUENCE_FAILURE
} from './actionTypes';
import type {
  CreateSequenceRequest,
  CreateSequenceSuccess,
  CreateSequenceFailure,
  UpdateSequenceRequest,
  UpdateSequenceSuccess,
  UpdateSequenceFailure,
  GetSequenceRequest,
  GetSequenceSuccess,
  GetSequenceFailure,
  DeleteSequenceRequest,
  DeleteSequenceSuccess,
  DeleteSequenceFailure
} from './actionTypes';

export function createSequenceRequest(
  payload: SequenceType
): CreateSequenceRequest {
  return {
    type: CREATE_SEQUENCE_REQUEST,
    payload
  };
}
export function createSequenceSuccess(
  payload: Array<SequenceType>
): CreateSequenceSuccess {
  return {
    type: CREATE_SEQUENCE_SUCCESS,
    payload
  };
}
export function createSequenceFailure(meta: {
  errorMessage: string
}): CreateSequenceFailure {
  return {
    type: CREATE_SEQUENCE_FAILURE,
    meta
  };
}
export function updateSequenceRequest(
  payload: SequenceType
): UpdateSequenceRequest {
  return {
    type: UPDATE_SEQUENCE_REQUEST,
    payload
  };
}
export function updateSequenceSuccess(
  payload: Array<SequenceType>
): UpdateSequenceSuccess {
  return {
    type: UPDATE_SEQUENCE_SUCCESS,
    payload
  };
}
export function updateSequenceFailure(meta: {
  errorMessage: string
}): UpdateSequenceFailure {
  return {
    type: UPDATE_SEQUENCE_FAILURE,
    meta
  };
}
export function getSequenceRequest(): GetSequenceRequest {
  return {
    type: GET_SEQUENCE_REQUEST
  };
}
export function getSequenceSuccess(
  payload: Array<SequenceType>
): GetSequenceSuccess {
  return {
    type: GET_SEQUENCE_SUCCESS,
    payload
  };
}
export function getSequenceFailure(meta: {
  errorMessage: string
}): GetSequenceFailure {
  return {
    type: GET_SEQUENCE_FAILURE,
    meta
  };
}
export function deleteSequenceRequest(
  payload: SequenceType
): DeleteSequenceRequest {
  return {
    type: DELETE_SEQUENCE_REQUEST,
    payload
  };
}
export function deleteSequenceSuccess(
  payload: Array<SequenceType>
): DeleteSequenceSuccess {
  return {
    type: DELETE_SEQUENCE_SUCCESS,
    payload
  };
}
export function deleteSequenceFailure(meta: {
  errorMessage: string
}): DeleteSequenceFailure {
  return {
    type: DELETE_SEQUENCE_FAILURE,
    meta
  };
}
