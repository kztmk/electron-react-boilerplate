// @flow
import type { UserAccountType } from '../../types/userAccount';

export const SET_PROFILE: 'Profile/SET_PROFILE' = 'Profile/SET_PROFILE';
export const UPDATE_PROFILE_INFO: 'Profile/UPDATE_PROFILE_INFO' =
  'Profile/UPDATE_PROFILE_INFO';
export const CREATE_PROFILE_REQUEST: 'Profile/CREATE_PROFILE_REQUEST' =
  'Profile/CREATE_PROFILE_REQUEST';
export const CREATE_PROFILE_SUCCESS: 'Profile/CREATE_PROFILE_SUCCESS' =
  'Profile/CREATE_PROFILE_SUCCESS';
export const CREATE_PROFILE_FAILURE: 'Profile/CREATE_PROFILE_FAILURE' =
  'Profile/CREATE_PROFILE_FAILURE';
export const GET_PROFILE_REQUEST: 'Profile/GET_PROFILE_REQUEST' =
  'Profile/GET_PROFILE_REQUEST';
export const GET_PROFILE_SUCCESS: 'Profile/GET_PROFILE_SUCCESS' =
  'Profile/GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAILURE: 'Profile/GET_PROFILE_FAILURE' =
  'Profile/GET_PROFILE_FAILURE';
export const UPDATE_PROFILE_REQUEST: 'Profile/UPDATE_PROFILE_REQUEST' =
  'Profile/UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS: 'Profile/UPDATE_PROFILE_SUCCESS' =
  'Profile/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE: 'Profile/UPDATE_PROFILE_FAILURE' =
  'Profile/UPDATE_PROFILE_FAILURE';
export const DELETE_PROFILE_REQUEST: 'Profile/DELETE_PROFILE_REQUEST' =
  'Profile/DELETE_PROFILE_REQUEST';
export const DELETE_PROFILE_SUCCESS: 'Profile/DELETE_PROFILE_SUCCESS' =
  'Profile/DELETE_PROFILE_SUCCESS';
export const DELETE_PROFILE_FAILURE: 'Profile/DELETE_PROFILE_FAILURE' =
  'Profile/DELETE_PROFILE_FAILURE';

export const Actions = {
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
};

export type SetProfile = {
  type: typeof SET_PROFILE,
  payload: UserAccountType
};
export type UpdateProfileInfo = {
  type: typeof UPDATE_PROFILE_INFO,
  payload: UserAccountType
};
export type CreateProfileRequest = {
  type: typeof CREATE_PROFILE_REQUEST
};
export type CreateProfileSuccess = {
  type: typeof CREATE_PROFILE_SUCCESS,
  payload: UserAccountType
};
export type CreateProfileFailure = {
  type: typeof CREATE_PROFILE_FAILURE,
  payload: UserAccountType
};
export type GetProfileRequest = {
  type: typeof GET_PROFILE_REQUEST
};
export type GetProfileSuccess = {
  type: typeof GET_PROFILE_SUCCESS,
  payload: UserAccountType
};
export type GetProfileFailure = {
  type: typeof GET_PROFILE_FAILURE,
  payload: UserAccountType
};
export type UpdateProfileRequest = {
  type: typeof UPDATE_PROFILE_REQUEST
};
export type UpdateProfileSuccess = {
  type: typeof UPDATE_PROFILE_SUCCESS
};
export type UpdateProfileFailure = {
  type: typeof UPDATE_PROFILE_FAILURE,
  payload: UserAccountType
};
export type DeleteProfileRequest = {
  type: typeof DELETE_PROFILE_REQUEST
};
export type DeleteProfileSuccess = {
  type: typeof DELETE_PROFILE_SUCCESS
};
export type DeleteProfileFailure = {
  type: typeof DELETE_PROFILE_FAILURE,
  payload: UserAccountType
};

export type Action =
  | SetProfile
  | UpdateProfileInfo
  | CreateProfileRequest
  | CreateProfileSuccess
  | CreateProfileFailure
  | GetProfileRequest
  | GetProfileSuccess
  | GetProfileFailure
  | UpdateProfileRequest
  | UpdateProfileSuccess
  | UpdateProfileFailure
  | DeleteProfileRequest
  | DeleteProfileSuccess
  | DeleteProfileFailure;
