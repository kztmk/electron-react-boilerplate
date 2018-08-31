// @flow
import type { GmailSequenceType } from '../../types/gmail';

export const CREATE_GMAIL_SEQUENCE_REQUEST: 'GmailSequence/CREATE_GMAIL_SEQUENCE_REQUEST' =
  'GmailSequence/CREATE_GMAIL_SEQUENCE_REQUEST';
export const CREATE_GMAIL_SEQUENCE_SUCCESS: 'GmailSequence/CREATE_GMAIL_SEQUENCE_SUCCESS' =
  'GmailSequence/CREATE_GMAIL_SEQUENCE_SUCCESS';
export const CREATE_GMAIL_SEQUENCE_FAILURE: 'GmailSequence/CREATE_GMAIL_SEQUENCE_FAILURE' =
  'GmailSequence/CREATE_GMAIL_SEQUENCE_FAILURE';
export const UPDATE_GMAIL_SEQUENCE_REQUEST: 'GmailSequence/UPDATE_GMAIL_SEQUENCE_REQUEST' =
  'GmailSequence/UPDATE_GMAIL_SEQUENCE_REQUEST';
export const UPDATE_GMAIL_SEQUENCE_SUCCESS: 'GmailSequence/UPDATE_GMAIL_SEQUENCE_SUCCESS' =
  'GmailSequence/UPDATE_GMAIL_SEQUENCE_SUCCESS';
export const UPDATE_GMAIL_SEQUENCE_FAILURE: 'GmailSequence/UPDATE_GMAIL_SEQUENCE_FAILURE' =
  'GmailSequence/UPDATE_GMAIL_SEQUENCE_FAILURE';
export const GET_GMAIL_SEQUENCE_REQUEST: 'GmailSequence/GET_GMAIL_SEQUENCE_REQUEST' =
  'GmailSequence/GET_GMAIL_SEQUENCE_REQUEST';
export const GET_GMAIL_SEQUENCE_SUCCESS: 'GmailSequence/GET_GMAIL_SEQUENCE_SUCCESS' =
  'GmailSequence/GET_GMAIL_SEQUENCE_SUCCESS';
export const GET_GMAIL_SEQUENCE_FAILURE: 'GmailSequence/GET_GMAIL_SEQUENCE_FAILURE' =
  'GmailSequence/GET_GMAIL_SEQUENCE_FAILURE';
export const DELETE_GMAIL_SEQUENCE_REQUEST: 'GmailSequence/DELETE_GMAIL_SEQUENCE_REQUEST' =
  'GmailSequence/DELETE_GMAIL_SEQUENCE_REQUEST';
export const DELETE_GMAIL_SEQUENCE_SUCCESS: 'GmailSequence/DELETE_GMAIL_SEQUENCE_SUCCESS' =
  'GmailSequence/DELETE_GMAIL_SEQUENCE_SUCCESS';
export const DELETE_GMAIL_SEQUENCE_FAILURE: 'GmailSequence/DELETE_GMAIL_SEQUENCE_FAILURE' =
  'GmailSequence/DELETE_GMAIL_SEQUENCE_FAILURE';

export const Actions = {
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
};

export type CreateGmailSequenceRequest = {
  type: typeof CREATE_GMAIL_SEQUENCE_REQUEST,
  payload: GmailSequenceType
};
export type CreateGmailSequenceSuccess = {
  type: typeof CREATE_GMAIL_SEQUENCE_SUCCESS,
  payload: Array<GmailSequenceType>
};
export type CreateGmailSequenceFailure = {
  type: typeof CREATE_GMAIL_SEQUENCE_FAILURE,
  meta: { errorMessage: string }
};
export type UpdateGmailSequenceRequest = {
  type: typeof UPDATE_GMAIL_SEQUENCE_REQUEST,
  payload: GmailSequenceType
};
export type UpdateGmailSequenceSuccess = {
  type: typeof UPDATE_GMAIL_SEQUENCE_SUCCESS,
  payload: Array<GmailSequenceType>
};
export type UpdateGmailSequenceFailure = {
  type: typeof UPDATE_GMAIL_SEQUENCE_FAILURE,
  meta: { errorMessage: string }
};
export type GetGmailSequenceRequest = {
  type: typeof GET_GMAIL_SEQUENCE_REQUEST
};
export type GetGmailSequenceSuccess = {
  type: typeof GET_GMAIL_SEQUENCE_SUCCESS,
  payload: Array<GmailSequenceType>
};
export type GetGmailSequenceFailure = {
  type: typeof GET_GMAIL_SEQUENCE_FAILURE,
  meta: { errorMessage: string }
};
export type DeleteGmailSequenceRequest = {
  type: typeof DELETE_GMAIL_SEQUENCE_REQUEST,
  payload: GmailSequenceType
};
export type DeleteGmailSequenceSuccess = {
  type: typeof DELETE_GMAIL_SEQUENCE_SUCCESS,
  payload: Array<GmailSequenceType>
};
export type DeleteGmailSequenceFailure = {
  type: typeof DELETE_GMAIL_SEQUENCE_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | CreateGmailSequenceRequest
  | CreateGmailSequenceSuccess
  | CreateGmailSequenceFailure
  | UpdateGmailSequenceRequest
  | UpdateGmailSequenceSuccess
  | UpdateGmailSequenceFailure
  | GetGmailSequenceRequest
  | GetGmailSequenceSuccess
  | GetGmailSequenceFailure
  | DeleteGmailSequenceRequest
  | DeleteGmailSequenceSuccess
  | DeleteGmailSequenceFailure;
