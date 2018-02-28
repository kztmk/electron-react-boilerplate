// @flow
import { connect } from 'react-redux';
import type Connector from 'react-redux';
import LoginForm, { type Props } from '../../components/Login';
import type { DispatchType } from '../../types';
import { setAuthInfo } from './actions';

const mapStateToProps = state => ({
  userAuth: state.Login
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  onClick(userAuth) {
    dispatch(setAuthInfo(userAuth));
  }
});

const connector: Connector<{}, Props> = connect(mapStateToProps, mapDispatchToProps);

export default connector(LoginForm);
