// @flow
import { combineReducers } from 'redux';
import AliasMailInfo from './containers/AliasMailInfo/reducer';
import BlogList from './containers/BlogList/reducer';
import Login from './containers/Login/reducer';
import MailAccount from './containers/MailAccount/reducer';
import MailAddressList from './containers/MailAddressList/reducer';
import PersonalInfo from './containers/PersonalInfo/reducer';
import Profile from './containers/Profile/reducer';
import ResetPassword from './containers/ResetPassword/reducer';
import Sequence from './containers/Sequence/reducer';

export default combineReducers({
  AliasMailInfo,
  BlogList,
  Login,
  MailAccount,
  MailAddressList,
  PersonalInfo,
  Profile,
  ResetPassword,
  Sequence
});
