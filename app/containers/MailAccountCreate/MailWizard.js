// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import MailWizard from '../../components/MailAccountCreate/MailWizard';
import type { DispatchType } from '../../types';
import type SequenceType from '../../types/sequence';
import { updateSequenceRequest } from '../Sequence/actions';
import type MailAccountType from '../../types/mailAccount';
import { importMailAddressRequest } from '../MailAddressList/actions';

const mapStateToProps = (state: State) => ({
  isCreating: state.MailAddressList.isCreating,
  isImporting: state.MailAddressList.isImporting,
  isCreatingFailure: state.MailAddressList.isFailure,
  errorMessage: state.MailAddressList.metaMessage,
  sequences: state.Sequence.sequences,
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startUpdateSequence(sequence: SequenceType) {
    dispatch(updateSequenceRequest(sequence));
  },
  startImportAliases(accounts: Array<MailAccountType>) {
    dispatch(importMailAddressRequest(accounts));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MailWizard);
