// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import type { DispatchType } from '../../types';
import MailAccount from '../../components/MailAccount';
import {
  deleteMessageRequest,
  openConnectionRequest,
  selectMailBoxRequest,
  updateFlagsRequest
} from './actions';

const mapStateToProps = (state: State) => ({
  imapMessageLoading: state.MailAccount.isLoading,
  imapIsError: state.MailAccount.isFailure,
  imapErrorMessage: state.MailAccount.errorMessage,
  imapMailBoxes: state.MailAccount.mailBoxes,
  imapMessages: state.MailAccount.messages,
  imapSelectMailBoxPath: state.MailAccount.selectMailBoxPath,
  imapMailCount: state.MailAccount.mailCount,
  imapMailUnseenCount: state.MailAccount.unseenCount,
  imapSeqFrom: state.MailAccount.seqFrom
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startOpenConnection(mailAccount) {
    dispatch(openConnectionRequest(mailAccount));
  },
  startSelectImapMailBox(path) {
    dispatch(selectMailBoxRequest(path));
  },
  startDeleteImapMessage(uid) {
    dispatch(deleteMessageRequest(uid));
  },
  startUpdateFlags(flagUpdateArgs) {
    dispatch(updateFlagsRequest(flagUpdateArgs));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MailAccount);
