// @flow
import type { SequenceType } from '../../types/sequence';

export const CREATE_SEQUENCE_REQUEST: 'Sequence/CREATE_SEQUENCE_REQUEST' =
  'Sequence/CREATE_SEQUENCE_REQUEST';
export const CREATE_SEQUENCE_SUCCESS: 'Sequence/CREATE_SEQUENCE_SUCCESS' =
  'Sequence/CREATE_SEQUENCE_SUCCESS';
export const CREATE_SEQUENCE_FAILURE: 'Sequence/CREATE_SEQUENCE_FAILURE' =
  'Sequence/CREATE_SEQUENCE_FAILURE';
export const UPDATE_SEQUENCE_REQUEST: 'Sequence/UPDATE_SEQUENCE_REQUEST' =
  'Sequence/UPDATE_SEQUENCE_REQUEST';
export const UPDATE_SEQUENCE_SUCCESS: 'Sequence/UPDATE_SEQUENCE_SUCCESS' =
  'Sequence/UPDATE_SEQUENCE_SUCCESS';
export const UPDATE_SEQUENCE_FAILURE: 'Sequence/UPDATE_SEQUENCE_FAILURE' =
  'Sequence/UPDATE_SEQUENCE_FAILURE';
export const GET_SEQUENCE_REQUEST: 'Sequence/GET_SEQUENCE_REQUEST' =
  'Sequence/GET_SEQUENCE_REQUEST';
export const GET_SEQUENCE_SUCCESS: 'Sequence/GET_SEQUENCE_SUCCESS' =
  'Sequence/GET_SEQUENCE_SUCCESS';
export const GET_SEQUENCE_FAILURE: 'Sequence/GET_SEQUENCE_FAILURE' =
  'Sequence/GET_SEQUENCE_FAILURE';
export const DELETE_SEQUENCE_REQUEST: 'Sequence/DELETE_SEQUENCE_REQUEST' =
  'Sequence/DELETE_SEQUENCE_REQUEST';
export const DELETE_SEQUENCE_SUCCESS: 'Sequence/DELETE_SEQUENCE_SUCCESS' =
  'Sequence/DELETE_SEQUENCE_SUCCESS';
export const DELETE_SEQUENCE_FAILURE: 'Sequence/DELETE_SEQUENCE_FAILURE' =
  'Sequence/DELETE_SEQUENCE_FAILURE';

export const Actions = {
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
};

export type CreateSequenceRequest = {
  type: typeof CREATE_SEQUENCE_REQUEST,
  payload: SequenceType
};
export type CreateSequenceSuccess = {
  type: typeof CREATE_SEQUENCE_SUCCESS,
  payload: Array<SequenceType>
};
export type CreateSequenceFailure = {
  type: typeof CREATE_SEQUENCE_FAILURE,
  meta: { errorMessage: string }
};
export type UpdateSequenceRequest = {
  type: typeof UPDATE_SEQUENCE_REQUEST,
  payload: SequenceType
};
export type UpdateSequenceSuccess = {
  type: typeof UPDATE_SEQUENCE_SUCCESS,
  payload: Array<SequenceType>
};
export type UpdateSequenceFailure = {
  type: typeof UPDATE_SEQUENCE_FAILURE,
  meta: { errorMessage: string }
};
export type GetSequenceRequest = {
  type: typeof GET_SEQUENCE_REQUEST
};
export type GetSequenceSuccess = {
  type: typeof GET_SEQUENCE_SUCCESS,
  payload: Array<SequenceType>
};
export type GetSequenceFailure = {
  type: typeof GET_SEQUENCE_FAILURE,
  meta: { errorMessage: string }
};
export type DeleteSequenceRequest = {
  type: typeof DELETE_SEQUENCE_REQUEST,
  payload: SequenceType
};
export type DeleteSequenceSuccess = {
  type: typeof DELETE_SEQUENCE_SUCCESS,
  payload: Array<SequenceType>
};
export type DeleteSequenceFailure = {
  type: typeof DELETE_SEQUENCE_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | CreateSequenceRequest
  | CreateSequenceSuccess
  | CreateSequenceFailure
  | UpdateSequenceRequest
  | UpdateSequenceSuccess
  | UpdateSequenceFailure
  | GetSequenceRequest
  | GetSequenceSuccess
  | GetSequenceFailure
  | DeleteSequenceRequest
  | DeleteSequenceSuccess
  | DeleteSequenceFailure;
