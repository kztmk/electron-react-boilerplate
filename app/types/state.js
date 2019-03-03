// @flow
import type { State as AliasMailInfo } from '../containers/AliasMailInfo/reducer';
import type { State as BlogList } from '../containers/BlogList/reducer';
import type { State as Cpanel } from '../containers/Cpanel/reducer';
import type { State as Login } from '../containers/Login/reducer';
import type { State as MailAccount } from '../containers/MailAccount/reducer';
import type { State as MailAddressList } from '../containers/MailAddressList/reducer';
import type { State as PersonalInfo } from '../containers/PersonalInfo/reducer';
import type { State as Profile } from '../containers/Profile/reducer';
import type { State as ResetPassword } from '../containers/ResetPassword/reducer';
import type { State as Sequence } from '../containers/Sequence/reducer';

export type State = {
  AliasMailInfo: AliasMailInfo,
  BlogList: BlogList,
  Cpanel: Cpanel,
  Login: Login,
  MailAccount: MailAccount,
  MailAddressList: MailAddressList,
  PersonalInfo: PersonalInfo,
  Profile: Profile,
  ResetPassword: ResetPassword,
  Sequence: Sequence
};
