// @flow
import type { Action } from './actionTypes';
import { Actions } from './actionTypes';
import type { UserAccountType } from '../../types/userAccount';

export type State = UserAccountType;

export const initialState: State = {
  key: '',
  userId: '',
  mailAddress: '',
  password: '',
  expireDate: null,
  paymentMethod: '',
  registeredMailAddress: '',
  isLoadingIcon: false,
  isFailure: false,
  errorMessage: ''
};

export default function(state: State = initialState, action: Action): UserAccountType {
  switch (action.type) {
    case Actions.SET_PROFILE:
      return {
        ...state,
        userId: action.payload.userId,
        mailAddress: action.payload.mailAddress,
        password: action.payload.password,
        expireDate: action.payload.expireDate,
        paymentMethod: action.payload.paymentMethod,
        registeredMailAddress: action.payload.registeredMailAddress
      };
    case Actions.CREATE_PROFILE_REQUEST:
      return {
        ...state,
        isLoadingIcon: true
      };
    case Actions.CREATE_PROFILE_SUCCESS:
      return {
        ...state,
        key: action.payload.key,
        isLoadingIcon: false
      };
    case Actions.CREATE_PROFILE_FAILURE:
      return {
        ...state,
        isLoadingIcon: false,
        isFailure: true,
        errorMessage: action.payload.errorMessage
      };
    case Actions.GET_PROFILE_REQUEST:
      return {
        ...state,
        isLoadingIcon: true
      };
    case Actions.GET_PROFILE_SUCCESS:
      return {
        ...state,
        key: action.payload.key,
        userId: action.payload.userId,
        mailAddress: action.payload.mailAddress,
        password: action.payload.password,
        expireDate: action.payload.expireDate,
        registeredMailAddress: action.payload.registeredMailAddress,
        isLoadingIcon: false
      };
    case Actions.GET_PROFILE_FAILURE:
      return {
        ...state,
        isLoadingIcon: false,
        isFailure: true,
        errorMessage: action.payload.errorMessage
      };
    case Actions.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        isLoadingIcon: true
      };
    case Actions.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isLoadingIcon: false
      };
    case Actions.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isLoadingIcon: false,
        isFailure: true,
        errorMessage: action.payload.errorMessage
      };
    case Actions.DELETE_PROFILE_REQUEST:
      return {
        ...state,
        isLoadingIcon: true
      };
    case Actions.DELETE_PROFILE_SUCCESS:
      return {
        ...state,
        isLoadingIcon: false
      };
    case Actions.DELETE_PROFILE_FAILURE:
      return {
        ...state,
        isLoadingIcon: false,
        isFailure: true,
        errorMessage: action.payload.errorMessage
      };
    default:
      return state;
  }
}
