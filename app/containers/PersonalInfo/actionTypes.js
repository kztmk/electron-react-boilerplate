// @flow
import PersonalInfoType from '../../types/personalInfo';

export const GET_PERSONAL_INFO_REQUEST: 'PersonalInfo/GET_PERSONAL_INFO_REQUEST' =
  'PersonalInfo/GET_PERSONAL_INFO_REQUEST';
export const GET_PERSONAL_INFO_SUCCESS: 'PersonalInfo/GET_PERSONAL_INFO_SUCCESS' =
  'PersonalInfo/GET_PERSONAL_INFO_SUCCESS';
export const GET_PERSONAL_INFO_FAILURE: 'PersonalInfo/GET_PERSONAL_INFO_FAILURE' =
  'PersonalInfo/GET_PERSONAL_INFO_FAILURE';
export const GET_PERSONAL_INFO_FOR_BLOG_REQUEST: 'PersonalInfo/GET_PERSONAL_INFO_FOR_BLOG_REQUEST' =
  'PersonalInfo/GET_PERSONAL_INFO_FOR_BLOG_REQUEST';
export const GET_PERSONAL_INFO_FOR_BLOG_SUCCESS: 'PersonalInfo/GET_PERSONAL_INFO_FOR_BLOG_SUCCESS' =
  'PersonalInfo/GET_PERSONAL_INFO_FOR_BLOG_SUCCESS';
export const GET_PERSONAL_INFO_FOR_BLOG_FAILURE: 'PersonalInfo/GET_PERSONAL_INFO_FOR_BLOG_FAILURE' =
  'PersonalInfo/GET_PERSONAL_INFO_FOR_BLOG_FAILURE';
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
export const SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST: 'PersonalInfo/SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST' =
  'PersonalInfo/SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST';
export const SAVE_PERSONAL_INFO_FOR_BLOG_SUCCESS: 'PersonalInfo/SAVE_PERSONAL_INFO_FOR_BLOG_SUCCESS' =
  'PersonalInfo/SAVE_PERSONAL_INFO_FOR_BLOG_SUCCESS';
export const SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE: 'PersonalInfo/SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE' =
  'PersonalInfo/SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE';

export const Actions = {
  GET_PERSONAL_INFO_REQUEST,
  GET_PERSONAL_INFO_SUCCESS,
  GET_PERSONAL_INFO_FAILURE,
  GET_PERSONAL_INFO_FOR_BLOG_REQUEST,
  GET_PERSONAL_INFO_FOR_BLOG_SUCCESS,
  GET_PERSONAL_INFO_FOR_BLOG_FAILURE,
  GET_RANDOM_PERSONAL_INFO_REQUEST,
  GET_RANDOM_PERSONAL_INFO_SUCCESS,
  GET_RANDOM_PERSONAL_INFO_FAILURE,
  SAVE_PERSONAL_INFO_REQUEST,
  SAVE_PERSONAL_INFO_SUCCESS,
  SAVE_PERSONAL_INFO_FAILURE,
  SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST,
  SAVE_PERSONAL_INFO_FOR_BLOG_SUCCESS,
  SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE
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

export type GetPersonalInfoForBlogRequest = {
  type: typeof GET_PERSONAL_INFO_FOR_BLOG_REQUEST
};
export type GetPersonalInfoForBlogSuccess = {
  type: typeof GET_PERSONAL_INFO_FOR_BLOG_SUCCESS,
  payload: PersonalInfoType
};
export type GetPersonalInfoForBlogFailure = {
  type: typeof GET_PERSONAL_INFO_FOR_BLOG_FAILURE,
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

export type SavePersonalInfoForBlogRequest = {
  type: typeof SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST,
  payload: PersonalInfoType
};
export type SavePersonalInfoForBlogSuccess = {
  type: typeof SAVE_PERSONAL_INFO_FOR_BLOG_SUCCESS,
  payload: PersonalInfoType
};
export type SavePersonalInfoForBlogFailure = {
  type: typeof SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | GetPersonalInfoRequest
  | GetPersonalInfoSuccess
  | GetPersonalInfoFailure
  | GetPersonalInfoForBlogRequest
  | GetPersonalInfoForBlogSuccess
  | GetPersonalInfoForBlogFailure
  | GetRandomPersonalInfoRequest
  | GetRandomPersonalInfoSuccess
  | GetRandomPersonalInfoFailure
  | SavePersonalInfoRequest
  | SavePersonalInfoSuccess
  | SavePersonalInfoFailure
  | SavePersonalInfoForBlogRequest
  | SavePersonalInfoForBlogSuccess
  | SavePersonalInfoForBlogFailure;
