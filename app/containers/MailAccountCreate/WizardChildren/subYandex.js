// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import type { DispatchType } from '../../../types';
import YandexAlias from '../../../components/MailAccountCreate/WizardChildren/subYandex';
import { updateGmailSequenceRequest } from '../../GmailSequence/actions';
import type { GmailSequenceType } from '../../../types/gmail';
import type MailAccountType from '../../../types/mailAccount';
import { importMailAddressRequest } from '../../MailAddressList/actions';

const mapStateToProps = (state: State) => ({
  isSequenceLoading: state.GmailSequence.isGmailSequencesLoading,
  isSequenceFailure: state.GmailSequence.isGmailSequencesFailure,
  sequenceUpdateError: state.GmailSequence.errorMessage,
  gmailSequences: state.GmailSequence.gmailSequences,
  isImporting: state.MailAddressList.isImporting,
  isImportingFailure: state.MailAddressList.isFailure,
  importingError: state.MailAddressList.metaMessage,
  importingErrorAccounts: state.MailAddressList.transAccounts,
  mailAccounts: state.MailAddressList.mailAccounts
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startUpdateSequence(sequence: GmailSequenceType) {
    dispatch(updateGmailSequenceRequest(sequence));
  },
  startImportAliases(aliases: Array<MailAccountType>) {
    dispatch(importMailAddressRequest(aliases));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(YandexAlias);
