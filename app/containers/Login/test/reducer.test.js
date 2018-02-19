/* eslint-disable function-paren-newline */
// @flow
import reducer, { initialState } from '../reducer';
import * as actions from '../actions';
import type { AuthType } from '../../../types/auth';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle SET_AUTH_INFO', () => {
  const logInInfo: AuthType = {
    ...initialState,
    mailAddress: 'example@example.com',
    password: 'abc123'
  };
  expect(
    reducer(initialState, actions.setAuthInfo(logInInfo))
  ).toMatchSnapshot();
});

test('handle LOGIN_REQUEST', () => {
  const defState: AuthType = {
    ...initialState
  };
  console.log(defState);
  const loginInfo: AuthType = {
    ...initialState,
    mailAddress: 'example@example.com',
    password: 'abcd1234'
  };
  console.log(loginInfo);
  expect(reducer(loginInfo, actions.loginRequest())).toMatchSnapshot();
});

test('handle LOGIN_SUCCESS', () => {
  const loginInfo: AuthType = {
    ...initialState,
    mailAddress: 'example@example.com',
    password: 'abcd1234'
  };
  const success: AuthType = {
    ...loginInfo,
    userId: 'test1'
  };
  expect(reducer(loginInfo, actions.loginSuccess(success))).toMatchSnapshot();
});

test('handle LOGIN_FAILURE', () => {
  const loginInfo: AuthType = {
    ...initialState,
    mailAddress: 'example@example.com',
    password: 'abcd1234'
  };

  const errorInfo: AuthType = {
    ...loginInfo,
    errorMessage: 'something happen'
  };
  expect(reducer(loginInfo, actions.loginFailure(errorInfo))).toMatchSnapshot();
});

test('handle LOGOUT_REQUEST', () => {
  const loginInfo: AuthType = {
    ...initialState,
    userId: 'test1',
    mailAddress: 'example@example.com',
    password: 'abcd1234',
    errorMessage: ''
  };
  expect(reducer(loginInfo, actions.logoutRequest())).toMatchSnapshot();
});

test('handle LOGOUT_SUCCESS', () => {
  const loginInfo: AuthType = {
    ...initialState,
    userId: 'test1',
    mailAddress: 'example@example.com',
    password: 'abcd1234',
    errorMessage: ''
  };
  expect(reducer(loginInfo, actions.logoutSuccess())).toMatchSnapshot();
});

test('handle LOGOUT_FAILURE', () => {
  const loginInfo: AuthType = {
    ...initialState,
    userId: 'test1',
    mailAddress: 'example@example.com',
    password: 'abcd1234',
    errorMessage: ''
  };
  const errorInfo: AuthType = {
    ...loginInfo,
    errorMessage: 'something happen'
  };
  expect(
    // eslint-disable-next-line function-paren-newline
    reducer(loginInfo, actions.logoutFailure(errorInfo))
  ).toMatchSnapshot();
});

test('handle CLEAR_AUTH_INFO', () => {
  const loginInfo: AuthType = {
    userId: 'test1',
    mailAddress: 'example@example.com',
    isLoginFailure: true,
    isLoadingIcon: true,
    password: 'abcd1234',
    errorMessage: 'samething happen'
  };
  expect(reducer(loginInfo, actions.clearAuthInfo())).toMatchSnapshot();
});
