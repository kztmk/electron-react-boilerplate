// @flow
import CpanelType from '../../types/cpanelType';

import {
  GET_CPANELS_REQUEST,
  GET_CPANELS_SUCCESS,
  GET_CPANELS_FAILURE,
  CREATE_CPANEL_REQUEST,
  CREATE_CPANEL_SUCCESS,
  CREATE_CPANEL_FAILURE,
  UPDATE_CPANEL_REQUEST,
  UPDATE_CPANEL_SUCCESS,
  UPDATE_CPANEL_FAILURE,
  DELETE_CPANEL_REQUEST,
  DELETE_CPANEL_SUCCESS,
  DELETE_CPANEL_FAILURE
} from './actionTypes';
import type {
  GetCpanelsRequest,
  GetCpanelsSuccess,
  GetCpanelsFailure,
  CreateCpanelRequest,
  CreateCpanelSuccess,
  CreateCpanelFailure,
  UpdateCpanelRequest,
  UpdateCpanelSuccess,
  UpdateCpanelFailure,
  DeleteCpanelRequest,
  DeleteCpanelSuccess,
  DeleteCpanelFailure
} from './actionTypes';

export function getCpanelsRequest(): GetCpanelsRequest {
  return {
    type: GET_CPANELS_REQUEST
  };
}
export function getCpanelsSuccess(
  payload: Array<CpanelType>
): GetCpanelsSuccess {
  return {
    type: GET_CPANELS_SUCCESS,
    payload
  };
}
export function getCpanelsFailure(meta: {
  errorMessage: string
}): GetCpanelsFailure {
  return {
    type: GET_CPANELS_FAILURE,
    meta
  };
}
export function createCpanelRequest(payload: CpanelType): CreateCpanelRequest {
  return {
    type: CREATE_CPANEL_REQUEST,
    payload
  };
}
export function createCpanelSuccess(
  payload: Array<CpanelType>
): CreateCpanelSuccess {
  return {
    type: CREATE_CPANEL_SUCCESS,
    payload
  };
}
export function createCpanelFailure(meta: {
  errorMessage: string
}): CreateCpanelFailure {
  return {
    type: CREATE_CPANEL_FAILURE,
    meta
  };
}
export function updateCpanelRequest(payload: CpanelType): UpdateCpanelRequest {
  return {
    type: UPDATE_CPANEL_REQUEST,
    payload
  };
}
export function updateCpanelSuccess(
  payload: Array<CpanelType>
): UpdateCpanelSuccess {
  return {
    type: UPDATE_CPANEL_SUCCESS,
    payload
  };
}
export function updateCpanelFailure(meta: {
  errorMessage: string
}): UpdateCpanelFailure {
  return {
    type: UPDATE_CPANEL_FAILURE,
    meta
  };
}
export function deleteCpanelRequest(payload: CpanelType): DeleteCpanelRequest {
  return {
    type: DELETE_CPANEL_REQUEST,
    payload
  };
}
export function deleteCpanelSuccess(
  payload: Array<CpanelType>
): DeleteCpanelSuccess {
  return {
    type: DELETE_CPANEL_SUCCESS,
    payload
  };
}
export function deleteCpanelFailure(meta: {
  errorMessage: string
}): DeleteCpanelFailure {
  return {
    type: DELETE_CPANEL_FAILURE,
    meta
  };
}
