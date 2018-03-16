// @flow
import { combineReducers } from 'redux';
import Login from './containers/Login/reducer';
import Profile from './containers/Profile/reducer';
import ResetPassword from './containers/ResetPassword/reducer';

export default combineReducers({
  Login,
  Profile,
  ResetPassword
});
