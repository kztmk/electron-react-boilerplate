// @flow
import reducer, { initialState } from './reducer';
import * as actions from './actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle SAVE_ALIAS_MAIL_REQUEST', () => {
  expect(reducer(initialState, actions.saveAliasMailRequest())).toEqual({});
});

test('handle SAVE_ALIAS_MAIL_SUCCESS', () => {
  expect(reducer(initialState, actions.saveAliasMailSuccess())).toEqual({});
});

test('handle SAVE_ALIAS_MAIL_FAILURE', () => {
  expect(reducer(initialState, actions.saveAliasMailFailure())).toEqual({});
});

test('handle GET_ALIAS_MAIL_REQUEST', () => {
  expect(reducer(initialState, actions.getAliasMailRequest())).toEqual({});
});

test('handle GET_ALIAS_MAIL_SUCCESS', () => {
  expect(reducer(initialState, actions.getAliasMailSuccess())).toEqual({});
});

test('handle GET_ALIAS_MAIL_FAILURE', () => {
  expect(reducer(initialState, actions.getAliasMailFailure())).toEqual({});
});

test('handle DELETE_ALIAS_MAIL_REQUEST', () => {
  expect(reducer(initialState, actions.deleteAliasMailRequest())).toEqual({});
});

test('handle DELETE_ALIAS_MAIL_SUCCESS', () => {
  expect(reducer(initialState, actions.deleteAliasMailSuccess())).toEqual({});
});

test('handle DELETE_ALIAS_MAIL_FAILURE', () => {
  expect(reducer(initialState, actions.deleteAliasMailFailure())).toEqual({});
});
