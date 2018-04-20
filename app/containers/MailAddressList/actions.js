/* eslint-disable function-paren-newline */
// @flow
import type MailAccountType from '../../types/mailAccount';

import {
  GET_MAIL_ADDRESS_REQUEST,
  GET_MAIL_ADDRESS_SUCCESS,
  GET_MAIL_ADDRESS_FAILURE,
  CREATE_MAIL_ADDRESS_REQUEST,
  CREATE_MAIL_ADDRESS_SUCCESS,
  CREATE_MAIL_ADDRESS_FAILURE,
  UPDATE_MAIL_ADDRESS_REQUEST,
  UPDATE_MAIL_ADDRESS_SUCCESS,
  UPDATE_MAIL_ADDRESS_FAILURE,
  DELETE_MAIL_ADDRESS_REQUEST,
  DELETE_MAIL_ADDRESS_SUCCESS,
  DELETE_MAIL_ADDRESS_FAILURE,
  IMPORT_MAIL_ADDRESS_REQUEST,
  IMPORT_MAIL_ADDRESS_SUCCESS,
  IMPORT_MAIL_ADDRESS_FAILURE,
  CLEAR_MAIL_ADDRESS
} from './actionTypes';
import type {
  GetMailAddressRequest,
  GetMailAddressSuccess,
  GetMailAddressFailure,
  CreateMailAddressRequest,
  CreateMailAddressSuccess,
  CreateMailAddressFailure,
  UpdateMailAddressRequest,
  UpdateMailAddressSuccess,
  UpdateMailAddressFailure,
  DeleteMailAddressRequest,
  DeleteMailAddressSuccess,
  DeleteMailAddressFailure,
  ImportMailAddressRequest,
  ImportMailAddressSuccess,
  ImportMailAddressFailure,
  ClearMailAddress
} from './actionTypes';

export function getMailAddressRequest(): GetMailAddressRequest {
  return {
    type: GET_MAIL_ADDRESS_REQUEST
  };
}
export function getMailAddressSuccess(payload: Array<MailAccountType>): GetMailAddressSuccess {
  return {
    type: GET_MAIL_ADDRESS_SUCCESS,
    payload
  };
}
export function getMailAddressFailure(payload: string): GetMailAddressFailure {
  return {
    type: GET_MAIL_ADDRESS_FAILURE,
    payload
  };
}
export function createMailAddressRequest(payload: MailAccountType): CreateMailAddressRequest {
  return {
    type: CREATE_MAIL_ADDRESS_REQUEST,
    payload
  };
}
export function createMailAddressSuccess(
  payload: Array<MailAccountType>
): CreateMailAddressSuccess {
  return {
    type: CREATE_MAIL_ADDRESS_SUCCESS,
    payload
  };
}
export function createMailAddressFailure(payload: string): CreateMailAddressFailure {
  return {
    type: CREATE_MAIL_ADDRESS_FAILURE,
    payload
  };
}
export function updateMailAddressRequest(payload: MailAccountType): UpdateMailAddressRequest {
  return {
    type: UPDATE_MAIL_ADDRESS_REQUEST,
    payload
  };
}
export function updateMailAddressSuccess(
  payload: Array<MailAccountType>
): UpdateMailAddressSuccess {
  return {
    type: UPDATE_MAIL_ADDRESS_SUCCESS,
    payload
  };
}
export function updateMailAddressFailure(payload: string): UpdateMailAddressFailure {
  return {
    type: UPDATE_MAIL_ADDRESS_FAILURE,
    payload
  };
}
export function deleteMailAddressRequest(payload: MailAccountType): DeleteMailAddressRequest {
  return {
    type: DELETE_MAIL_ADDRESS_REQUEST,
    payload
  };
}
export function deleteMailAddressSuccess(
  payload: Array<MailAccountType>
): DeleteMailAddressSuccess {
  return {
    type: DELETE_MAIL_ADDRESS_SUCCESS,
    payload
  };
}
export function deleteMailAddressFailure(payload: string): DeleteMailAddressFailure {
  return {
    type: DELETE_MAIL_ADDRESS_FAILURE,
    payload
  };
}
export function importMailAddressRequest(
  payload: Array<MailAccountType>
): ImportMailAddressRequest {
  return {
    type: IMPORT_MAIL_ADDRESS_REQUEST,
    payload
  };
}
export function importMailAddressSuccess(
  payload: Array<MailAccountType>,
  meta: { errorAccounts: Array<MailAccountType>, req: number, in: number, out: number }
): ImportMailAddressSuccess {
  return {
    type: IMPORT_MAIL_ADDRESS_SUCCESS,
    payload,
    meta
  };
}
export function importMailAddressFailure(payload: string): ImportMailAddressFailure {
  return {
    type: IMPORT_MAIL_ADDRESS_FAILURE,
    payload
  };
}
export function clearMailAddress(): ClearMailAddress {
  return {
    type: CLEAR_MAIL_ADDRESS
  };
}
