// @flow
import reducer, { initialState } from './reducer';
import * as actions from './actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle GET_PERSONAL_INFO_REQUEST', () => {
  expect(reducer(initialState, actions.getPersonalInfoRequest())).toEqual({});
});

test('handle GET_PERSONAL_INFO_SUCCESS', () => {
  expect(reducer(initialState, actions.getPersonalInfoSuccess())).toEqual({});
});

test('handle GET_PERSONAL_INFO_FAILURE', () => {
  expect(reducer(initialState, actions.getPersonalInfoFailure())).toEqual({});
});

test('handle GET_RANDOM_PERSONAL_INFO_REQUEST', () => {
  expect(reducer(initialState, actions.getRandomPersonalInfoRequest())).toEqual(
    {
      lastName: '',
      firstName: '',
      lastNameKana: '',
      firstNameKana: '',
      lastNameKatakana: '',
      firstNameKatakana: '',
      lastNameHepburn: '',
      firstNameHepburn: '',
      gender: 0,
      birthDate: '',
      postalCode: '',
      prefecture: '',
      address1: '',
      useDefault: false
    }
  );
});

test('handle GET_RANDOM_PERSONAL_INFO_SUCCESS', () => {
  expect(reducer(initialState, actions.getRandomPersonalInfoSuccess())).toEqual(
    {
      lastName: '',
      firstName: '',
      lastNameKana: '',
      firstNameKana: '',
      lastNameKatakana: '',
      firstNameKatakana: '',
      lastNameHepburn: '',
      firstNameHepburn: '',
      gender: 0,
      birthDate: '',
      postalCode: '',
      prefecture: '',
      address1: '',
      useDefault: false
    }
  );
});

test('handle GET_RANDOM_PERSONAL_INFO_FAILURE', () => {
  expect(reducer(initialState, actions.getRandomPersonalInfoFailure())).toEqual(
    {
      lastName: '',
      firstName: '',
      lastNameKana: '',
      firstNameKana: '',
      lastNameKatakana: '',
      firstNameKatakana: '',
      lastNameHepburn: '',
      firstNameHepburn: '',
      gender: 0,
      birthDate: '',
      postalCode: '',
      prefecture: '',
      address1: '',
      useDefault: false
    }
  );
});

test('handle SAVE_PERSONAL_INFO_REQUEST', () => {
  expect(reducer(initialState, actions.savePersonalInfoRequest())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    lastNameKatakana: '',
    firstNameKatakana: '',
    lastNameHepburn: '',
    firstNameHepburn: '',
    gender: 0,
    birthDate: '',
    postalCode: '',
    prefecture: '',
    address1: '',
    useDefault: false
  });
});

test('handle SAVE_PERSONAL_INFO_SUCCESS', () => {
  expect(reducer(initialState, actions.savePersonalInfoSuccess())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    lastNameKatakana: '',
    firstNameKatakana: '',
    lastNameHepburn: '',
    firstNameHepburn: '',
    gender: 0,
    birthDate: '',
    postalCode: '',
    prefecture: '',
    address1: '',
    useDefault: false
  });
});

test('handle SAVE_PERSONAL_INFO_FAILURE', () => {
  expect(reducer(initialState, actions.savePersonalInfoFailure())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    lastNameKatakana: '',
    firstNameKatakana: '',
    lastNameHepburn: '',
    firstNameHepburn: '',
    gender: 0,
    birthDate: '',
    postalCode: '',
    prefecture: '',
    address1: '',
    useDefault: false
  });
});

test('handle SAVE_PERSONAL_INFO_FOR_BLOG_REQUEST', () => {
  expect(
    reducer(initialState, actions.savePersonalInfoForBlogRequest())
  ).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});

test('handle SAVE_PERSONAL_INFO_FOR_BLOG_SUCCESS', () => {
  expect(
    reducer(initialState, actions.savePersonalInfoForBlogSuccess())
  ).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});

test('handle SAVE_PERSONAL_INFO_FOR_BLOG_FAILURE', () => {
  expect(
    reducer(initialState, actions.savePersonalInfoForBlogFailure())
  ).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});

test('handle GET_PERSONAL_INFO_FOR_BLOG_REQUEST', () => {
  expect(
    reducer(initialState, actions.getPersonalInfoForBlogRequest())
  ).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});

test('handle GET_PERSONAL_INFO_FOR_BLOG_SUCCESS', () => {
  expect(
    reducer(initialState, actions.getPersonalInfoForBlogSuccess())
  ).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});

test('handle GET_PERSONAL_INFO_FOR_BLOG_FAILURE', () => {
  expect(
    reducer(initialState, actions.getPersonalInfoForBlogFailure())
  ).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});

test('handle CLEAR_PERSONAL_INFO_REQUEST', () => {
  expect(reducer(initialState, actions.clearPersonalInfoRequest())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});

test('handle CLEAR_PERSONAL_INFO_SUCCESS', () => {
  expect(reducer(initialState, actions.clearPersonalInfoSuccess())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});

test('handle CLEAR_PERSONAL_INFO_FAILURE', () => {
  expect(reducer(initialState, actions.clearPersonalInfoFailure())).toEqual({
    isLoading: false,
    isFailure: false,
    errorMessage: '',
    personalInfo: initialPersonalInfo,
    randomPersonalInfo: initialPersonalInfo
  });
});
