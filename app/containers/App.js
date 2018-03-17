// @flow
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui';
import appRoutes from '../routes/app.js';
import VerticalNavi from '../components/VerticalNav';
import Footer from '../components/Footer';
import appStyle from '../variables/styles/appStyle';

import logo from '../asets/img/yoriki5.png';

const switchRoutes = auth => (
  <Switch>
    {appRoutes.map((prop, key) => {
      let isRedirect = prop.redirect;
      if (!auth && prop.path !== '/home') {
        isRedirect = true;
      }
      if (isRedirect) return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

class App extends React.Component<Props> {
  props: Props;

  render() {
    const { auth, classes, ...rest } = this.props;
    // const isLoggedIn = this.props.userAuth.userId.length > 0;
    return (
      <div className={classes.wrapper}>
        <VerticalNavi routes={appRoutes} logo={logo} color="purple" {...rest} />
        <div className={classes.mainPanel} ref="mainPanel">
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes(auth)}</div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.Login.userId.length > 0
  };
};

const connectedApp = connect(mapStateToProps)(App);
export default withStyles(appStyle)(connectedApp);
