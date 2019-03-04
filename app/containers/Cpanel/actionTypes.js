// @flow
import CpanelType from '../../types/cpanelType';

export const GET_CPANELS_REQUEST: 'Cpanel/GET_CPANELS_REQUEST' =
  'Cpanel/GET_CPANELS_REQUEST';
export const GET_CPANELS_SUCCESS: 'Cpanel/GET_CPANELS_SUCCESS' =
  'Cpanel/GET_CPANELS_SUCCESS';
export const GET_CPANELS_FAILURE: 'Cpanel/GET_CPANELS_FAILURE' =
  'Cpanel/GET_CPANELS_FAILURE';
export const CREATE_CPANEL_REQUEST: 'Cpanel/CREATE_CPANEL_REQUEST' =
  'Cpanel/CREATE_CPANEL_REQUEST';
export const CREATE_CPANEL_SUCCESS: 'Cpanel/CREATE_CPANEL_SUCCESS' =
  'Cpanel/CREATE_CPANEL_SUCCESS';
export const CREATE_CPANEL_FAILURE: 'Cpanel/CREATE_CPANEL_FAILURE' =
  'Cpanel/CREATE_CPANEL_FAILURE';
export const UPDATE_CPANEL_REQUEST: 'Cpanel/UPDATE_CPANEL_REQUEST' =
  'Cpanel/UPDATE_CPANEL_REQUEST';
export const UPDATE_CPANEL_SUCCESS: 'Cpanel/UPDATE_CPANEL_SUCCESS' =
  'Cpanel/UPDATE_CPANEL_SUCCESS';
export const UPDATE_CPANEL_FAILURE: 'Cpanel/UPDATE_CPANEL_FAILURE' =
  'Cpanel/UPDATE_CPANEL_FAILURE';
export const DELETE_CPANEL_REQUEST: 'Cpanel/DELETE_CPANEL_REQUEST' =
  'Cpanel/DELETE_CPANEL_REQUEST';
export const DELETE_CPANEL_SUCCESS: 'Cpanel/DELETE_CPANEL_SUCCESS' =
  'Cpanel/DELETE_CPANEL_SUCCESS';
export const DELETE_CPANEL_FAILURE: 'Cpanel/DELETE_CPANEL_FAILURE' =
  'Cpanel/DELETE_CPANEL_FAILURE';

export const Actions = {
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
};

export type GetCpanelsRequest = {
  type: typeof GET_CPANELS_REQUEST
};
export type GetCpanelsSuccess = {
  type: typeof GET_CPANELS_SUCCESS,
  payload: Array<CpanelType>
};
export type GetCpanelsFailure = {
  type: typeof GET_CPANELS_FAILURE,
  meta: { errorMessage: string }
};
export type CreateCpanelRequest = {
  type: typeof CREATE_CPANEL_REQUEST,
  payload: CpanelType
};
export type CreateCpanelSuccess = {
  type: typeof CREATE_CPANEL_SUCCESS,
  payload: Array<CpanelType>
};
export type CreateCpanelFailure = {
  type: typeof CREATE_CPANEL_FAILURE,
  meta: { errorMessage: string }
};
export type UpdateCpanelRequest = {
  type: typeof UPDATE_CPANEL_REQUEST,
  payload: CpanelType
};
export type UpdateCpanelSuccess = {
  type: typeof UPDATE_CPANEL_SUCCESS,
  payload: Array<CpanelType>
};
export type UpdateCpanelFailure = {
  type: typeof UPDATE_CPANEL_FAILURE,
  meta: { errorMessage: string }
};
export type DeleteCpanelRequest = {
  type: typeof DELETE_CPANEL_REQUEST,
  payload: CpanelType
};
export type DeleteCpanelSuccess = {
  type: typeof DELETE_CPANEL_SUCCESS,
  payload: Array<CpanelType>
};
export type DeleteCpanelFailure = {
  type: typeof DELETE_CPANEL_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | GetCpanelsRequest
  | GetCpanelsSuccess
  | GetCpanelsFailure
  | CreateCpanelRequest
  | CreateCpanelSuccess
  | CreateCpanelFailure
  | UpdateCpanelRequest
  | UpdateCpanelSuccess
  | UpdateCpanelFailure
  | DeleteCpanelRequest
  | DeleteCpanelSuccess
  | DeleteCpanelFailure;
