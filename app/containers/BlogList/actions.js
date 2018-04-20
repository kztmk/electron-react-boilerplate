// @flow
import type { BlogAccountType } from '../../types/blogAccount';

import {
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
  IMPORT_BLOGS_FAILURE
} from './actionTypes';
import type {
  GetBlogsRequest,
  GetBlogsSuccess,
  GetBlogsFailure,
  CreateBlogRequest,
  CreateBlogSuccess,
  CreateBlogFailure,
  UpdateBlogRequest,
  UpdateBlogSuccess,
  UpdateBlogFailure,
  DeleteBlogRequest,
  DeleteBlogSuccess,
  DeleteBlogFailure,
  ImportBlogsRequest,
  ImportBlogsSuccess,
  ImportBlogsFailure
} from './actionTypes';

export function getBlogsRequest(): GetBlogsRequest {
  return {
    type: GET_BLOGS_REQUEST
  };
}
export function getBlogsSuccess(payload: Array<BlogAccountType>): GetBlogsSuccess {
  return {
    type: GET_BLOGS_SUCCESS,
    payload
  };
}
export function getBlogsFailure(payload: string): GetBlogsFailure {
  return {
    type: GET_BLOGS_FAILURE,
    payload
  };
}
export function createBlogRequest(payload: BlogAccountType): CreateBlogRequest {
  return {
    type: CREATE_BLOG_REQUEST,
    payload
  };
}
export function createBlogSuccess(payload: Array<BlogAccountType>): CreateBlogSuccess {
  return {
    type: CREATE_BLOG_SUCCESS,
    payload
  };
}
export function createBlogFailure(payload: string): CreateBlogFailure {
  return {
    type: CREATE_BLOG_FAILURE,
    payload
  };
}
export function updateBlogRequest(payload: BlogAccountType): UpdateBlogRequest {
  return {
    type: UPDATE_BLOG_REQUEST,
    payload
  };
}
export function updateBlogSuccess(payload: Array<BlogAccountType>): UpdateBlogSuccess {
  return {
    type: UPDATE_BLOG_SUCCESS,
    payload
  };
}
export function updateBlogFailure(payload: string): UpdateBlogFailure {
  return {
    type: UPDATE_BLOG_FAILURE,
    payload
  };
}
export function deleteBlogRequest(payload: BlogAccountType): DeleteBlogRequest {
  return {
    type: DELETE_BLOG_REQUEST,
    payload
  };
}
export function deleteBlogSuccess(payload: Array<BlogAccountType>): DeleteBlogSuccess {
  return {
    type: DELETE_BLOG_SUCCESS,
    payload
  };
}
export function deleteBlogFailure(payload: string): DeleteBlogFailure {
  return {
    type: DELETE_BLOG_FAILURE,
    payload
  };
}
export function importBlogsRequest(payload: Array<BlogAccountType>): ImportBlogsRequest {
  return {
    type: IMPORT_BLOGS_REQUEST,
    payload
  };
}
export function importBlogsSuccess(
  payload: Array<BlogAccountType>,
  meta: {
    errorAccounts: Array<BlogAccountType>,
    req: number,
    in: number,
    out: number
  }
): ImportBlogsSuccess {
  return {
    type: IMPORT_BLOGS_SUCCESS,
    payload,
    meta
  };
}
export function importBlogsFailure(payload: string): ImportBlogsFailure {
  return {
    type: IMPORT_BLOGS_FAILURE,
    payload
  };
}
