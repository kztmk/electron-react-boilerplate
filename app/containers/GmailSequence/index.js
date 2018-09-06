// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import type { DispatchType } from '../../types';
import type { GmailSequenceType } from '../../types/gmail';
import GmailSequences from '../../components/MailAccountCreate/WizardChildren/subGmail';
import {
  createGmailSequenceRequest,
  deleteGmailSequenceRequest,
  getGmailSequenceRequest,
  updateGmailSequenceRequest
} from './actions';

const mapStateToProps = (state: State) => ({
  isLoading: state.GmailSequence.isGmailSequenceLoading,
  isFailure: state.GmailSequence.isGmailSequenceFailure,
  errorMessage: state.GmailSequence.errorMessage,
  gmailSequences: state.GmailSequence.gmailSequences
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startCreateGmailSequence(sequence: GmailSequenceType) {
    dispatch(createGmailSequenceRequest(sequence));
  },
  startUpdateGmailSequece(sequence: GmailSequenceType) {
    dispatch(updateGmailSequenceRequest(sequence));
  },
  startGetGmailSequence() {
    dispatch(getGmailSequenceRequest());
  },
  startDeleteGmailSequence(sequence: GmailSequenceType) {
    dispatch(deleteGmailSequenceRequest());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GmailSequences);
