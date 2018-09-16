// @flow
import reducer, { initialState } from './reducer';
import * as actions from './actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle CREATE_GMAIL_SEQUENCE_REQUEST', () => {
  expect(reducer(initialState, actions.createGmailSequenceRequest())).toEqual(
    {}
  );
});

test('handle CREATE_GMAIL_SEQUENCE_SUCCESS', () => {
  expect(reducer(initialState, actions.createGmailSequenceSuccess())).toEqual(
    {}
  );
});

test('handle CREATE_GMAIL_SEQUENCE_FAILURE', () => {
  expect(reducer(initialState, actions.createGmailSequenceFailure())).toEqual(
    {}
  );
});

test('handle UPDATE_GMAIL_SEQUENCE_REQUEST', () => {
  expect(reducer(initialState, actions.updateGmailSequenceRequest())).toEqual(
    {}
  );
});

test('handle UPDATE_GMAIL_SEQUENCE_SUCCESS', () => {
  expect(reducer(initialState, actions.updateGmailSequenceSuccess())).toEqual(
    {}
  );
});

test('handle UPDATE_GMAIL_SEQUENCE_FAILURE', () => {
  expect(reducer(initialState, actions.updateGmailSequenceFailure())).toEqual(
    {}
  );
});

test('handle GET_GMAIL_SEQUENCE_REQUEST', () => {
  expect(reducer(initialState, actions.getGmailSequenceRequest())).toEqual({});
});

test('handle GET_GMAIL_SEQUENCE_SUCCESS', () => {
  expect(reducer(initialState, actions.getGmailSequenceSuccess())).toEqual({});
});

test('handle GET_GMAIL_SEQUENCE_FAILURE', () => {
  expect(reducer(initialState, actions.getGmailSequenceFailure())).toEqual({});
});

test('handle DELETE_GMAIL_SEQUENCE_REQUEST', () => {
  expect(reducer(initialState, actions.deleteGmailSequenceRequest())).toEqual(
    {}
  );
});

test('handle DELETE_GMAIL_SEQUENCE_SUCCESS', () => {
  expect(reducer(initialState, actions.deleteGmailSequenceSuccess())).toEqual(
    {}
  );
});

test('handle DELETE_GMAIL_SEQUENCE_FAILURE', () => {
  expect(reducer(initialState, actions.deleteGmailSequenceFailure())).toEqual(
    {}
  );
});
