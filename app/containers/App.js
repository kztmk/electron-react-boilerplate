// @flow
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui';
import appRoutes from '../routes/app.js';
import VerticalNavi from '../components/VerticalNav';
import Footer from '../components/Footer';
import appStyle from '../variables/styles/appStyle';

import logo from '../asets/img/yoriki5.png';

const switchRoutes = (
  <Switch>
    {appRoutes.map((prop, key) => {
      if (prop.redirect) return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

class App extends React.Component<Props> {
  props: Props;

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>
        <VerticalNavi routes={appRoutes} logo={logo} color="blue" {...rest} />
        <div className={classes.mainPanel} ref="mainPanel">
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(appStyle)(App);
