// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import type { DispatchType } from '../../../types';
import GmailSequences from '../../../components/MailAccountCreate/WizardChildren/subGmail';
import {
  createGmailSequenceRequest,
  deleteGmailSequenceRequest,
  getGmailSequenceRequest,
  updateGmailSequenceRequest
} from '../../GmailSequence/actions';
import type { GmailSequenceType } from '../../../types/gmail';

const mapStateToProps = (state: State) => ({
  isLoading: state.GmailSequence.isGmailSequencesLoading,
  isFailure: state.GmailSequence.isGmailSequencesFailure,
  errorMessage: state.GmailSequence.errorMessage,
  gmailSequences: state.GmailSequence.gmailSequences
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startCreateGmailSequence(sequence: GmailSequenceType) {
    dispatch(createGmailSequenceRequest(sequence));
  },
  startUpdateGmailSequence(sequence: GmailSequenceType) {
    dispatch(updateGmailSequenceRequest(sequence));
  },
  startGetGmailSequence() {
    dispatch(getGmailSequenceRequest());
  },
  startDeleteGmailSequence(sequence: GmailSequenceType) {
    dispatch(deleteGmailSequenceRequest(sequence));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GmailSequences);
