// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { StateType } from '../../types';
import type { DispatchType } from '../app/types';

type Props = {};

class Container extends React.Component<Props> {
  render() {
    const { props } = this;
    return <div>{props}</div>;
  }
}

const mapStateToProps = (state: State) => ({
  TODO: selectors.TODO
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  TODO: actions
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
