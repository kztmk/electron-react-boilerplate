// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import type { DispatchType } from '../../types';
import { getSettingsRequest, updateSettingsRequest } from './actions';
import SettingsPage from '../../components/SettingsPage';

const mapStateToProps = (state: State) => ({
  isLoading: state.Settings.isLoading,
  settings: state.Settings.settings,
  isFailure: state.Settings.isFailure,
  errorMessage: state.Settings.errorMessage
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startUpdateSettings(settings) {
    dispatch(updateSettingsRequest(settings));
  },
  startGetSettings() {
    dispatch(getSettingsRequest());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
