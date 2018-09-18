// @flow
import { connect } from 'react-redux';
import type { State } from '../../types/state';
import SettingsPage from '../../components/SettingsPage';
import type { DispatchType } from '../../types';
import { closeConnectionRequest } from '../MailAccount/actions';

const mapStateToProps = (state: State) => ({
  isLoading: state.AliasMailInfo.isLoading,
  isFailure: state.AliasMailInfo.isFailure,
  errorMessage: state.AliasMailInfo.errorMessage,
  aliasMailInfo: state.AliasMailInfo.aliasMailInfo
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  closeImapConnection() {
    dispatch(closeConnectionRequest());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
