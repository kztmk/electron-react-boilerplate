// @flow
import type GmailType from '../../types/gmail';

export const SAVE_GMAIL_INFO_REQUEST: 'Gmail/SAVE_GMAIL_INFO_REQUEST' =
  'Gmail/SAVE_GMAIL_INFO_REQUEST';
export const SAVE_GMAIL_INFO_SUCCESS: 'Gmail/SAVE_GMAIL_INFO_SUCCESS' =
  'Gmail/SAVE_GMAIL_INFO_SUCCESS';
export const SAVE_GMAIL_INFO_FAILURE: 'Gmail/SAVE_GMAIL_INFO_FAILURE' =
  'Gmail/SAVE_GMAIL_INFO_FAILURE';
export const GET_GMAIL_INFO_REQUEST: 'Gmail/GET_GMAIL_INFO_REQUEST' =
  'Gmail/GET_GMAIL_INFO_REQUEST';
export const GET_GMAIL_INFO_SUCCESS: 'Gmail/GET_GMAIL_INFO_SUCCESS' =
  'Gmail/GET_GMAIL_INFO_SUCCESS';
export const GET_GMAIL_INFO_FAILURE: 'Gmail/GET_GMAIL_INFO_FAILURE' =
  'Gmail/GET_GMAIL_INFO_FAILURE';

export const Actions = {
  SAVE_GMAIL_INFO_REQUEST,
  SAVE_GMAIL_INFO_SUCCESS,
  SAVE_GMAIL_INFO_FAILURE,
  GET_GMAIL_INFO_REQUEST,
  GET_GMAIL_INFO_SUCCESS,
  GET_GMAIL_INFO_FAILURE
};

export type SaveGmailInfoRequest = {
  type: typeof SAVE_GMAIL_INFO_REQUEST,
  payload: GmailType
};
export type SaveGmailInfoSuccess = {
  type: typeof SAVE_GMAIL_INFO_SUCCESS,
  payload: GmailType
};
export type SaveGmailInfoFailure = {
  type: typeof SAVE_GMAIL_INFO_FAILURE,
  meta: { errorMessage: string }
};
export type GetGmailInfoRequest = {
  type: typeof GET_GMAIL_INFO_REQUEST
};
export type GetGmailInfoSuccess = {
  type: typeof GET_GMAIL_INFO_SUCCESS,
  payload: GmailType
};
export type GetGmailInfoFailure = {
  type: typeof GET_GMAIL_INFO_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | SaveGmailInfoRequest
  | SaveGmailInfoSuccess
  | SaveGmailInfoFailure
  | GetGmailInfoRequest
  | GetGmailInfoSuccess
  | GetGmailInfoFailure;
