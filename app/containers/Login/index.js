// @flow
import { connect } from 'react-redux';
import LoginForm from '../../components/FormLogin';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import { setAuthInfo, logoutRequest } from './actions';

const mapStateToProps = (state: State) => ({
  userAuth: state.Login
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  loginStart(userAuth) {
    dispatch(setAuthInfo(userAuth));
  },
  logoutStart() {
    dispatch(logoutRequest());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

// export default connector(LoginForm);
