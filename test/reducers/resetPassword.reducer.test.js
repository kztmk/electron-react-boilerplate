// @flow
import reducer, {
  initialState
} from '../../app/containers/ResetPassword/reducer';
import * as actions from '../../app/containers/ResetPassword/actions';

test('provide the initial state', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

test('handle SET_AUTH_INFO', () => {
  expect(reducer(initialState, actions.setAuthInfo())).toEqual({});
});

test('handle LOGIN_REQUEST', () => {
  expect(reducer(initialState, actions.loginRequest())).toEqual({});
});

test('handle RESET_PASSWORD_SUCCESS', () => {
  expect(reducer(initialState, actions.resetPasswordSuccess())).toEqual({});
});

test('handle RESET_PASSWORD_FAILURE', () => {
  expect(reducer(initialState, actions.resetPasswordFailure())).toEqual({});
});
