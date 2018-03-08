// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
//import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { ConnectedRouter } from 'react-router-redux';
import { Router, Switch, Route } from 'react-router-dom';
import defRoute from '../../routes/defRoute';

import App from '../App';

type Props = {
  store: {},
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={this.props.history}>
          <Switch>
            {defRoute.map((prop, key) => {
              return <Route path={prop.path} component={prop.component} key={key} />;
            })}
          </Switch>
        </Router>
      </Provider>
    );
  }
}
