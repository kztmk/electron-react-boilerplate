// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import { MailBoxesType, MailBoxInfoType, MailRowMessageType } from '../../types/mailMessageType';

export type State = {
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  mailBoxes: Array<MailBoxesType>,
  selectMailBoxPath: string,
  messages: Array<MailRowMessageType>,
  mailCount: number,
  unseenCount: number,
  seqFrom: number
};

export const initialMailBoxInfo: MailBoxInfoType = {
  exists: 0,
  flags: [],
  permanentFlags: [],
  readOnly: false,
  uidValidity: 0,
  uidNext: 0,
  highestModseq: ''
};

export const initialMailBox: MailBoxesType = {
  name: '',
  path: '',
  delimiter: '',
  listed: false,
  subscribed: false,
  specialUse: '',
  specialUseFlag: '',
  flags: [],
  children: []
};

export const initialState: State = {
  isLoading: false,
  isFailure: false,
  errorMessage: '',
  mailBoxes: [],
  selectMailBoxPath: '',
  messages: [],
  mailCount: 0,
  unseenCount: 0,
  seqFrom: 1
};

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.OPEN_CONNECTION_REQUEST:
      return {
        ...initialState,
        isLoading: true
      };

    case Actions.OPEN_CONNECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        mailBoxes: action.payload.mailBoxes,
        selectMailBoxPath: action.payload.selectMailBoxPath,
        messages: action.payload.messages,
        mailCount: action.payload.mailCount,
        unseenCount: action.payload.unseenCount,
        seqFrom: action.payload.seqFrom
      };

    case Actions.OPEN_CONNECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.SELECT_MAIL_BOX_REQUEST:
      return {
        ...state,
        isLoading: true,
        selectMailBoxPath: action.payload.path,
        seqFrom: action.payload.seqFrom
      };

    case Actions.SELECT_MAIL_BOX_SUCCESS:
      return {
        ...state,
        isLoading: false,
        mailBoxes: action.payload.mailBoxes,
        selectMailBoxPath: action.payload.selectMailBoxPath,
        messages: action.payload.messages,
        mailCount: action.payload.mailCount,
        unseenCount: action.payload.unseenCount,
        seqFrom: action.payload.seqFrom
      };

    case Actions.SELECT_MAIL_BOX_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.DELETE_MESSAGE_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        mailBoxes: action.payload.mailBoxes,
        selectMailBoxPath: action.payload.selectMailBoxPath,
        messages: action.payload.messages,
        mailCount: action.payload.mailCount,
        unseenCount: action.payload.unseenCount,
        seqFrom: action.payload.seqFrom
      };

    case Actions.DELETE_MESSAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.UPDATE_FLAGS_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.UPDATE_FLAGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        messages: action.payload.messages,
        unseenCount: action.payload.unseenCount
      };

    case Actions.UPDATE_FLAGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.MOVE_MAILS_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.MOVE_MAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectMailBoxPath: action.payload.selectMailBoxPath,
        messages: action.payload.messages,
        mailCount: action.payload.mailCount,
        unseenCount: action.payload.unseenCount,
        seqFrom: action.payload.seqFrom
      };

    case Actions.MOVE_MAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.CLOSE_CONNECTION_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.CLOSE_CONNECTION_SUCCESS:
      return {
        ...initialState
      };

    case Actions.CLOSE_CONNECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    default:
      return state;
  }
}
