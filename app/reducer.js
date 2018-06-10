// @flow
import { combineReducers } from 'redux';
import BlogList from './containers/BlogList/reducer';
import Login from './containers/Login/reducer';
import MailAccount from './containers/MailAccount/reducer';
import MailAddressList from './containers/MailAddressList/reducer';
import Profile from './containers/Profile/reducer';
import ResetPassword from './containers/ResetPassword/reducer';
// import Settings from "./containers/Settings/reducer";

export default combineReducers({
  BlogList,
  Login,
  MailAccount,
  MailAddressList,
  Profile,
  ResetPassword
  // Settings
});
