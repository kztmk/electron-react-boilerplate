// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import Login from '../containers/Login/reducer';
import counter from './counter';

const rootReducer = combineReducers({
  Login,
  counter,
  router
});

export default rootReducer;
