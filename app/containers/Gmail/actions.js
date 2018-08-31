// @flow
import type GmailType from '../../types/gmail';

import {
  SAVE_GMAIL_INFO_REQUEST,
  SAVE_GMAIL_INFO_SUCCESS,
  SAVE_GMAIL_INFO_FAILURE,
  GET_GMAIL_INFO_REQUEST,
  GET_GMAIL_INFO_SUCCESS,
  GET_GMAIL_INFO_FAILURE
} from './actionTypes';
import type {
  SaveGmailInfoRequest,
  SaveGmailInfoSuccess,
  SaveGmailInfoFailure,
  GetGmailInfoRequest,
  GetGmailInfoSuccess,
  GetGmailInfoFailure
} from './actionTypes';

export function saveGmailInfoRequest(payload: GmailType): SaveGmailInfoRequest {
  return {
    type: SAVE_GMAIL_INFO_REQUEST,
    payload
  };
}
export function saveGmailInfoSuccess(payload: GmailType): SaveGmailInfoSuccess {
  return {
    type: SAVE_GMAIL_INFO_SUCCESS,
    payload
  };
}
export function saveGmailInfoFailure(meta: { errorMessage: string }): SaveGmailInfoFailure {
  return {
    type: SAVE_GMAIL_INFO_FAILURE,
    meta
  };
}
export function getGmailInfoRequest(): GetGmailInfoRequest {
  return {
    type: GET_GMAIL_INFO_REQUEST
  };
}
export function getGmailInfoSuccess(payload: GmailType): GetGmailInfoSuccess {
  return {
    type: GET_GMAIL_INFO_SUCCESS,
    payload
  };
}
export function getGmailInfoFailure(meta: { errorMessage: string }): GetGmailInfoFailure {
  return {
    type: GET_GMAIL_INFO_FAILURE,
    meta
  };
}
