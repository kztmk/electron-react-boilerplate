// @flow
import { connect } from 'react-redux';
import LoginForm from '../../components/FormLogin';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import { setAuthInfo, logoutRequest } from './actions';
import { getProfileRequest } from '../Profile/actions';
import { getMailAddressRequest } from '../MailAddressList/actions';
import { getBlogsRequest } from '../BlogList/actions';
import { getPersonalInfoRequest } from '../PersonalInfo/actions';
import { getAliasMailRequest } from '../AliasMailInfo/actions';
import { getSequenceRequest } from '../Sequence/actions';

const mapStateToProps = (state: State) => ({
  userAuth: state.Login,
  profile: state.Profile,
  mailAccountState: state.MailAddressList,
  blogAccountState: state.BlogList,
  personalInfoState: state.PersonalInfo,
  aliasMailInfoState: state.AliasMailInfo,
  sequencesState: state.Sequence
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  loginStart(userAuth) {
    dispatch(setAuthInfo(userAuth));
  },
  logoutStart() {
    dispatch(logoutRequest());
  },
  startGetProfile() {
    dispatch(getProfileRequest());
  },
  startGetMailAccounts() {
    dispatch(getMailAddressRequest());
  },
  startGetBlogAccounts() {
    dispatch(getBlogsRequest());
  },
  startGetPersonalInfo() {
    dispatch(getPersonalInfoRequest());
  },
  startGetAliasMailInfo() {
    dispatch(getAliasMailRequest())
  },
  startGetSequence() {
    dispatch(getSequenceRequest())
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

// export default connector(LoginForm);
