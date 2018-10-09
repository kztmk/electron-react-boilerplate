// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import type { DispatchType } from '../../../types';
import Steps00blog from '../../../components/BlogAccountCreate/WizardChildren/step00blog';
import { clearPersonalInfoRequest, getRandomPersonalInfoRequest } from '../../PersonalInfo/actions';
import { testConnectionRequest } from "../../MailAccount/actions";
import type MailAccountType from "../../../types/mailAccount";

const mapStateToProps = (state: State) => ({
  isLoading: state.PersonalInfo.isLoading,
  isFailure: state.PersonalInfo.isFailure,
  errorMessage: state.PersonalInfo.errorMessage,
  personalInfo: state.PersonalInfo.personalInfo,
  randomPersonalInfo: state.PersonalInfo.randomPersonalInfo,
  imapMessageLoading: state.MailAccount.isLoading,
  imapIsError: state.MailAccount.isFailure,
  imapErrorMessage: state.MailAccount.errorMessage,
  imapSelectMailBoxPath: state.MailAccount.selectMailBoxPath,
  imapMailCount: state.MailAccount.mailCount,
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  // refresh random info
  startGetRandomPersonalInfo() {
    dispatch(getRandomPersonalInfoRequest());
  },
  startClearPersonalInfo() {
    dispatch(clearPersonalInfoRequest());
  },
  startTestImapConnection(mailAccount: MailAccountType) {
    dispatch(testConnectionRequest(mailAccount));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Steps00blog);
