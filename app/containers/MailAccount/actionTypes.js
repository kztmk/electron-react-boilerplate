// @flow
import type MailAccountType from '../../types/mailAccount';
import type {
  ImapFlagsArgsType,
  ImapManagerPropertyType
} from '../../types/mailMessageType';

export const OPEN_CONNECTION_REQUEST: 'MailAccount/OPEN_CONNECTION_REQUEST' =
  'MailAccount/OPEN_CONNECTION_REQUEST';
export const OPEN_CONNECTION_SUCCESS: 'MailAccount/OPEN_CONNECTION_SUCCESS' =
  'MailAccount/OPEN_CONNECTION_SUCCESS';
export const OPEN_CONNECTION_FAILURE: 'MailAccount/OPEN_CONNECTION_FAILURE' =
  'MailAccount/OPEN_CONNECTION_FAILURE';
export const SELECT_MAIL_BOX_REQUEST: 'MailAccount/SELECT_MAIL_BOX_REQUEST' =
  'MailAccount/SELECT_MAIL_BOX_REQUEST';
export const SELECT_MAIL_BOX_SUCCESS: 'MailAccount/SELECT_MAIL_BOX_SUCCESS' =
  'MailAccount/SELECT_MAIL_BOX_SUCCESS';
export const SELECT_MAIL_BOX_FAILURE: 'MailAccount/SELECT_MAIL_BOX_FAILURE' =
  'MailAccount/SELECT_MAIL_BOX_FAILURE';
export const DELETE_MESSAGE_REQUEST: 'MailAccount/DELETE_MESSAGE_REQUEST' =
  'MailAccount/DELETE_MESSAGE_REQUEST';
export const DELETE_MESSAGE_SUCCESS: 'MailAccount/DELETE_MESSAGE_SUCCESS' =
  'MailAccount/DELETE_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_FAILURE: 'MailAccount/DELETE_MESSAGE_FAILURE' =
  'MailAccount/DELETE_MESSAGE_FAILURE';
export const UPDATE_FLAGS_REQUEST: 'MailAccount/UPDATE_FLAGS_REQUEST' =
  'MailAccount/UPDATE_FLAGS_REQUEST';
export const UPDATE_FLAGS_SUCCESS: 'MailAccount/UPDATE_FLAGS_SUCCESS' =
  'MailAccount/UPDATE_FLAGS_SUCCESS';
export const UPDATE_FLAGS_FAILURE: 'MailAccount/UPDATE_FLAGS_FAILURE' =
  'MailAccount/UPDATE_FLAGS_FAILURE';
export const MOVE_MAILS_REQUEST: 'MailAccount/MOVE_MAILS_REQUEST' =
  'MailAccount/MOVE_MAILS_REQUEST';
export const MOVE_MAILS_SUCCESS: 'MailAccount/MOVE_MAILS_SUCCESS' =
  'MailAccount/MOVE_MAILS_SUCCESS';
export const MOVE_MAILS_FAILURE: 'MailAccount/MOVE_MAILS_FAILURE' =
  'MailAccount/MOVE_MAILS_FAILURE';
export const CLOSE_CONNECTION_REQUEST: 'MailAccount/CLOSE_CONNECTION_REQUEST' =
  'MailAccount/CLOSE_CONNECTION_REQUEST';
export const CLOSE_CONNECTION_SUCCESS: 'MailAccount/CLOSE_CONNECTION_SUCCESS' =
  'MailAccount/CLOSE_CONNECTION_SUCCESS';
export const CLOSE_CONNECTION_FAILURE: 'MailAccount/CLOSE_CONNECTION_FAILURE' =
  'MailAccount/CLOSE_CONNECTION_FAILURE';

export const Actions = {
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
};

export type OpenConnectionRequest = {
  type: typeof OPEN_CONNECTION_REQUEST,
  payload: MailAccountType
};
export type OpenConnectionSuccess = {
  type: typeof OPEN_CONNECTION_SUCCESS,
  payload: ImapManagerPropertyType
};
export type OpenConnectionFailure = {
  type: typeof OPEN_CONNECTION_FAILURE,
  meta: { errorMessage: string }
};
export type SelectMailBoxRequest = {
  type: typeof SELECT_MAIL_BOX_REQUEST,
  payload: { path: string, seqFrom: number }
};
export type SelectMailBoxSuccess = {
  type: typeof SELECT_MAIL_BOX_SUCCESS,
  payload: ImapManagerPropertyType
};
export type SelectMailBoxFailure = {
  type: typeof SELECT_MAIL_BOX_FAILURE,
  meta: { errorMessage: string }
};
export type DeleteMessageRequest = {
  type: typeof DELETE_MESSAGE_REQUEST,
  payload: string
};
export type DeleteMessageSuccess = {
  type: typeof DELETE_MESSAGE_SUCCESS,
  payload: ImapManagerPropertyType
};
export type DeleteMessageFailure = {
  type: typeof DELETE_MESSAGE_FAILURE,
  meta: { errorMessage: string }
};
export type UpdateFlagsRequest = {
  type: typeof UPDATE_FLAGS_REQUEST,
  payload: ImapFlagsArgsType
};
export type UpdateFlagsSuccess = {
  type: typeof UPDATE_FLAGS_SUCCESS,
  payload: ImapManagerPropertyType
};
export type UpdateFlagsFailure = {
  type: typeof UPDATE_FLAGS_FAILURE,
  meta: { errorMessage: string }
};
export type MoveMailsRequest = {
  type: typeof MOVE_MAILS_REQUEST,
  payload: ImapFlagsArgsType
};
export type MoveMailsSuccess = {
  type: typeof MOVE_MAILS_SUCCESS,
  payload: ImapManagerPropertyType
};
export type MoveMailsFailure = {
  type: typeof MOVE_MAILS_FAILURE,
  meta: { errorMessage: string }
};
export type CloseConnectionRequest = {
  type: typeof CLOSE_CONNECTION_REQUEST
};
export type CloseConnectionSuccess = {
  type: typeof CLOSE_CONNECTION_SUCCESS
};
export type CloseConnectionFailure = {
  type: typeof CLOSE_CONNECTION_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | OpenConnectionRequest
  | OpenConnectionSuccess
  | OpenConnectionFailure
  | SelectMailBoxRequest
  | SelectMailBoxSuccess
  | SelectMailBoxFailure
  | DeleteMessageRequest
  | DeleteMessageSuccess
  | DeleteMessageFailure
  | UpdateFlagsRequest
  | UpdateFlagsSuccess
  | UpdateFlagsFailure
  | MoveMailsRequest
  | MoveMailsSuccess
  | MoveMailsFailure
  | CloseConnectionRequest
  | CloseConnectionSuccess
  | CloseConnectionFailure;
