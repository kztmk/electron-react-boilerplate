// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type GmailType from '../../types/gmail';

export type State = {
  isGmailInfoLoading: boolean,
  isGmailInfoFailure: boolean,
  errorMessage: string,
  gmailInfo: GmailType
};

export const initialGmailInfo: GmailType = {
  accountId: '',
  domain: '',
  password: '',
  random: true,
  sequences: []
};

export const initialState: State = {
  isGmailInfoLoading: false,
  isGmailInfoFailure: false,
  errorMessage: '',
  gmailInfo: initialGmailInfo
};

export default function(state: State = initialState, action: Action): Exact<State> {
  switch (action.type) {
    case Actions.SAVE_GMAIL_INFO_REQUEST:
      return {
        ...state,
        isGmailInfoLoading: true
      };
    case Actions.SAVE_GMAIL_INFO_SUCCESS:
      return {
        ...state,
        isGmailInfoLoading: false,
        gmailInfo: action.payload
      };
    case Actions.SAVE_GMAIL_INFO_FAILURE:
      return {
        ...state,
        isGmailInfoLoading: false,
        isGmailInfoFailure: true,
        errorMessage: action.meta.errorMessage
      };
    case Actions.GET_GMAIL_INFO_REQUEST:
      return {
        ...state,
        isGmailInfoLoading: true
      };
    case Actions.GET_GMAIL_INFO_SUCCESS:
      return {
        ...state,
        isGmailInfoLoading: false,
        gmailInfo: action.payload
      };
    case Actions.GET_GMAIL_INFO_FAILURE:
      return {
        ...state,
        isGmailInfoLoading: false,
        isGmailInfoFailure: true,
        errorMessage: action.meta.errorMessage
      };
    default:
      return state;
  }
}
