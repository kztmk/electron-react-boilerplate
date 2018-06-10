// @flow
import type { UserSettingType } from '../../types/userSettings';

export const CREATE_SETTINGS_REQUEST: 'Settings/CREATE_SETTINGS_REQUEST' =
  'Settings/CREATE_SETTINGS_REQUEST';
export const CREATE_SETTINGS_SUCCESS: 'Settings/CREATE_SETTINGS_SUCCESS' =
  'Settings/CREATE_SETTINGS_SUCCESS';
export const CREATE_SETTINGS_FAILURE: 'Settings/CREATE_SETTINGS_FAILURE' =
  'Settings/CREATE_SETTINGS_FAILURE';
export const GET_SETTINGS_REQUEST: 'Settings/GET_SETTINGS_REQUEST' =
  'Settings/GET_SETTINGS_REQUEST';
export const GET_SETTINGS_SUCCESS: 'Settings/GET_SETTINGS_SUCCESS' =
  'Settings/GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAILURE: 'Settings/GET_SETTINGS_FAILURE' =
  'Settings/GET_SETTINGS_FAILURE';
export const UPDATE_SETTINGS_REQUEST: 'Settings/UPDATE_SETTINGS_REQUEST' =
  'Settings/UPDATE_SETTINGS_REQUEST';
export const UPDATE_SETTINGS_SUCCESS: 'Settings/UPDATE_SETTINGS_SUCCESS' =
  'Settings/UPDATE_SETTINGS_SUCCESS';
export const UPDATE_SETTINGS_FAILURE: 'Settings/UPDATE_SETTINGS_FAILURE' =
  'Settings/UPDATE_SETTINGS_FAILURE';
export const DELETE_SETTINGS_REQUEST: 'Settings/DELETE_SETTINGS_REQUEST' =
  'Settings/DELETE_SETTINGS_REQUEST';
export const DELETE_SETTINGS_SUCCESS: 'Settings/DELETE_SETTINGS_SUCCESS' =
  'Settings/DELETE_SETTINGS_SUCCESS';
export const DELETE_SETTINGS_FAILURE: 'Settings/DELETE_SETTINGS_FAILURE' =
  'Settings/DELETE_SETTINGS_FAILURE';

export const Actions = {
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
};

export type CreateSettingsRequest = {
  type: typeof CREATE_SETTINGS_REQUEST,
  payload: Array<UserSettingType>
};
export type CreateSettingsSuccess = {
  type: typeof CREATE_SETTINGS_SUCCESS,
  payload: Array<UserSettingType>
};
export type CreateSettingsFailure = {
  type: typeof CREATE_SETTINGS_FAILURE,
  meta: { errorMessage: string }
};
export type GetSettingsRequest = {
  type: typeof GET_SETTINGS_REQUEST,
  payload: Array<UserSettingType>
};
export type GetSettingsSuccess = {
  type: typeof GET_SETTINGS_SUCCESS,
  payload: Array<UserSettingType>
};
export type GetSettingsFailure = {
  type: typeof GET_SETTINGS_FAILURE,
  meta: { errorMessage: string }
};
export type UpdateSettingsRequest = {
  type: typeof UPDATE_SETTINGS_REQUEST,
  payload: Array<UserSettingType>
};
export type UpdateSettingsSuccess = {
  type: typeof UPDATE_SETTINGS_SUCCESS,
  payload: Array<UserSettingType>
};
export type UpdateSettingsFailure = {
  type: typeof UPDATE_SETTINGS_FAILURE,
  meta: { errorMessage: string }
};
export type DeleteSettingsRequest = {
  type: typeof DELETE_SETTINGS_REQUEST,
  payload: Array<UserSettingType>
};
export type DeleteSettingsSuccess = {
  type: typeof DELETE_SETTINGS_SUCCESS,
  payload: Array<UserSettingType>
};
export type DeleteSettingsFailure = {
  type: typeof DELETE_SETTINGS_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | CreateSettingsRequest
  | CreateSettingsSuccess
  | CreateSettingsFailure
  | GetSettingsRequest
  | GetSettingsSuccess
  | GetSettingsFailure
  | UpdateSettingsRequest
  | UpdateSettingsSuccess
  | UpdateSettingsFailure
  | DeleteSettingsRequest
  | DeleteSettingsSuccess
  | DeleteSettingsFailure;
