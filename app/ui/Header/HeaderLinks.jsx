// @flow
import React from 'react';
import classNames from 'classnames';
import { Manager, Target, Popper } from 'react-popper';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import MenuItem from 'material-ui/Menu/MenuItem';
import MenuList from 'material-ui/Menu/MenuList';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Paper from 'material-ui/Paper';
import Grow from 'material-ui/transitions/Grow';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';

// material-ui-icons
import Person from 'material-ui-icons/Person';
import Notifications from 'material-ui-icons/Notifications';
import Dashboard from 'material-ui-icons/Dashboard';
import Search from 'material-ui-icons/Search';

// core components
import CustomInput from '../CustomInput/CustomInput';
import SearchButton from '../CustomButtons/IconButton';

import headerLinksStyle from '../../asets/jss/material-dashboard-pro-react/components/headerLinksStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
};
/* eslint-enable */

class HeaderLinks extends React.Component {
  props: Props;
  state = {
    open: false
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    const { open } = this.state;
    const searchButton =
      `${classes.top
      } ${
        classes.searchButton
      }`;
    const wrapper = '';
    const dropdownItem =
      `${classes.dropdownItem
      }`;
    const managerClasses = classNames({
      [classes.managerClasses]: true
    });
    return (
      <div className={wrapper}>
        <CustomInput
          formControlProps={{
            className: `${classes.top} ${classes.search}`
          }}
          inputProps={{
            placeholder: 'Search',
            inputProps: {
              'aria-label': 'Search',
              className: classes.searchInput
            }
          }}
        />
        <SearchButton
          color="white"
          aria-label="edit"
          customClass={searchButton}
        >
          <Search className={classes.searchIcon} />
        </SearchButton>
        <IconButton
          color="inherit"
          aria-label="Dashboard"
          className={classes.buttonLink}
          classes={{
            label: ''
          }}
        >
          <Dashboard className={classes.links} />
          <Hidden mdUp>
            <p className={classes.linkText}>
              Dashboard
            </p>
          </Hidden>
        </IconButton>
        <Manager className={managerClasses}>
          <Target>
            <IconButton
              color="inherit"
              aria-label="Notifications"
              aria-owns={open ? 'menu-list' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
              className={classes.buttonLink}
            >
              <Notifications className={classes.links} />
              <span className={classes.notifications}>5</span>
              <Hidden mdUp>
                <p onClick={this.handleClick} className={classes.linkText}>
                  Notification
                </p>
              </Hidden>
            </IconButton>
          </Target>
          <Popper
            placement="bottom-start"
            eventsEnabled={open}
            className={
              `${classNames({ [classes.popperClose]: !open })
              } ${
              classes.pooperResponsive}`
            }
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow
                in={open}
                id="menu-list"
                style={{ transformOrigin: '0 0 0' }}
              >
                <Paper className={classes.dropdown}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      Mike John responded to your email
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      You have 5 new tasks
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                        You're now friend with Andrew
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      Another Notification
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      Another One
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
        <IconButton
          color="inherit"
          aria-label="Person"
          className={classes.buttonLink}
        >
          <Person className={classes.links} />
          <Hidden mdUp>
            <p className={classes.linkText}>
              Profile
            </p>
          </Hidden>
        </IconButton>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
