// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Snack from 'material-ui/Snackbar/SnackbarContent';
import IconButton from 'material-ui/IconButton';

// material-ui-icons
import Close from 'material-ui-icons/Close';

import snackbarContentStyle from '../../asets/jss/material-dashboard-pro-react/components/snackbarContentStyle';

/* eslint-disable react/require-default-props */
export type Props = {
  classes: Object,
  message: number | string | React.Element | Array<any>,
  color?: 'info' | 'success' | 'warning' | 'danger' | 'primary' | 'rose',
  close?: boolean,
  icon?: Function
};

function SnackbarContent(props: Props) {
  const {
    classes, message, color, close, icon
  } = props;
  let action = [];
  const messageClasses = cx({
    [classes.iconMessage]: icon !== undefined
  });
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
      >
        <Close className={classes.close} />
      </IconButton>
    ];
  }
  const iconClasses = cx({
    [classes.icon]: classes.icon,
    [classes.infoIcon]: color === 'info',
    [classes.successIcon]: color === 'success',
    [classes.warningIcon]: color === 'warning',
    [classes.dangerIcon]: color === 'danger',
    [classes.primaryIcon]: color === 'primary',
    [classes.roseIcon]: color === 'rose'
  });
  return (
    <Snack
      message={
        <div>
          {icon !== undefined ? <props.icon className={iconClasses} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      classes={{
        root: `${classes.root} ${classes[color]}`,
        message: classes.message,
      }}
      action={action}
    />
  );
}

SnackbarContent.defaultProps = {
  color: 'info'
};

export default withStyles(snackbarContentStyle)(SnackbarContent);
