// @flow
import type { UserSettingType } from '../../types/userSettings';

import {
  CREATE_SETTINGS_REQUEST,
  CREATE_SETTINGS_SUCCESS,
  CREATE_SETTINGS_FAILURE,
  GET_SETTINGS_REQUEST,
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_FAILURE,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_FAILURE,
  DELETE_SETTINGS_REQUEST,
  DELETE_SETTINGS_SUCCESS,
  DELETE_SETTINGS_FAILURE
} from './actionTypes';
import type {
  CreateSettingsRequest,
  CreateSettingsSuccess,
  CreateSettingsFailure,
  GetSettingsRequest,
  GetSettingsSuccess,
  GetSettingsFailure,
  UpdateSettingsRequest,
  UpdateSettingsSuccess,
  UpdateSettingsFailure,
  DeleteSettingsRequest,
  DeleteSettingsSuccess,
  DeleteSettingsFailure
} from './actionTypes';

export function createSettingsRequest(payload: Array<UserSettingType>): CreateSettingsRequest {
  return {
    type: CREATE_SETTINGS_REQUEST,
    payload
  };
}
export function createSettingsSuccess(payload: Array<UserSettingType>): CreateSettingsSuccess {
  return {
    type: CREATE_SETTINGS_SUCCESS,
    payload
  };
}
export function createSettingsFailure(meta: { errorMessage: string }): CreateSettingsFailure {
  return {
    type: CREATE_SETTINGS_FAILURE,
    meta
  };
}
export function getSettingsRequest(payload: Array<UserSettingType>): GetSettingsRequest {
  return {
    type: GET_SETTINGS_REQUEST,
    payload
  };
}
export function getSettingsSuccess(payload: Array<UserSettingType>): GetSettingsSuccess {
  return {
    type: GET_SETTINGS_SUCCESS,
    payload
  };
}
export function getSettingsFailure(meta: { errorMessage: string }): GetSettingsFailure {
  return {
    type: GET_SETTINGS_FAILURE,
    meta
  };
}
export function updateSettingsRequest(payload: Array<UserSettingType>): UpdateSettingsRequest {
  return {
    type: UPDATE_SETTINGS_REQUEST,
    payload
  };
}
export function updateSettingsSuccess(payload: Array<UserSettingType>): UpdateSettingsSuccess {
  return {
    type: UPDATE_SETTINGS_SUCCESS,
    payload
  };
}
export function updateSettingsFailure(meta: { errorMessage: string }): UpdateSettingsFailure {
  return {
    type: UPDATE_SETTINGS_FAILURE,
    meta
  };
}
export function deleteSettingsRequest(payload: Array<UserSettingType>): DeleteSettingsRequest {
  return {
    type: DELETE_SETTINGS_REQUEST,
    payload
  };
}
export function deleteSettingsSuccess(payload: Array<UserSettingType>): DeleteSettingsSuccess {
  return {
    type: DELETE_SETTINGS_SUCCESS,
    payload
  };
}
export function deleteSettingsFailure(meta: { errorMessage: string }): DeleteSettingsFailure {
  return {
    type: DELETE_SETTINGS_FAILURE,
    meta
  };
}
