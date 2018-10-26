// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';

import Footer from '../../components/Footer';

const mapStateToProps = (state: State) => ({
  mailAccounts: state.MailAddressList.mailAccounts,
  blogAccounts: state.BlogList.blogAccounts
});

export default connect(mapStateToProps)(Footer);
