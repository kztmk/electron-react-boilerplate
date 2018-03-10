// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import Login from '../containers/Login/reducer';
import ResetPassword from '../containers/ResetPassword/reducer';
import counter from './counter';

const rootReducer = combineReducers({
  ResetPassword,
  Login,
  counter,
  router
});

export default rootReducer;
