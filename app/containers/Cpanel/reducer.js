// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type CpanelType from "../../types/cpanelType";

export type State = {
  isLoading: boolean,
  isFailure: boolean,
  cpanels: Array<CpanelType>,
  errorMessage: string
};

export const initialState: State = {
  isLoading: false,
  isFailure: false,
  cpanels: [],
  errorMessage: ''
};

export default function(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case Actions.GET_CPANELS_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.GET_CPANELS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cpanels: action.payload
      };

    case Actions.GET_CPANELS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.CREATE_CPANEL_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.CREATE_CPANEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cpanels: action.payload
      };

    case Actions.CREATE_CPANEL_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.UPDATE_CPANEL_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.UPDATE_CPANEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cpanels: action.payload
      };

    case Actions.UPDATE_CPANEL_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFailure: true,
        errorMessage: action.meta.errorMessage
      };

    case Actions.DELETE_CPANEL_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case Actions.DELETE_CPANEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cpanels: action.payload
      };

    case Actions.DELETE_CPANEL_FAILURE:
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
