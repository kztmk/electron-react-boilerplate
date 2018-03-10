// @flow
import * as React from 'react';
import { connect, type Connector } from 'react-redux';
import type { DispatchType } from '../../types';
import type { State } from '../../types/state';
import type { AuthType } from '../../types/auth';
import { setAuthInfo } from './actions';

import FormResetPassword from '../../components/FormLogin/formRestPassword';

const mapStateToProps = (state: State) => {
  return {
    userAuth: state.ResetPassword
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => ({
  resetPasswordStart(userAuth: AuthType) {
    dispatch(setAuthInfo(userAuth));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FormResetPassword);

//export default conn(FormResetPassword);
