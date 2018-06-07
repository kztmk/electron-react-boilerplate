// @flow
import React from 'react';
import NavLink from 'react-router-dom/NavLink';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemIcon from 'material-ui/List/ListItemIcon';
import ListItemText from 'material-ui/List/ListItemText';
import Hidden from 'material-ui/Hidden';
import Collapse from 'material-ui/transitions/Collapse';

// core components
import HeaderLinks from '../Header/HeaderLinks';
import SidebarWrapper from './SidebarWrapper';

import sidebarStyle from '../../assets/jss/material-dashboard-pro-react/components/sidebarStyle';

import avatar from '../../assets/img/faces/avatar.jpg';
import type { RouteType } from '../../types/route';


// react/require-default-props
/* eslint-disable */
export type SidebarProps = {
  classes: Object,
  bgColor?: 'white' | 'black' | 'blue',
  rtlActive?: boolean,
  color?: 'white' | 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'rose',
  logo?: string,
  logoText?: string,
  image?: string,
  routes?: Array<RouteType>,
  handleDrawerToggle: Function,
  open: boolean,
  miniActive: boolean
};
/* eslint-enable */

class Sidebar extends React.Component {
  props: SidebarProps;
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      openAvatar: false,
      openComponents: this.activeRoute('/components'),
      openForms: this.activeRoute('/forms'),
      openTables: this.activeRoute('/tables'),
      openMaps: this.activeRoute('/maps'),
      openPages: this.activeRoute('-page'),
      miniActive: true
    };
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1;
  }
  openCollapse(collapse) {
    const st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }
  /* eslint-disable prefer-template */
  render() {
    const {
      classes,
      color,
      logo,
      image,
      logoText,
      routes,
      bgColor
    } = this.props;
    const itemText =
      classes.itemText +
      ' ' +
      cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive
      });
    const collapseItemText =
      classes.collapseItemText +
      ' ' +
      cx({
        [classes.collapseItemTextMini]:
          this.props.miniActive && this.state.miniActive
      });
    const userWrapperClass =
      classes.user +
      ' ' +
      cx({
        [classes.whiteAfter]: bgColor === 'white'
      });
    const caret = classes.caret;
    const collapseItemMini = classes.collapseItemMini;
    const photo = classes.photo;
    const user = (
      <div className={userWrapperClass}>
        <div className={photo}>
          <img src={avatar} className={classes.avatarImg} alt="..." />
        </div>
        <List className={classes.list}>
          <ListItem className={classes.item + ' ' + classes.userItem}>
            <NavLink
              to="#"
              className={classes.itemLink + ' ' + classes.userCollapseButton}
              onClick={() => this.openCollapse('openAvatar')}
            >
              <ListItemText
                primary="Tania Andrew"
                secondary={
                  <b
                    className={
                      caret + ' ' + classes.userCaret +
                      ' ' +
                      (this.state.openAvatar ? classes.caretActive : '')
                    }
                  />
                }
                disableTypography
                className={itemText + ' ' + classes.userItemText}
              />
            </NavLink>
            <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={classes.list + ' ' + classes.collapseList}>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      classes.itemLink + ' ' + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      MP
                    </span>
                    <ListItemText
                      primary="My Profile"
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      classes.itemLink + ' ' + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      EP
                    </span>
                    <ListItemText
                      primary="Edit Profile"
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      classes.itemLink + ' ' + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      S
                    </span>
                    <ListItemText
                      primary="Settings"
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    );

    const links = (
      <List className={classes.list}>
        {routes.map((prop, key) => {
          if (prop.redirect) {
            return null;
          }
          if (prop.collapse) {
            const navLinkClasses =
              classes.itemLink +
              ' ' +
              cx({
                [' ' + classes.collapseActive]: this.activeRoute(prop.path)
              });
            const itemText =
              classes.itemText +
              ' ' +
              cx({
                [classes.itemTextMini]:
                  this.props.miniActive && this.state.miniActive
              });
            const collapseItemText =
              classes.collapseItemText +
              ' ' +
              cx({
                [classes.collapseItemTextMini]:
                  this.props.miniActive && this.state.miniActive
              });
            const itemIcon = classes.itemIcon;
            const caret = classes.caret;

            return (
              <ListItem key={key} className={classes.item}>
                <NavLink
                  to="#"
                  className={navLinkClasses}
                  onClick={() => this.openCollapse(prop.state)}
                >
                  <ListItemIcon className={itemIcon}>
                    <prop.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.name}
                    secondary={
                      <b
                        className={
                          caret +
                          ' ' +
                          (this.state[prop.state] ? classes.caretActive : '')
                        }
                      />
                    }
                    disableTypography
                    className={itemText}
                  />
                </NavLink>
                <Collapse in={this.state[prop.state]} unmountOnExit>
                  <List className={classes.list + ' ' + classes.collapseList}>
                    {prop.views.map((prop, key) => {
                      if (prop.redirect) {
                        return null;
                      }
                      const navLinkClasses =
                        classes.collapseItemLink +
                        ' ' +
                        cx({
                          [' ' + classes[color]]: this.activeRoute(prop.path)
                        });
                      const collapseItemMini = classes.collapseItemMini;
                      return (
                        <ListItem key={key} className={classes.collapseItem}>
                          <NavLink to={prop.path} className={navLinkClasses}>
                            <span className={collapseItemMini}>
                              {prop.mini}
                            </span>
                            <ListItemText
                              primary={prop.name}
                              disableTypography
                              className={collapseItemText}
                            />
                          </NavLink>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </ListItem>
            );
          }
          const navLinkClasses =
            classes.itemLink +
            ' ' +
            cx({
              [' ' + classes[color]]: this.activeRoute(prop.path)
            });
          const itemText =
            classes.itemText +
            ' ' +
            cx({
              [classes.itemTextMini]:
                this.props.miniActive && this.state.miniActive
            });
          const itemIcon = classes.itemIcon;
          return (
            <ListItem key={key} className={classes.item}>
              <NavLink to={prop.path} className={navLinkClasses}>
                <ListItemIcon className={itemIcon}>
                  <prop.icon />
                </ListItemIcon>
                <ListItemText
                  primary={prop.name}
                  disableTypography
                  className={itemText}
                />
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    );

    const logoNormal =
      classes.logoNormal +
      ' ' +
      cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive
      });
    const logoMini = classes.logoMini;
    const logoClasses =
      classes.logo +
      ' ' +
      cx({
        [classes.whiteAfter]: bgColor === 'white'
      });
    const brand = (
      <div className={logoClasses}>
        <a href="http://www.creative-tim.com" className={logoMini}>
          <img src={logo} alt="logo" className={classes.img} />
        </a>
        <a href="http://www.creative-tim.com" className={logoNormal}>
          {logoText}
        </a>
      </div>
    );
    const drawerPaper = classes.drawerPaper;
    const sidebarWrapper =
      classes.sidebarWrapper +
      ' ' +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
          navigator.platform.indexOf('Win') > -1
      });
    return (
      <div ref="mainPanel">
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="right"
            open={this.props.open}
            classes={{
              paper: drawerPaper + ' ' + classes[bgColor + 'Background']
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              headerLinks={<HeaderLinks />}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: 'url(' + image + ')' }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor="left"
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + ' ' + classes[bgColor + 'Background']
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: 'url(' + image + ')' }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: 'blue'
};

export default withStyles(sidebarStyle)(Sidebar);
