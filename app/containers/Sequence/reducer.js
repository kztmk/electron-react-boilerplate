// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type { SequenceType } from '../../types/sequence';
import type AliasMailType from '../../types/aliasMailInfo';

export type State = {
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  sequences: Array<SequenceType>
};

export const initialState: State = {
  isLoading: false,
  isFailure: false,
  errorMessage: '',
  sequences: []
};

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.CREATE_SEQUENCE_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.CREATE_SEQUENCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        sequences: action.payload
      };

    case Actions.CREATE_SEQUENCE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.UPDATE_SEQUENCE_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.UPDATE_SEQUENCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        sequences: action.payload
      };

    case Actions.UPDATE_SEQUENCE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.GET_SEQUENCE_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.GET_SEQUENCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        sequences: action.payload
      };

    case Actions.GET_SEQUENCE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.DELETE_SEQUENCE_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.DELETE_SEQUENCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        sequences: action.payload
      };

    case Actions.DELETE_SEQUENCE_FAILURE:
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
