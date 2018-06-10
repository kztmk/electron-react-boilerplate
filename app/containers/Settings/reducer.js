// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type { UserSettingType } from '../../types/userSettings';

export type State = {
  isLoading: boolean,
  settings: Array<UserSettingType>,
  isFailure: boolean,
  errorMessage: string
};

export const initialState: State = {
  isLoading: false,
  settings: [],
  isFailure: false,
  errorMessage: ''
};

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case Actions.CREATE_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.CREATE_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        settings: action.payload
      };

    case Actions.CREATE_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.GET_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.GET_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        settings: action.payload
      };

    case Actions.GET_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.UPDATE_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        settings: action.payload
      };

    case Actions.UPDATE_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.DELETE_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.DELETE_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        settings: action.payload
      };

    case Actions.DELETE_SETTINGS_FAILURE:
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
