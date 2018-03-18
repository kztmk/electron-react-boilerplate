// @flow
import { connect, type Connector } from 'react-redux';
import HomePage, { type Props } from '../../components/HomePage';
import type { State } from '../../types/state';

const mapStateToProps = (state: State) => {
  return {
    userAuth: state.Login
  };
};

//const connector: Connector<{}, Props> = connect(mapStateToProps);

export default connect(mapStateToProps)(HomePage);