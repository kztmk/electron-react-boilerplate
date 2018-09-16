// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import SettingsPage from '../../components/SettingsPage'


const mapStateToProps = (state: State) => ({
  isLoading: state.AliasMailInfo.isLoading,
  isFailure: state.AliasMailInfo.isFailure,
  errorMessage: state.AliasMailInfo.errorMessage,
  aliasMailInfo: state.AliasMailInfo.aliasMailInfo
});


export default connect(mapStateToProps)(SettingsPage);
