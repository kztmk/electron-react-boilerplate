// @flow
import PersonalInfoType from '../../types/personalInfo';

import {
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
  SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE,
  CLEAR_PERSONAL_INFO_REQUEST,
  CLEAR_PERSONAL_INFO_SUCCESS,
  CLEAR_PERSONAL_INFO_FAILURE
} from './actionTypes';
import type {
  GetPersonalInfoRequest,
  GetPersonalInfoSuccess,
  GetPersonalInfoFailure,
  GetPersonalInfoForBlogRequest,
  GetPersonalInfoForBlogSuccess,
  GetPersonalInfoForBlogFailure,
  GetRandomPersonalInfoRequest,
  GetRandomPersonalInfoSuccess,
  GetRandomPersonalInfoFailure,
  SavePersonalInfoRequest,
  SavePersonalInfoSuccess,
  SavePersonalInfoFailure,
  SavePersonalInfoForBlogRequest,
  SavePersonalInfoForBlogSuccess,
  SavePersonalInfoForBlogFailure,
  ClearPersonalInfoRequest,
  ClearPersonalInfoSuccess,
  ClearPersonalInfoFailure
} from './actionTypes';

export function getPersonalInfoRequest(): GetPersonalInfoRequest {
  return {
    type: GET_PERSONAL_INFO_REQUEST
  };
}
export function getPersonalInfoSuccess(payload: PersonalInfoType): GetPersonalInfoSuccess {
  return {
    type: GET_PERSONAL_INFO_SUCCESS,
    payload
  };
}
export function getPersonalInfoFailure(meta: { errorMessage: string }): GetPersonalInfoFailure {
  return {
    type: GET_PERSONAL_INFO_FAILURE,
    meta
  };
}
export function getPersonalInfoForBlogRequest(): GetPersonalInfoForBlogRequest {
  return {
    type: GET_PERSONAL_INFO_FOR_BLOG_REQUEST
  };
}
export function getPersonalInfoForBlogSuccess(
  payload: PersonalInfoType
): GetPersonalInfoForBlogSuccess {
  return {
    type: GET_PERSONAL_INFO_FOR_BLOG_SUCCESS,
    payload
  };
}
export function getPersonalInfoForBlogFailure(meta: {
  errorMessage: string
}): GetPersonalInfoForBlogFailure {
  return {
    type: GET_PERSONAL_INFO_FOR_BLOG_FAILURE,
    meta
  };
}
export function getRandomPersonalInfoRequest(): GetRandomPersonalInfoRequest {
  return {
    type: GET_RANDOM_PERSONAL_INFO_REQUEST
  };
}
export function getRandomPersonalInfoSuccess(
  payload: PersonalInfoType
): GetRandomPersonalInfoSuccess {
  return {
    type: GET_RANDOM_PERSONAL_INFO_SUCCESS,
    payload
  };
}
export function getRandomPersonalInfoFailure(meta: {
  errorMessage: string
}): GetRandomPersonalInfoFailure {
  return {
    type: GET_RANDOM_PERSONAL_INFO_FAILURE,
    meta
  };
}
export function savePersonalInfoRequest(payload: PersonalInfoType): SavePersonalInfoRequest {
  return {
    type: SAVE_PERSONAL_INFO_REQUEST,
    payload
  };
}
export function savePersonalInfoSuccess(payload: PersonalInfoType): SavePersonalInfoSuccess {
  return {
    type: SAVE_PERSONAL_INFO_SUCCESS,
    payload
  };
}
export function savePersonalInfoFailure(meta: { errorMessage: string }): SavePersonalInfoFailure {
  return {
    type: SAVE_PERSONAL_INFO_FAILURE,
    meta
  };
}
export function savePersonalInfoForBlogRequest(
  payload: PersonalInfoType
): SavePersonalInfoForBlogRequest {
  return {
    type: SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST,
    payload
  };
}
export function savePersonalInfoForBlogSuccess(
  payload: PersonalInfoType
): SavePersonalInfoForBlogSuccess {
  return {
    type: SAVE_PERSONAL_INFO_FOR_BLOG_SUCCESS,
    payload
  };
}
export function savePersonalInfoForBlogFailure(meta: {
  errorMessage: string
}): SavePersonalInfoForBlogFailure {
  return {
    type: SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE,
    meta
  };
}
export function clearPersonalInfoRequest(): ClearPersonalInfoRequest {
  return {
    type: CLEAR_PERSONAL_INFO_REQUEST
  };
}
export function clearPersonalInfoSuccess(payload: PersonalInfoType): ClearPersonalInfoSuccess {
  return {
    type: CLEAR_PERSONAL_INFO_SUCCESS,
    payload
  };
}
export function clearPersonalInfoFailure(meta: { errorMessage: string }): ClearPersonalInfoFailure {
  return {
    type: CLEAR_PERSONAL_INFO_FAILURE,
    meta
  };
}
