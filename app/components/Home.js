// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import MenuAppBar from './AppBar/';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <MenuAppBar />
        <Typography variant="display3">Home</Typography>
        <Typography variant="body1">
          <Link to="/counter">to Counter</Link>
        </Typography>
      </div>
    );
  }
}
