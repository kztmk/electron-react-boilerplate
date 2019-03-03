// @flow
import reducer, { initialState } from './reducer';
import * as actions from './actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle GET_CPANELS_REQUEST', () => {
  expect(reducer(initialState, actions.getCpanelsRequest())).toEqual({});
});

test('handle GET_CPANELS_SUCCESS', () => {
  expect(reducer(initialState, actions.getCpanelsSuccess())).toEqual({});
});

test('handle GET_CPANELS_FAILURE', () => {
  expect(reducer(initialState, actions.getCpanelsFailure())).toEqual({});
});

test('handle CREATE_CPANEL_REQUEST', () => {
  expect(reducer(initialState, actions.createCpanelRequest())).toEqual({});
});

test('handle CREATE_CPANEL_SUCCESS', () => {
  expect(reducer(initialState, actions.createCpanelSuccess())).toEqual({});
});

test('handle CREATE_CPANEL_FAILURE', () => {
  expect(reducer(initialState, actions.createCpanelFailure())).toEqual({});
});

test('handle UPDATE_CPANEL_REQUEST', () => {
  expect(reducer(initialState, actions.updateCpanelRequest())).toEqual({});
});

test('handle UPDATE_CPANEL_SUCCESS', () => {
  expect(reducer(initialState, actions.updateCpanelSuccess())).toEqual({});
});

test('handle UPDATE_CPANEL_FAILURE', () => {
  expect(reducer(initialState, actions.updateCpanelFailure())).toEqual({});
});

test('handle DELETE_CPANEL_REQUEST', () => {
  expect(reducer(initialState, actions.deleteCpanelRequest())).toEqual({});
});

test('handle DELETE_CPANEL_SUCCESS', () => {
  expect(reducer(initialState, actions.deleteCpanelSuccess())).toEqual({});
});

test('handle DELETE_CPANEL_FAILURE', () => {
  expect(reducer(initialState, actions.deleteCpanelFailure())).toEqual({});
});
