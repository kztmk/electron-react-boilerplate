// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';

// material-ui icons
import Menu from 'material-ui-icons/Menu';
import MoreVert from 'material-ui-icons/MoreVert';
import ViewList from 'material-ui-icons/ViewList';

// core components
import HeaderLinks from './HeaderLinks';
import CustomIconButton from '../CustomButtons/IconButton';

import headerStyle from '../../asets/jss/material-dashboard-pro-react/components/headerStyle';
import type { RouteType } from '../../types/route';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes?: Object,
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger',
  rtlActive?: boolean,
  routes?: RouteType,
  miniActive: boolean,
  sidebarMinimize: Function,
  handleDrawerToggle: Function
};
/* eslint-enable */

function Header(props: Props) {
  function makeBrand() {
    let name;
    props.routes.map((prop, key) => {
      if (prop.collapse) {
        prop.views.map((prop, key) => {
          if (prop.path === props.location.pathname) {
            name = prop.name;
          }
          return null;
        });
      }
      if (prop.path === props.location.pathname) {
        name = prop.name;
      }
      return null;
    });
    return name;
  }
  const { classes, color, rtlActive } = props;
  const appBarClasses = cx({
    [` ${classes[color]}`]: color
  });
  const sidebarMinimize =
    `${classes.sidebarMinimize
    } ${
      cx({
        [classes.sidebarMinimizeRTL]: rtlActive
      })}`;
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown>
          <div className={sidebarMinimize}>
            {props.miniActive ? (
              <CustomIconButton color="white" onClick={props.sidebarMinimize}>
                <ViewList className={classes.sidebarMiniIcon} />
              </CustomIconButton>
            ) : (
              <CustomIconButton color="white" onClick={props.sidebarMinimize}>
                <MoreVert className={classes.sidebarMiniIcon} />
              </CustomIconButton>
            )}
          </div>
        </Hidden>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button href="#" className={classes.title}>
            {makeBrand()}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <HeaderLinks rtlActive={rtlActive} />
        </Hidden>
        <Hidden mdUp>
          <IconButton
            className={classes.appResponsive}
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(headerStyle)(Header);
