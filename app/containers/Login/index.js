// @flow
import { connect } from 'react-redux';
import LoginForm from '../../components/FormLogin';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import { setAuthInfo, logoutRequest } from './actions';
import { getProfileRequest } from '../Profile/actions';
import { getMailAddressRequest } from '../MailAddressList/actions';
import { getBlogsRequest } from '../BlogList/actions';

const mapStateToProps = (state: State) => ({
  userAuth: state.Login,
  profile: state.Profile,
  mailAccountState: state.MailAddressList,
  blogAccountState: state.BlogList
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

// export default connector(LoginForm);
