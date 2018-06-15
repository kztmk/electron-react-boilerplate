// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import type { DispatchType } from '../../types';
import { getPersonalInfoRequest, savePersonalInfoRequest } from './actions';
import PreferencesPage from '../../components/FormSettings';
import type PersonalInfoType from '../../types/personalInfo';

const mapStateToProps = (state: State) => ({
  isLoading: state.PersonalInfo.isLoading,
  isFailure: state.PersonalInfo.isFailure,
  errorMessage: state.PersonalInfo.errorMessage,
  personalInfo: state.PersonalInfo.personalInfo
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startGetPersonalInfo() {
    dispatch(getPersonalInfoRequest());
  },
  startSavePersonalInfo(personalInfo: PersonalInfoType) {
    dispatch(savePersonalInfoRequest(personalInfo));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesPage);
