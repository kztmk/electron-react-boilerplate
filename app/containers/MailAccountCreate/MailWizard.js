// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import MailWizard from '../../components/MailAccountCreate/MailWizard';

const mapStateToProps = (state: State) => ({
  isCreating: state.MailAddressList.isCreating,
  isCreatingFailure: state.MailAddressList.isFailure,
  errorMessage: state.MailAddressList.metaMessage
});

export default connect(mapStateToProps)(MailWizard);
