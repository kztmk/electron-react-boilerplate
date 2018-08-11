// @flow
import type {
  Store as ReduxStoreType,
  Dispatch as ReduxDispatchType
} from 'redux';
import type { ActionType as NextActionType } from './action';
import type { StateType as BaseStateType } from './state';

export type StateType = BaseStateType;
export type ActionType = NextActionType;
export type StoreType = ReduxStoreType<StateType, ActionType>;
export type DispatchType = ReduxDispatchType<ActionType>;
