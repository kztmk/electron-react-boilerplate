// @flow
import { createSelector, createStructuredSelector } from 'reselect';
import type { StateType } from '../../types/state';

const selectLogin = (state: StateType) => state.Login;

export default selectLogin();
