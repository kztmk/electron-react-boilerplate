// @flow
import reducer, { initialState } from './reducer';
import * as actions from './actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle GET_MAIL_ADDRESS_REQUEST', () => {
  expect(reducer(initialState, actions.getMailAddressRequest())).toEqual({
    mailAccounts: []
  });
});

test('handle GET_MAIL_ADDRESS_SUCCESS', () => {
  expect(reducer(initialState, actions.getMailAddressSuccess())).toEqual({
    mailAccounts: []
  });
});

test('handle GET_MAIL_ADDRESS_FAILURE', () => {
  expect(reducer(initialState, actions.getMailAddressFailure())).toEqual({
    mailAccounts: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle CREATE_BLOG_REQUEST', () => {
  expect(reducer(initialState, actions.createBlogRequest())).toEqual({
    mailAccounts: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle CREATE_MAIL_ADDRESS_REQUEST', () => {
  expect(reducer(initialState, actions.createMailAddressRequest())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle CREATE_MAIL_ADDRESS_SUCCESS', () => {
  expect(reducer(initialState, actions.createMailAddressSuccess())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle CREATE_MAIL_ADDRESS_FAILURE', () => {
  expect(reducer(initialState, actions.createMailAddressFailure())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle UPDATE_MAIL_ADDRESS_REQUEST', () => {
  expect(reducer(initialState, actions.updateMailAddressRequest())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle UPDATE_BLOG_SUCCESS', () => {
  expect(reducer(initialState, actions.updateBlogSuccess())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle default', () => {
  expect(reducer(initialState, actions.default())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle UPDATE_MAIL_ADDRESS_FAILURE', () => {
  expect(reducer(initialState, actions.updateMailAddressFailure())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle DELETE_MAIL_ADDRESS_REQUEST', () => {
  expect(reducer(initialState, actions.deleteMailAddressRequest())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle DELETE_MAIL_ADDRESS_SUCCESS', () => {
  expect(reducer(initialState, actions.deleteMailAddressSuccess())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle DELETE_MAIL_ADDRESS_FAILURE', () => {
  expect(reducer(initialState, actions.deleteMailAddressFailure())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle IMPORT_MAIL_ADDRESS_REQUEST', () => {
  expect(reducer(initialState, actions.importMailAddressRequest())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle UPDATE_MAIL_ADDRESS_SUCCESS', () => {
  expect(reducer(initialState, actions.updateMailAddressSuccess())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle IMPORT_MAIL_ADDRESS_SUCCESS', () => {
  expect(reducer(initialState, actions.importMailAddressSuccess())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle IMPORT_MAIL_ADDRESS_FAILURE', () => {
  expect(reducer(initialState, actions.importMailAddressFailure())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle CLEAR_MAIL_ADDRESS', () => {
  expect(reducer(initialState, actions.clearMailAddress())).toEqual({
    mailAccounts: null,
    targetAccount: null,
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    importFilePath: ''
  });
});

test('handle UPDATE_LAST_LOGIN_REQUEST', () => {
  expect(reducer(initialState, actions.updateLastLoginRequest())).toEqual({
    mailAccounts: [],
    isGetting: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isImporting: false,
    isFailure: false,
    metaMessage: '',
    transAccounts: []
  });
});

test('handle UPDATE_LAST_LOGIN_SUCCESS', () => {
  expect(reducer(initialState, actions.updateLastLoginSuccess())).toEqual({
    mailAccounts: [],
    isGetting: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isImporting: false,
    isFailure: false,
    metaMessage: '',
    transAccounts: []
  });
});

test('handle UPDATE_LAST_LOGIN_FAILURE', () => {
  expect(reducer(initialState, actions.updateLastLoginFailure())).toEqual({
    mailAccounts: [],
    isGetting: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isImporting: false,
    isFailure: false,
    metaMessage: '',
    transAccounts: []
  });
});
