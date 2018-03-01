// @flow
import { connect } from 'react-redux';
import type Connector from 'react-redux';
import LoginForm, { type Props } from '../../components/Login';
import type { StateType, DispatchType } from '../../types';
import { setAuthInfo, logoutRequest } from './actions';

const mapStateToProps = (state: StateType) => {
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
