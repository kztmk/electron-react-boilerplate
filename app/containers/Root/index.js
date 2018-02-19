// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../../routes';
import theme from '../../styles/styleTheme';

type Props = {
  store: {},
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <MuiThemeProvider theme={theme}>
          <ConnectedRouter history={this.props.history}>
            <Routes />
          </ConnectedRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
}
