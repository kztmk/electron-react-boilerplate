// @flow
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import appRoutes from '../routes/app';
import VerticalNavi from '../components/VerticalNav';
import Footer from '../components/Footer';
import appStyle from '../assets/jss/material-dashboard-pro-react/layouts/dashboardStyle';

import logo from '../assets/img/yoriki5.png';

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

  getRoute() {
    return this.props.location.pathname.includes('views');
  }

  render() {
    const { auth, classes, ...rest } = this.props;
    // const isLoggedIn = this.props.userAuth.userId.length > 0;
    return (
      <div className={classes.wrapper}>
        <VerticalNavi routes={appRoutes} logo={logo} color="purple" {...rest} />
        <div className={classes.mainPanel} ref="mainPanel">
          {this.getRoute() ? (
            <div className={classes.mainContent}>{switchRoutes(auth)}</div>
          ) : (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes(auth)}</div>
            </div>
          )}
          <Footer />
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
