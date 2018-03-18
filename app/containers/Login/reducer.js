// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type { AuthType } from '../../types/auth';

export type State = AuthType;

export const initialState: AuthType = {
  userId: '',
  mailAddress: '',
  password: '',
  isLoginFailure: false,
  isLoadingIcon: false,
  errorMessage: ''
};

// eslint-disable-next-line space-before-function-paren
export default function(state: AuthType = initialState, action: Action): AuthType {
  switch (action.type) {
    case Actions.UPDATE_AUTH_INFO:
      return {
        ...state,
        mailAddress: action.payload.mailAddress,
        password: action.payload.password
      };
    case Actions.SET_AUTH_INFO:
      return {
        ...state,
        mailAddress: action.payload.mailAddress,
        password: action.payload.password
      };
    case Actions.LOGIN_REQUEST:
      return {
        ...state,
        isLoadingIcon: true,
        errorMessage: ''
      };
    case Actions.LOGIN_SUCCESS:
      return {
        ...state,
        userId: action.payload.userId,
        isLoginFailure: false
      };
    case Actions.LOGIN_DONE:
      return {
        ...state,
        isLoadingIcon: false
      };
    case Actions.LOGIN_FAILURE:
      return {
        ...state,
        isLoginFailure: true,
        isLoadingIcon: false,
        errorMessage: action.payload.errorMessage
      };

    case Actions.LOGOUT_REQUEST:
      return {
        ...state,
        isLoadingIcon: true
      };

    case Actions.LOGOUT_SUCCESS:
      return {
        ...initialState
      };

    case Actions.LOGOUT_FAILURE:
      return {
        ...state,
        isLoadingIcon: false,
        errorMessage: action.payload.errorMessage
      };

    case Actions.CLEAR_AUTH_INFO:
      return {
        ...initialState
      };

    default:
      return state;
  }
}
