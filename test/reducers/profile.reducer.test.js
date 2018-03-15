// @flow
import reducer, { initialState } from '../../app/containers/Profile/reducer';
import * as actions from '../../app/containers/Profile/actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle SET_PROFILE', () => {
  expect(reducer(initialState, actions.setProfile())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle CREATE_PROFILE_REQUEST', () => {
  expect(reducer(initialState, actions.createProfileRequest())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle CREATE_PROFILE_SUCCESS', () => {
  expect(reducer(initialState, actions.createProfileSuccess())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle CREATE_PROFILE_FAILURE', () => {
  expect(reducer(initialState, actions.createProfileFailure())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle GET_PROFILE_REQUEST', () => {
  expect(reducer(initialState, actions.getProfileRequest())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle GET_PROFILE_SUCCESS', () => {
  expect(reducer(initialState, actions.getProfileSuccess())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle GET_PROFILE_FAILURE', () => {
  expect(reducer(initialState, actions.getProfileFailure())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle UPDATE_PROFILE_REQUEST', () => {
  expect(reducer(initialState, actions.updateProfileRequest())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle UPDATE_PROFILE_SUCCESS', () => {
  expect(reducer(initialState, actions.updateProfileSuccess())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle UPDATE_PROFILE_FAILURE', () => {
  expect(reducer(initialState, actions.updateProfileFailure())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle DELETE_PROFILE_REQUEST', () => {
  expect(reducer(initialState, actions.deleteProfileRequest())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle DELETE_PROFILE_SUCCESS', () => {
  expect(reducer(initialState, actions.deleteProfileSuccess())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});

test('handle DELETE_PROFILE_FAILURE', () => {
  expect(reducer(initialState, actions.deleteProfileFailure())).toEqual({
    userId: '',
    mailAddress: '',
    password: '',
    expireDate: null,
    paymentMethod: '',
    registeredMailAddress: '',
    isLoadingIcon: false,
    isFailure: false,
    errorMessage: ''
  });
});
