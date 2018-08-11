// @flow
import type MailAccountType from '../../types/mailAccount';
import type {
  ImapFlagsArgsType,
  ImapManagerPropertyType
} from '../../types/mailMessageType';

import {
  OPEN_CONNECTION_REQUEST,
  OPEN_CONNECTION_SUCCESS,
  OPEN_CONNECTION_FAILURE,
  SELECT_MAIL_BOX_REQUEST,
  SELECT_MAIL_BOX_SUCCESS,
  SELECT_MAIL_BOX_FAILURE,
  DELETE_MESSAGE_REQUEST,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAILURE,
  UPDATE_FLAGS_REQUEST,
  UPDATE_FLAGS_SUCCESS,
  UPDATE_FLAGS_FAILURE,
  MOVE_MAILS_REQUEST,
  MOVE_MAILS_SUCCESS,
  MOVE_MAILS_FAILURE,
  CLOSE_CONNECTION_REQUEST,
  CLOSE_CONNECTION_SUCCESS,
  CLOSE_CONNECTION_FAILURE
} from './actionTypes';
import type {
  OpenConnectionRequest,
  OpenConnectionSuccess,
  OpenConnectionFailure,
  SelectMailBoxRequest,
  SelectMailBoxSuccess,
  SelectMailBoxFailure,
  DeleteMessageRequest,
  DeleteMessageSuccess,
  DeleteMessageFailure,
  UpdateFlagsRequest,
  UpdateFlagsSuccess,
  UpdateFlagsFailure,
  MoveMailsRequest,
  MoveMailsSuccess,
  MoveMailsFailure,
  CloseConnectionRequest,
  CloseConnectionSuccess,
  CloseConnectionFailure
} from './actionTypes';

export function openConnectionRequest(
  payload: MailAccountType
): OpenConnectionRequest {
  return {
    type: OPEN_CONNECTION_REQUEST,
    payload
  };
}
export function openConnectionSuccess(
  payload: ImapManagerPropertyType
): OpenConnectionSuccess {
  return {
    type: OPEN_CONNECTION_SUCCESS,
    payload
  };
}
export function openConnectionFailure(meta: {
  errorMessage: string
}): OpenConnectionFailure {
  return {
    type: OPEN_CONNECTION_FAILURE,
    meta
  };
}
export function selectMailBoxRequest(payload: {
  path: string,
  seqFrom: number
}): SelectMailBoxRequest {
  return {
    type: SELECT_MAIL_BOX_REQUEST,
    payload
  };
}
export function selectMailBoxSuccess(
  payload: ImapManagerPropertyType
): SelectMailBoxSuccess {
  return {
    type: SELECT_MAIL_BOX_SUCCESS,
    payload
  };
}
export function selectMailBoxFailure(meta: {
  errorMessage: string
}): SelectMailBoxFailure {
  return {
    type: SELECT_MAIL_BOX_FAILURE,
    meta
  };
}
export function deleteMessageRequest(payload: string): DeleteMessageRequest {
  return {
    type: DELETE_MESSAGE_REQUEST,
    payload
  };
}
export function deleteMessageSuccess(
  payload: ImapManagerPropertyType
): DeleteMessageSuccess {
  return {
    type: DELETE_MESSAGE_SUCCESS,
    payload
  };
}
export function deleteMessageFailure(meta: {
  errorMessage: string
}): DeleteMessageFailure {
  return {
    type: DELETE_MESSAGE_FAILURE,
    meta
  };
}
export function updateFlagsRequest(
  payload: ImapFlagsArgsType
): UpdateFlagsRequest {
  return {
    type: UPDATE_FLAGS_REQUEST,
    payload
  };
}
export function updateFlagsSuccess(
  payload: ImapManagerPropertyType
): UpdateFlagsSuccess {
  return {
    type: UPDATE_FLAGS_SUCCESS,
    payload
  };
}
export function updateFlagsFailure(meta: {
  errorMessage: string
}): UpdateFlagsFailure {
  return {
    type: UPDATE_FLAGS_FAILURE,
    meta
  };
}
export function moveMailsRequest(payload: ImapFlagsArgsType): MoveMailsRequest {
  return {
    type: MOVE_MAILS_REQUEST,
    payload
  };
}
export function moveMailsSuccess(
  payload: ImapManagerPropertyType
): MoveMailsSuccess {
  return {
    type: MOVE_MAILS_SUCCESS,
    payload
  };
}
export function moveMailsFailure(meta: {
  errorMessage: string
}): MoveMailsFailure {
  return {
    type: MOVE_MAILS_FAILURE,
    meta
  };
}
export function closeConnectionRequest(): CloseConnectionRequest {
  return {
    type: CLOSE_CONNECTION_REQUEST
  };
}
export function closeConnectionSuccess(): CloseConnectionSuccess {
  return {
    type: CLOSE_CONNECTION_SUCCESS
  };
}
export function closeConnectionFailure(meta: {
  errorMessage: string
}): CloseConnectionFailure {
  return {
    type: CLOSE_CONNECTION_FAILURE,
    meta
  };
}
