// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import type { DispatchType } from '../../../types';
import StepGmail from '../../../components/MailAccountCreate/WizardChildren/stepGmail';
import { updateGmailSequenceRequest } from '../../GmailSequence/actions';
import type { GmailSequenceType } from '../../../types/gmail';

const mapStateToProps = (state: State) => ({
  gmailInfo: state.Gmail.gmailInfo,
  gmailSequences: state.GmailSequence.gmailSequences
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startUpdateSequence(sequence: GmailSequenceType) {
    dispatch(updateGmailSequenceRequest(sequence));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StepGmail);
