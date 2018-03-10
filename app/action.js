// @flow
import type { Action as LoginAction } from './containers/Login/actionTypes';
import type { Action as ResetPasswordAction } from './containers/ResetPassword/actionTypes';

export type ActionType = LoginAction | ResetPasswordAction;
