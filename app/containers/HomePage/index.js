// @flow
import { connect } from 'react-redux';
import HomePage from '../../components/HomePage';
import type { State } from '../../types/state';

const mapStateToProps = (state: State) => ({
  userAuth: state.Login,
  profile: state.Profile,
  mailAccountState: state.MailAddressList,
  blogAccountState: state.BlogList
});

// const connector: Connector<{}, Props> = connect(mapStateToProps);

export default connect(mapStateToProps)(HomePage);
