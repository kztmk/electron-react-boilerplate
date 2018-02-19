// @flow
import { call, put } from 'redux-saga';
import { requestLogin } from '../saga';
import type { AuthType } from '../../../types/auth';

test('Log in to firebase auth type EmailAndPassword', () => {
  const param: AuthType = {
    userId: '',
    mailAddress: 'kazuya1inazuma@gmail.com',
    password: 'abcd1234',
    isLoginFailure: false,
    isLoadingIcon: false,
    errorMessage: ''
  };
  expect(requestLogin(param)).toMatchSnapshot();
});
