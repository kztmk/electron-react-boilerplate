// @flow
import type { State as BlogList } from '../containers/BlogList/reducer';
import type { State as Login } from '../containers/Login/reducer';
import type { State as MailAccount } from '../containers/MailAccount/reducer';
import type { State as MailAddressList } from '../containers/MailAddressList/reducer';
import type { State as Profile } from '../containers/Profile/reducer';
import type { State as ResetPassword } from '../containers/ResetPassword/reducer';
// import type { State as Settings } from "../containers/Settings/reducer";

export type State = {
  BlogList: BlogList,
  Login: Login,
  MailAccount: MailAccount,
  MailAddressList: MailAddressList,
  Profile: Profile,
  ResetPassword: ResetPassword,
  Settings: Settings
};
