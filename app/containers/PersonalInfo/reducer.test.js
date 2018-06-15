// @flow
import reducer, { initialState } from "./reducer";
import * as actions from "./actions";

test("provide the initial state", () => {
  expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
});

test("handle GET_PERSONAL_INFO_REQUEST", () => {
  expect(reducer(initialState, actions.getPersonalInfoRequest())).toEqual({});
});

test("handle GET_PERSONAL_INFO_SUCCESS", () => {
  expect(reducer(initialState, actions.getPersonalInfoSuccess())).toEqual({});
});

test("handle GET_PERSONAL_INFO_FAILURE", () => {
  expect(reducer(initialState, actions.getPersonalInfoFailure())).toEqual({});
});

test("handle GET_RANDOM_PERSONAL_INFO_REQUEST", () => {
  expect(reducer(initialState, actions.getRandomPersonalInfoRequest())).toEqual(
    {
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      lastNameKatakana: "",
      firstNameKatakana: "",
      lastNameHepburn: "",
      firstNameHepburn: "",
      gender: 0,
      birthDate: "",
      postalCode: "",
      prefecture: "",
      address1: "",
      useDefault: false
    }
  );
});

test("handle GET_RANDOM_PERSONAL_INFO_SUCCESS", () => {
  expect(reducer(initialState, actions.getRandomPersonalInfoSuccess())).toEqual(
    {
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      lastNameKatakana: "",
      firstNameKatakana: "",
      lastNameHepburn: "",
      firstNameHepburn: "",
      gender: 0,
      birthDate: "",
      postalCode: "",
      prefecture: "",
      address1: "",
      useDefault: false
    }
  );
});

test("handle GET_RANDOM_PERSONAL_INFO_FAILURE", () => {
  expect(reducer(initialState, actions.getRandomPersonalInfoFailure())).toEqual(
    {
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      lastNameKatakana: "",
      firstNameKatakana: "",
      lastNameHepburn: "",
      firstNameHepburn: "",
      gender: 0,
      birthDate: "",
      postalCode: "",
      prefecture: "",
      address1: "",
      useDefault: false
    }
  );
});

test("handle SAVE_PERSONAL_INFO_REQUEST", () => {
  expect(reducer(initialState, actions.savePersonalInfoRequest())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    lastNameKatakana: "",
    firstNameKatakana: "",
    lastNameHepburn: "",
    firstNameHepburn: "",
    gender: 0,
    birthDate: "",
    postalCode: "",
    prefecture: "",
    address1: "",
    useDefault: false
  });
});

test("handle SAVE_PERSONAL_INFO_SUCCESS", () => {
  expect(reducer(initialState, actions.savePersonalInfoSuccess())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    lastNameKatakana: "",
    firstNameKatakana: "",
    lastNameHepburn: "",
    firstNameHepburn: "",
    gender: 0,
    birthDate: "",
    postalCode: "",
    prefecture: "",
    address1: "",
    useDefault: false
  });
});

test("handle SAVE_PERSONAL_INFO_FAILURE", () => {
  expect(reducer(initialState, actions.savePersonalInfoFailure())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    lastNameKatakana: "",
    firstNameKatakana: "",
    lastNameHepburn: "",
    firstNameHepburn: "",
    gender: 0,
    birthDate: "",
    postalCode: "",
    prefecture: "",
    address1: "",
    useDefault: false
  });
});
