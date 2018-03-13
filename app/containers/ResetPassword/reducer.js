// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type { AuthType } from '../../types/auth';

export const initialState: AuthType = {
  userId: '',
  mailAddress: '',
  password: '',
  isLoginFailure: false,
  isLoadingIcon: false,
  errorMessage: ''
};

export type State = AuthType;

export default function(state: AuthType = initialState, action: Action): AuthType {
  switch (action.type) {
    case Actions.SET_AUTH_INFO:
      return {
        ...state,
        mailAddress: action.payload.mailAddress
      };
    case Actions.RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isLoadingIcon: true
      };
    case Actions.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoadingIcon: false
      };
    case Actions.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isLoadingIcon: false,
        isLoginFailure: true,
        errorMessage: action.payload.errorMessage
      };
    case Actions.CLEAR_FIELDS:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
