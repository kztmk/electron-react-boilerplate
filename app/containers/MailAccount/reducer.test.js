// @flow
import reducer, { initialState } from './reducer';
import * as actions from './actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle OPEN_CONNECTION_REQUEST', () => {
  expect(reducer(initialState, actions.openConnectionRequest())).toEqual({});
});

test('handle OPEN_CONNECTION_SUCCESS', () => {
  expect(reducer(initialState, actions.openConnectionSuccess())).toEqual({});
});

test('handle OPEN_CONNECTION_FAILURE', () => {
  expect(reducer(initialState, actions.openConnectionFailure())).toEqual({});
});

test('handle SELECT_MAIL_BOX_REQUEST', () => {
  expect(reducer(initialState, actions.selectMailBoxRequest())).toEqual({});
});

test('handle SELECT_MAIL_BOX_SUCCESS', () => {
  expect(reducer(initialState, actions.selectMailBoxSuccess())).toEqual({});
});

test('handle SELECT_MAIL_BOX_FAILURE', () => {
  expect(reducer(initialState, actions.selectMailBoxFailure())).toEqual({});
});

test('handle DELETE_MESSAGE_REQUEST', () => {
  expect(reducer(initialState, actions.deleteMessageRequest())).toEqual({});
});

test('handle DELETE_MESSAGE_SUCCESS', () => {
  expect(reducer(initialState, actions.deleteMessageSuccess())).toEqual({});
});

test('handle DELETE_MESSAGE_FAILURE', () => {
  expect(reducer(initialState, actions.deleteMessageFailure())).toEqual({});
});

test('handle UPDATE_FLAGS_REQUEST', () => {
  expect(reducer(initialState, actions.updateFlagsRequest())).toEqual({});
});

test('handle UPDATE_FLAGS_SUCCESS', () => {
  expect(reducer(initialState, actions.updateFlagsSuccess())).toEqual({});
});

test('handle UPDATE_FLAGS_FAILURE', () => {
  expect(reducer(initialState, actions.updateFlagsFailure())).toEqual({});
});

test('handle CLOSE_CONNECTION_REQUEST', () => {
  expect(reducer(initialState, actions.closeConnectionRequest())).toEqual({});
});

test('handle CLOSE_CONNECTION_SUCCESS', () => {
  expect(reducer(initialState, actions.closeConnectionSuccess())).toEqual({});
});

test('handle CLOSE_CONNECTION_FAILURE', () => {
  expect(reducer(initialState, actions.closeConnectionFailure())).toEqual({});
});

test('handle MOVE_MAILS_REQUEST', () => {
  expect(reducer(initialState, actions.moveMailsRequest())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    mailBoxes: [],
    selectMailBoxPath: '',
    messages: [],
    mailCount: 0,
    unseenCount: 0,
    seqFrom: 1
  });
});

test('handle MOVE_MAILS_SUCCESS', () => {
  expect(reducer(initialState, actions.moveMailsSuccess())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    mailBoxes: [],
    selectMailBoxPath: '',
    messages: [],
    mailCount: 0,
    unseenCount: 0,
    seqFrom: 1
  });
});

test('handle MOVE_MAILS_FAILURE', () => {
  expect(reducer(initialState, actions.moveMailsFailure())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    mailBoxes: [],
    selectMailBoxPath: '',
    messages: [],
    mailCount: 0,
    unseenCount: 0,
    seqFrom: 1
  });
});

test('handle UPDATE_LAST_LOGIN_REQUEST', () => {
  expect(reducer(initialState, actions.updateLastLoginRequest())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    mailBoxes: [],
    selectMailBoxPath: '',
    messages: [],
    mailCount: 0,
    unseenCount: 0,
    seqFrom: 1
  });
});

test('handle UPDATE_LAST_LOGIN_SUCCESS', () => {
  expect(reducer(initialState, actions.updateLastLoginSuccess())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    mailBoxes: [],
    selectMailBoxPath: '',
    messages: [],
    mailCount: 0,
    unseenCount: 0,
    seqFrom: 1
  });
});

test('handle UPDATE_LAST_LOGIN_FAILURE', () => {
  expect(reducer(initialState, actions.updateLastLoginFailure())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    mailBoxes: [],
    selectMailBoxPath: '',
    messages: [],
    mailCount: 0,
    unseenCount: 0,
    seqFrom: 1
  });
});
