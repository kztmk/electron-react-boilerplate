// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type { GmailSequenceType } from '../../types/gmail';

export type State = {
  isGmailSequencesLoading: boolean,
  isGmailSequencesFailure: boolean,
  errorMessage: string,
  gmailSequences: Array<GmailSequenceType>
};

export const initialState: State = {
  isGmailSequencesLoading: false,
  isGmailSequencesFailure: false,
  errorMessage: '',
  gmailSequences: []
};

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.CREATE_GMAIL_SEQUENCE_REQUEST:
      return {
        ...state,
        isGmailSequencesLoading: true
      };

    case Actions.CREATE_GMAIL_SEQUENCE_SUCCESS:
      return {
        ...state,
        isGmailSequencesLoading: false,
        payload: action.payload
      };

    case Actions.CREATE_GMAIL_SEQUENCE_FAILURE:
      return {
        ...state,
        isGmailSequencesLoading: false,
        isGmailSequencesFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.UPDATE_GMAIL_SEQUENCE_REQUEST:
      return {
        ...state,
        isGmailSequencesLoading: true
      };

    case Actions.UPDATE_GMAIL_SEQUENCE_SUCCESS:
      return {
        ...state,
        isGmailSequencesLoading: false,
        payload: action.payload
      };

    case Actions.UPDATE_GMAIL_SEQUENCE_FAILURE:
      return {
        ...state,
        isGmailSequencesLoading: false,
        isGmailSequencesFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.GET_GMAIL_SEQUENCE_REQUEST:
      return {
        ...state,
        isGmailSequencesLoading: true
      };

    case Actions.GET_GMAIL_SEQUENCE_SUCCESS:
      return {
        ...state,
        isGmailSequencesLoading: false,
        payload: action.payload
      };

    case Actions.GET_GMAIL_SEQUENCE_FAILURE:
      return {
        ...state,
        isGmailSequencesLoading: false,
        isGmailSequencesFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.DELETE_GMAIL_SEQUENCE_REQUEST:
      return {
        ...state,
        isGmailSequencesLoading: true,
        payload: action.payload
      };

    case Actions.DELETE_GMAIL_SEQUENCE_SUCCESS:
      return {
        ...state,
        isGmailSequencesLoading: false,
        payload: action.payload
      };

    case Actions.DELETE_GMAIL_SEQUENCE_FAILURE:
      return {
        ...state,
        isGmailSequencesLoading: false,
        isGmailSequencesFailure: true,
        errorMessage: action.meta.errorMessage
      };

    default:
      return state;
  }
}
