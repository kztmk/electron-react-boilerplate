// @flow
import type { BlogAccountType } from '../../types/blogAccount';

export const GET_BLOGS_REQUEST: 'BlogList/GET_BLOGS_REQUEST' =
  'BlogList/GET_BLOGS_REQUEST';
export const GET_BLOGS_SUCCESS: 'BlogList/GET_BLOGS_SUCCESS' =
  'BlogList/GET_BLOGS_SUCCESS';
export const GET_BLOGS_FAILURE: 'BlogList/GET_BLOGS_FAILURE' =
  'BlogList/GET_BLOGS_FAILURE';
export const CREATE_BLOG_REQUEST: 'BlogList/CREATE_BLOG_REQUEST' =
  'BlogList/CREATE_BLOG_REQUEST';
export const CREATE_BLOG_SUCCESS: 'BlogList/CREATE_BLOG_SUCCESS' =
  'BlogList/CREATE_BLOG_SUCCESS';
export const CREATE_BLOG_FAILURE: 'BlogList/CREATE_BLOG_FAILURE' =
  'BlogList/CREATE_BLOG_FAILURE';
export const UPDATE_BLOG_REQUEST: 'BlogList/UPDATE_BLOG_REQUEST' =
  'BlogList/UPDATE_BLOG_REQUEST';
export const UPDATE_BLOG_SUCCESS: 'BlogList/UPDATE_BLOG_SUCCESS' =
  'BlogList/UPDATE_BLOG_SUCCESS';
export const UPDATE_BLOG_FAILURE: 'BlogList/UPDATE_BLOG_FAILURE' =
  'BlogList/UPDATE_BLOG_FAILURE';
export const DELETE_BLOG_REQUEST: 'BlogList/DELETE_BLOG_REQUEST' =
  'BlogList/DELETE_BLOG_REQUEST';
export const DELETE_BLOG_SUCCESS: 'BlogList/DELETE_BLOG_SUCCESS' =
  'BlogList/DELETE_BLOG_SUCCESS';
export const DELETE_BLOG_FAILURE: 'BlogList/DELETE_BLOG_FAILURE' =
  'BlogList/DELETE_BLOG_FAILURE';
export const IMPORT_BLOGS_REQUEST: 'BlogList/IMPORT_BLOGS_REQUEST' =
  'BlogList/IMPORT_BLOGS_REQUEST';
export const IMPORT_BLOGS_SUCCESS: 'BlogList/IMPORT_BLOGS_SUCCESS' =
  'BlogList/IMPORT_BLOGS_SUCCESS';
export const IMPORT_BLOGS_FAILURE: 'BlogList/IMPORT_BLOGS_FAILURE' =
  'BlogList/IMPORT_BLOGS_FAILURE';
export const SET_PAGE_SIZE_REQUEST: 'BlogList/SET_PAGE_SIZE_REQUEST' =
  'BlogList/SET_PAGE_SIZE_REQUEST';
export const SET_PAGE_SIZE_SUCCESS: 'BlogList/SET_PAGE_SIZE_SUCCESS' =
  'BlogList/SET_PAGE_SIZE_SUCCESS';
export const SET_PAGE_SIZE_FAILURE: 'BlogList/SET_PAGE_SIZE_FAILURE' =
  'BlogList/SET_PAGE_SIZE_FAILURE';

export const Actions = {
  GET_BLOGS_REQUEST,
  GET_BLOGS_SUCCESS,
  GET_BLOGS_FAILURE,
  CREATE_BLOG_REQUEST,
  CREATE_BLOG_SUCCESS,
  CREATE_BLOG_FAILURE,
  UPDATE_BLOG_REQUEST,
  UPDATE_BLOG_SUCCESS,
  UPDATE_BLOG_FAILURE,
  DELETE_BLOG_REQUEST,
  DELETE_BLOG_SUCCESS,
  DELETE_BLOG_FAILURE,
  IMPORT_BLOGS_REQUEST,
  IMPORT_BLOGS_SUCCESS,
  IMPORT_BLOGS_FAILURE,
  SET_PAGE_SIZE_REQUEST,
  SET_PAGE_SIZE_SUCCESS,
  SET_PAGE_SIZE_FAILURE
};

export type GetBlogsRequest = {
  type: typeof GET_BLOGS_REQUEST
};
export type GetBlogsSuccess = {
  type: typeof GET_BLOGS_SUCCESS,
  payload: Array<BlogAccountType>
};
export type GetBlogsFailure = {
  type: typeof GET_BLOGS_FAILURE,
  payload: string
};
export type CreateBlogRequest = {
  type: typeof CREATE_BLOG_REQUEST,
  payload: BlogAccountType
};
export type CreateBlogSuccess = {
  type: typeof CREATE_BLOG_SUCCESS,
  payload: Array<BlogAccountType>
};
export type CreateBlogFailure = {
  type: typeof CREATE_BLOG_FAILURE,
  payload: string
};
export type UpdateBlogRequest = {
  type: typeof UPDATE_BLOG_REQUEST,
  payload: BlogAccountType
};
export type UpdateBlogSuccess = {
  type: typeof UPDATE_BLOG_SUCCESS,
  payload: Array<BlogAccountType>
};
export type UpdateBlogFailure = {
  type: typeof UPDATE_BLOG_FAILURE,
  payload: string
};
export type DeleteBlogRequest = {
  type: typeof DELETE_BLOG_REQUEST,
  payload: BlogAccountType
};
export type DeleteBlogSuccess = {
  type: typeof DELETE_BLOG_SUCCESS,
  payload: Array<BlogAccountType>
};
export type DeleteBlogFailure = {
  type: typeof DELETE_BLOG_FAILURE,
  payload: string
};
export type ImportBlogsRequest = {
  type: typeof IMPORT_BLOGS_REQUEST,
  payload: Array<BlogAccountType>
};
export type ImportBlogsSuccess = {
  type: typeof IMPORT_BLOGS_SUCCESS,
  payload: Array<BlogAccountType>,
  meta: {
    errorAccounts: Array<BlogAccountType>,
    req: number,
    in: number,
    out: number
  }
};
export type ImportBlogsFailure = {
  type: typeof IMPORT_BLOGS_FAILURE,
  payload: string
};

export type SetPageSizeRequest = {
  type: typeof SET_PAGE_SIZE_REQUEST,
  payload: number
};
export type SetPageSizeSuccess = {
  type: typeof SET_PAGE_SIZE_SUCCESS,
  payload: number
};
export type SetPageSizeFailure = {
  type: typeof SET_PAGE_SIZE_FAILURE,
  meta: { errorMessage: string }
};

export type Action =
  | GetBlogsRequest
  | GetBlogsSuccess
  | GetBlogsFailure
  | CreateBlogRequest
  | CreateBlogSuccess
  | CreateBlogFailure
  | UpdateBlogRequest
  | UpdateBlogSuccess
  | UpdateBlogFailure
  | DeleteBlogRequest
  | DeleteBlogSuccess
  | DeleteBlogFailure
  | ImportBlogsRequest
  | ImportBlogsSuccess
  | ImportBlogsFailure
  | SetPageSizeRequest
  | SetPageSizeSuccess
  | SetPageSizeFailure;
