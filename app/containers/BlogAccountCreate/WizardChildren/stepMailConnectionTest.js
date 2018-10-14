// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import type { DispatchType } from '../../../types';
import StepMailConnectionTest from '../../../components/BlogAccountCreate/WizardChildren/stepMailConnectionTest';
import { testConnectionRequest } from "../../MailAccount/actions";
import type MailAccountType from "../../../types/mailAccount";

const mapStateToProps = (state: State) => ({
  randomPersonalInfo: state.PersonalInfo.randomPersonalInfo,
  imapMessageLoading: state.MailAccount.isLoading,
  imapIsError: state.MailAccount.isFailure,
  imapErrorMessage: state.MailAccount.errorMessage,
  imapSelectMailBoxPath: state.MailAccount.selectMailBoxPath,
  imapMailCount: state.MailAccount.mailCount,
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startTestImapConnection(mailAccount: MailAccountType) {
    dispatch(testConnectionRequest(mailAccount));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StepMailConnectionTest);
