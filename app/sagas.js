// @flow
import { fork, all } from 'redux-saga/effects'; // eslint-disable-line
import Login from './containers/Login/saga';
import ResetPassword from './containers/ResetPassword/saga';
import Profile from './containers/Profile/saga';
import MailAddressList from './containers/MailAddressList/saga';
import BlogList from './containers/BlogList/saga';
import MailAccount from './containers/MailAccount/saga';
import PersonalInfo from './containers/PersonalInfo/saga';
import AliasMailInfo from './containers/AliasMailInfo/saga';
import Sequence from './containers/Sequence/saga';
import Cpanel from './containers/Cpanel/saga';

function* root(): Generator<*, void, void> {
  yield all([
    fork(Login),
    fork(ResetPassword),
    fork(Profile),
    fork(MailAddressList),
    fork(BlogList),
    fork(MailAccount),
    fork(PersonalInfo),
    fork(AliasMailInfo),
    fork(Sequence),
    fork(Cpanel)
  ]);
}

export default root;
