// @flow
import reducer, { initialState } from "./reducer";
import * as actions from "./actions";

test("provide the initial state", () => {
  expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
});

test("handle CREATE_SETTINGS_REQUEST", () => {
  expect(reducer(initialState, actions.createSettingsRequest())).toEqual({});
});

test("handle CREATE_SETTINGS_SUCCESS", () => {
  expect(reducer(initialState, actions.createSettingsSuccess())).toEqual({});
});

test("handle CREATE_SETTINGS_FAILURE", () => {
  expect(reducer(initialState, actions.createSettingsFailure())).toEqual({});
});

test("handle GET_SETTINGS_REQUEST", () => {
  expect(reducer(initialState, actions.getSettingsRequest())).toEqual({});
});

test("handle GET_SETTINGS_SUCCESS", () => {
  expect(reducer(initialState, actions.getSettingsSuccess())).toEqual({});
});

test("handle GET_SETTINGS_FAILURE", () => {
  expect(reducer(initialState, actions.getSettingsFailure())).toEqual({});
});

test("handle UPDATE_SETTINGS_REQUEST", () => {
  expect(reducer(initialState, actions.updateSettingsRequest())).toEqual({});
});

test("handle UPDATE_SETTINGS_SUCCESS", () => {
  expect(reducer(initialState, actions.updateSettingsSuccess())).toEqual({});
});

test("handle UPDATE_SETTINGS_FAILURE", () => {
  expect(reducer(initialState, actions.updateSettingsFailure())).toEqual({});
});

test("handle DELETE_SETTINGS_REQUEST", () => {
  expect(reducer(initialState, actions.deleteSettingsRequest())).toEqual({});
});

test("handle DELETE_SETTINGS_SUCCESS", () => {
  expect(reducer(initialState, actions.deleteSettingsSuccess())).toEqual({});
});

test("handle DELETE_SETTINGS_FAILURE", () => {
  expect(reducer(initialState, actions.deleteSettingsFailure())).toEqual({});
});
