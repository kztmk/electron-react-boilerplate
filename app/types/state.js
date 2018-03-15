// @flow
import type { State as Login } from "../containers/Login/reducer";
import type { State as Profile } from "../containers/Profile/reducer";
import type { State as ResetPassword } from "../containers/ResetPassword/reducer";

export type State = {
  Login: Login,
  Profile: Profile,
  ResetPassword: ResetPassword
};
