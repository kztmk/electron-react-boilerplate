// @flow
import reducer, { initialState } from './reducer';
import * as actions from './actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle GET_BLOGS_REQUEST', () => {
  expect(reducer(initialState, actions.getBlogsRequest())).toEqual({
    blogAccounts: [],
    errorMessage: ''
  });
});

test('handle GET_BLOGS_SUCCESS', () => {
  expect(reducer(initialState, actions.getBlogsSuccess())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle GET_BLOGS_FAILURE', () => {
  expect(reducer(initialState, actions.getBlogsFailure())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle CREATE_BLOG_REQUEST', () => {
  expect(reducer(initialState, actions.createBlogRequest())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle CREATE_BLOG_SUCCESS', () => {
  expect(reducer(initialState, actions.createBlogSuccess())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle CREATE_BLOG_FAILURE', () => {
  expect(reducer(initialState, actions.createBlogFailure())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle UPDATE_BLOG_REQUEST', () => {
  expect(reducer(initialState, actions.updateBlogRequest())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle UPDATE_BLOG_SUCCESS', () => {
  expect(reducer(initialState, actions.updateBlogSuccess())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle UPDATE_BLOG_FAILURE', () => {
  expect(reducer(initialState, actions.updateBlogFailure())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle DELETE_BLOG_REQUEST', () => {
  expect(reducer(initialState, actions.deleteBlogRequest())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle DELETE_BLOG_SUCCESS', () => {
  expect(reducer(initialState, actions.deleteBlogSuccess())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle DELETE_BLOG_FAILURE', () => {
  expect(reducer(initialState, actions.deleteBlogFailure())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle IMPORT_MAIL_ADDRESS_REQUEST', () => {
  expect(reducer(initialState, actions.importMailAddressRequest())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle IMPORT_BLOGS_SUCCESS', () => {
  expect(reducer(initialState, actions.importBlogsSuccess())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle IMPORT_BLOGS_FAILURE', () => {
  expect(reducer(initialState, actions.importBlogsFailure())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle IMPORT_BLOGS_REQUEST', () => {
  expect(reducer(initialState, actions.importBlogsRequest())).toEqual({
    blogAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importBlogFilePath: ''
  });
});

test('handle SET_PAGE_SIZE_REQUEST', () => {
  expect(reducer(initialState, actions.setPageSizeRequest())).toEqual({
    blogAccounts: [],
    isGetting: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isImporting: false,
    isFailure: false,
    metaMessage: '',
    transAccounts: [],
    pageSize: 10
  });
});

test('handle SET_PAGE_SIZE_SUCCESS', () => {
  expect(reducer(initialState, actions.setPageSizeSuccess())).toEqual({
    blogAccounts: [],
    isGetting: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isImporting: false,
    isFailure: false,
    metaMessage: '',
    transAccounts: [],
    pageSize: 10
  });
});

test('handle SET_PAGE_SIZE_FAILURE', () => {
  expect(reducer(initialState, actions.setPageSizeFailure())).toEqual({
    blogAccounts: [],
    isGetting: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isImporting: false,
    isFailure: false,
    metaMessage: '',
    transAccounts: [],
    pageSize: 10
  });
});
