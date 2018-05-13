// @flow
import type { UserAccountType } from "../../types/userAccount";

import {
  SET_PROFILE,
  UPDATE_PROFILE_INFO,
  CREATE_PROFILE_REQUEST,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  DELETE_PROFILE_REQUEST,
  DELETE_PROFILE_SUCCESS,
  DELETE_PROFILE_FAILURE
} from "./actionTypes";
import type {
  SetProfile,
  UpdateProfileInfo,
  CreateProfileRequest,
  CreateProfileSuccess,
  CreateProfileFailure,
  GetProfileRequest,
  GetProfileSuccess,
  GetProfileFailure,
  UpdateProfileRequest,
  UpdateProfileSuccess,
  UpdateProfileFailure,
  DeleteProfileRequest,
  DeleteProfileSuccess,
  DeleteProfileFailure
} from "./actionTypes";

export function setProfile(payload: UserAccountType): SetProfile {
  return {
    type: SET_PROFILE,
    payload
  };
}
export function updateProfileInfo(payload: UserAccountType): UpdateProfileInfo {
  return {
    type: UPDATE_PROFILE_INFO,
    payload
  };
}
export function createProfileRequest(): CreateProfileRequest {
  return {
    type: CREATE_PROFILE_REQUEST
  };
}
export function createProfileSuccess(
  payload: UserAccountType
): CreateProfileSuccess {
  return {
    type: CREATE_PROFILE_SUCCESS,
    payload
  };
}
export function createProfileFailure(
  payload: UserAccountType
): CreateProfileFailure {
  return {
    type: CREATE_PROFILE_FAILURE,
    payload
  };
}
export function getProfileRequest(): GetProfileRequest {
  return {
    type: GET_PROFILE_REQUEST
  };
}
export function getProfileSuccess(payload: UserAccountType): GetProfileSuccess {
  return {
    type: GET_PROFILE_SUCCESS,
    payload
  };
}
export function getProfileFailure(payload: UserAccountType): GetProfileFailure {
  return {
    type: GET_PROFILE_FAILURE,
    payload
  };
}
export function updateProfileRequest(): UpdateProfileRequest {
  return {
    type: UPDATE_PROFILE_REQUEST
  };
}
export function updateProfileSuccess(): UpdateProfileSuccess {
  return {
    type: UPDATE_PROFILE_SUCCESS
  };
}
export function updateProfileFailure(
  payload: UserAccountType
): UpdateProfileFailure {
  return {
    type: UPDATE_PROFILE_FAILURE,
    payload
  };
}
export function deleteProfileRequest(): DeleteProfileRequest {
  return {
    type: DELETE_PROFILE_REQUEST
  };
}
export function deleteProfileSuccess(): DeleteProfileSuccess {
  return {
    type: DELETE_PROFILE_SUCCESS
  };
}
export function deleteProfileFailure(
  payload: UserAccountType
): DeleteProfileFailure {
  return {
    type: DELETE_PROFILE_FAILURE,
    payload
  };
}
