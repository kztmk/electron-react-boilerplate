// @flow
import type {
  Store as ReduxStoreType,
  Dispatch as ReduxDispatchType
} from 'redux';
import type { Action as NextActionType } from '../action';
import type { State as BaseStateType } from './state';

export type StateType = BaseStateType;
export type ActionType = NextActionType;
export type StoreType = ReduxStoreType<StateType, ActionType>;
export type DispathType = ReduxDispatchType<ActionType>;
