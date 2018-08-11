// @flow
import { connect } from 'react-redux';
import LogoutButton from '../../components/Logout/LogoutButton';
import type { DispatchType } from '../../types';
import { logoutRequest } from '../Login/actions';

const mapDispatchToProps = (dispatch: DispatchType) => ({
  logoutStart() {
    dispatch(logoutRequest());
  }
});

export default connect(
  null,
  mapDispatchToProps
)(LogoutButton);
