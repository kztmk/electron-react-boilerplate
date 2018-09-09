// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import type { DispatchType } from '../../../types';
import YandexAlias from '../../../components/MailAccountCreate/WizardChildren/subYandex';
import { updateGmailSequenceRequest } from '../../GmailSequence/actions';
import type { GmailSequenceType } from '../../../types/gmail';

const mapStateToProps = (state: State) => ({
  gmailSequences: state.GmailSequence.gmailSequences,
  mailAccounts: state.MailAddressList.mailAccounts
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startUpdateSequence(sequence: GmailSequenceType) {
    dispatch(updateGmailSequenceRequest(sequence));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(YandexAlias);
