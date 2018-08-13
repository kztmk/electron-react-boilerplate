// @flow
import { connect } from 'react-redux';
import type { State } from '../../../types/state';
import type { DispatchType } from '../../../types';
import Steps00blog from '../../../components/BlogAccountCreate/WizardChildren/step00blog';
import { clearPersonalInfoRequest, getRandomPersonalInfoRequest } from '../../PersonalInfo/actions';

const mapStateToProps = (state: State) => ({
  isLoading: state.PersonalInfo.isLoading,
  isFailure: state.PersonalInfo.isFailure,
  errorMessage: state.PersonalInfo.errorMessage,
  personalInfo: state.PersonalInfo.personalInfo,
  randomPersonalInfo: state.PersonalInfo.randomPersonalInfo
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  // refresh random info
  startGetRandomPersonalInfo() {
    dispatch(getRandomPersonalInfoRequest());
  },
  startClearPersonalInfo() {
    dispatch(clearPersonalInfoRequest());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Steps00blog);
