// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { ConnectedRouter } from 'react-router-redux';
import { Router, Switch, Route } from 'react-router-dom';
import defRoute from '../../routes/defRoute';
import { primaryColor, dangerColor, successColor } from '../../variables/styles';

import App from '../App';

type Props = {
  store: {},
  history: {}
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primaryColor
    },
    error: {
      main: dangerColor
    }
  }
});

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={this.props.history}>
          <MuiThemeProvider theme={theme}>
            <Router history={this.props.history}>
              <Switch>
                {defRoute.map((prop, key) => {
                  return <Route path={prop.path} component={prop.component} key={key} />;
                })}
              </Switch>
            </Router>
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}
