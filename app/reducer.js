// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import Login from './containers/Login/reducer';
import ResetPassword from './containers/ResetPassword/reducer';
import Profile from './containers/Profile/reducer';
import counter from './reducers/counter';

const rootReducer = combineReducers({
  Profile,
  ResetPassword,
  Login,
  counter,
  router
});

export default rootReducer;
