// @flow
import type { State as BlogList } from '../containers/BlogList/reducer';
import type { State as Login } from '../containers/Login/reducer';
import type { State as MailAddressList } from '../containers/MailAddressList/reducer';
import type { State as Profile } from '../containers/Profile/reducer';
import type { State as ResetPassword } from '../containers/ResetPassword/reducer';

export type State = {
  BlogList: BlogList,
  Login: Login,
  MailAddressList: MailAddressList,
  Profile: Profile,
  ResetPassword: ResetPassword
};
