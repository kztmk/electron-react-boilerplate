// @flow
import reducer, { initialState } from './reducer';
import * as actions from './actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle CREATE_GMAIL_INFO_REQUEST', () => {
  expect(reducer(initialState, actions.createGmailInfoRequest())).toEqual({});
});

test('handle CREATE_GMAIL_INFO_SUCCESS', () => {
  expect(reducer(initialState, actions.createGmailInfoSuccess())).toEqual({});
});

test('handle CREATE_GMAIL_INFO_FAILURE', () => {
  expect(reducer(initialState, actions.createGmailInfoFailure())).toEqual({});
});

test('handle GET_GMAIL_INFO_REQUEST', () => {
  expect(reducer(initialState, actions.getGmailInfoRequest())).toEqual({});
});

test('handle GET_GMAIL_INFO_SUCCESS', () => {
  expect(reducer(initialState, actions.getGmailInfoSuccess())).toEqual({});
});

test('handle GET_GMAIL_INFO_FAILURE', () => {
  expect(reducer(initialState, actions.getGmailInfoFailure())).toEqual({});
});

test('handle UPDATE_GMAIL_INFO_REQUEST', () => {
  expect(reducer(initialState, actions.updateGmailInfoRequest())).toEqual({});
});

test('handle UPDATE_GMAIL_INFO_SUCCESS', () => {
  expect(reducer(initialState, actions.updateGmailInfoSuccess())).toEqual({});
});

test('handle UPDATE_GMAIL_INFO_FAILURE', () => {
  expect(reducer(initialState, actions.updateGmailInfoFailure())).toEqual({});
});

test('handle SEQUENCE_COUNT_UP_GMAIL_INFO_REQUEST', () => {
  expect(
    reducer(initialState, actions.sequenceCountUpGmailInfoRequest())
  ).toEqual({});
});

test('handle SEQUENCE_COUNT_UP_GMAIL_INFO_SUCCESS', () => {
  expect(
    reducer(initialState, actions.sequenceCountUpGmailInfoSuccess())
  ).toEqual({});
});

test('handle SEQUENCE_COUNT_UP_GMAIL_INFO_FAILURE', () => {
  expect(
    reducer(initialState, actions.sequenceCountUpGmailInfoFailure())
  ).toEqual({});
});

test('handle SAVE_GMAIL_INFO_REQUEST', () => {
  expect(reducer(initialState, actions.saveGmailInfoRequest())).toEqual({
    isGmailInfoLoading: false,
    isGmailInfoFailure: false,
    errorMessage: '',
    gmailInfo: initialGmailInfo
  });
});

test('handle SAVE_GMAIL_INFO_SUCCESS', () => {
  expect(reducer(initialState, actions.saveGmailInfoSuccess())).toEqual({
    isGmailInfoLoading: false,
    isGmailInfoFailure: false,
    errorMessage: '',
    gmailInfo: initialGmailInfo
  });
});

test('handle SAVE_GMAIL_INFO_FAILURE', () => {
  expect(reducer(initialState, actions.saveGmailInfoFailure())).toEqual({
    isGmailInfoLoading: false,
    isGmailInfoFailure: false,
    errorMessage: '',
    gmailInfo: initialGmailInfo
  });
});
