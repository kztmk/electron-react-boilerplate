// @flow
import type { AuthType } from "../../types/auth";

import {
  SET_AUTH_INFO,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  CLEAR_FIELDS
} from "./actionTypes";
import type {
  SetAuthInfo,
  ResetPasswordRequest,
  ResetPasswordSuccess,
  ResetPasswordFailure,
  ClearFields
} from "./actionTypes";

export function setAuthInfo(payload: AuthType): SetAuthInfo {
  return {
    type: SET_AUTH_INFO,
    payload
  };
}
export function resetPasswordRequest(): ResetPasswordRequest {
  return {
    type: RESET_PASSWORD_REQUEST
  };
}
export function resetPasswordSuccess(): ResetPasswordSuccess {
  return {
    type: RESET_PASSWORD_SUCCESS
  };
}
export function resetPasswordFailure(payload: AuthType): ResetPasswordFailure {
  return {
    type: RESET_PASSWORD_FAILURE,
    payload
  };
}
export function clearFields(): ClearFields {
  return {
    type: CLEAR_FIELDS
  };
}
