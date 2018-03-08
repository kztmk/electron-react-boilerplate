// @flow
import { connect } from 'react-redux';
import type Connector from 'react-redux';
import LoginForm, { type Props } from '../../components/LoginPage';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import { setAuthInfo, logoutRequest } from './actions';

const mapStateToProps = (state: State) => {
  return {
    userAuth: state.Login
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => ({
  loginStart(userAuth) {
    dispatch(setAuthInfo(userAuth));
  },
  logoutStart() {
    dispatch(logoutRequest());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

//export default connector(LoginForm);
