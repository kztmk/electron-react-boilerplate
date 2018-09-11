// @flow
import { connect } from 'react-redux';
import HomePage from '../../components/HomePage';
import type { State } from '../../types/state';
import type { DispatchType } from '../../types';
import { loginDoneRequest } from '../Login/actions';

const mapStateToProps = (state: State) => ({
  userAuth: state.Login,
  profile: state.Profile,
  mailAccountState: state.MailAddressList,
  blogAccountState: state.BlogList
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startLoginDone() {
    dispatch(loginDoneRequest());
  }
});
// const connector: Connector<{}, Props> = connect(mapStateToProps);

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
