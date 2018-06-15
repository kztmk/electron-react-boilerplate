// @flow
import PersonalInfoType from '../../types/personalInfo';

export const GET_PERSONAL_INFO_REQUEST: 'PersonalInfo/GET_PERSONAL_INFO_REQUEST' =
  'PersonalInfo/GET_PERSONAL_INFO_REQUEST';
export const GET_PERSONAL_INFO_SUCCESS: 'PersonalInfo/GET_PERSONAL_INFO_SUCCESS' =
  'PersonalInfo/GET_PERSONAL_INFO_SUCCESS';
export const GET_PERSONAL_INFO_FAILURE: 'PersonalInfo/GET_PERSONAL_INFO_FAILURE' =
  'PersonalInfo/GET_PERSONAL_INFO_FAILURE';
export const GET_RANDOM_PERSONAL_INFO_REQUEST: 'PersonalInfo/GET_RANDOM_PERSONAL_INFO_REQUEST' =
  'PersonalInfo/GET_RANDOM_PERSONAL_INFO_REQUEST';
export const GET_RANDOM_PERSONAL_INFO_SUCCESS: 'PersonalInfo/GET_RANDOM_PERSONAL_INFO_SUCCESS' =
  'PersonalInfo/GET_RANDOM_PERSONAL_INFO_SUCCESS';
export const GET_RANDOM_PERSONAL_INFO_FAILURE: 'PersonalInfo/GET_RANDOM_PERSONAL_INFO_FAILURE' =
  'PersonalInfo/GET_RANDOM_PERSONAL_INFO_FAILURE';
export const SAVE_PERSONAL_INFO_REQUEST: 'PersonalInfo/SAVE_PERSONAL_INFO_REQUEST' =
  'PersonalInfo/SAVE_PERSONAL_INFO_REQUEST';
export const SAVE_PERSONAL_INFO_SUCCESS: 'PersonalInfo/SAVE_PERSONAL_INFO_SUCCESS' =
  'PersonalInfo/SAVE_PERSONAL_INFO_SUCCESS';
export const SAVE_PERSONAL_INFO_FAILURE: 'PersonalInfo/SAVE_PERSONAL_INFO_FAILURE' =
  'PersonalInfo/SAVE_PERSONAL_INFO_FAILURE';

export const Actions = {
  GET_PERSONAL_INFO_REQUEST,
  GET_PERSONAL_INFO_SUCCESS,
  GET_PERSONAL_INFO_FAILURE,
  GET_RANDOM_PERSONAL_INFO_REQUEST,
  GET_RANDOM_PERSONAL_INFO_SUCCESS,
  GET_RANDOM_PERSONAL_INFO_FAILURE,
  SAVE_PERSONAL_INFO_REQUEST,
  SAVE_PERSONAL_INFO_SUCCESS,
  SAVE_PERSONAL_INFO_FAILURE
};

export type GetPersonalInfoRequest = {
  type: typeof GET_PERSONAL_INFO_REQUEST
};
export type GetPersonalInfoSuccess = {
  type: typeof GET_PERSONAL_INFO_SUCCESS,
  payload: PersonalInfoType
};
export type GetPersonalInfoFailure = {
  type: typeof GET_PERSONAL_INFO_FAILURE,
  meta: { errorMessage: string }
};

export type GetRandomPersonalInfoRequest = {
  type: typeof GET_RANDOM_PERSONAL_INFO_REQUEST
};
export type GetRandomPersonalInfoSuccess = {
  type: typeof GET_RANDOM_PERSONAL_INFO_SUCCESS,
  payload: PersonalInfoType
};
export type GetRandomPersonalInfoFailure = {
  type: typeof GET_RANDOM_PERSONAL_INFO_FAILURE,
  meta: { errorMessage: string }
};

export type SavePersonalInfoRequest = {
  type: typeof SAVE_PERSONAL_INFO_REQUEST,
  payload: PersonalInfoType
};
export type SavePersonalInfoSuccess = {
  type: typeof SAVE_PERSONAL_INFO_SUCCESS,
  payload: PersonalInfoType
};
export type SavePersonalInfoFailure = {
  type: typeof SAVE_PERSONAL_INFO_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | GetPersonalInfoRequest
  | GetPersonalInfoSuccess
  | GetPersonalInfoFailure
  | GetRandomPersonalInfoRequest
  | GetRandomPersonalInfoSuccess
  | GetRandomPersonalInfoFailure
  | SavePersonalInfoRequest
  | SavePersonalInfoSuccess
  | SavePersonalInfoFailure;
