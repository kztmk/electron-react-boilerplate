// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import type { DispatchType } from '../../../types';
import Steps00 from '../../../components/MailAccountCreate/WizardChildren/step00';
import { getRandomPersonalInfoRequest } from '../../PersonalInfo/actions';

const mapStateToProps = (state: State) => ({
  isLoading: state.PersonalInfo.isLoading,
  isFailure: state.PersonalInfo.isFailure,
  errorMessage: state.PersonalInfo.errorMessage,
  personalInfo: state.PersonalInfo.personalInfo,
  randomPersonalInfo: state.PersonalInfo.randomPersonalInfo,
  aliasInfo: state.AliasMailInfo.aliasMailInfo
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startGetRandomPersonalInfo() {
    dispatch(getRandomPersonalInfoRequest());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Steps00);
