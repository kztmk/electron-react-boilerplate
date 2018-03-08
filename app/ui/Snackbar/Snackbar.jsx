/* @flow */
import React from "react";
import { withStyles, Snackbar as Snack, IconButton } from "material-ui";
import { Close } from "material-ui-icons";
import cx from "classnames";

import snackbarContentStyle from "../../variables/styles/snackbarContentStyle.jsx";

export type Props = {
  classes: Object,
  message: number | string | React.Element | Array<any>,
  color?: 'info' | 'success' | 'warning' | 'danger' | 'primary',
  close?: boolean,
  icon?: Function,
  place?: 'tl' | 'tr' | 'tc' | 'br' | 'bl' | 'bc',
  open?: boolean,
};

function Snackbar(props: Props) {
  const { classes, message, color, close, icon, place, open } = props;
  var action = [];
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
        onClick={() => props.closeNotification()}
      >
        <Close className={classes.close} />
      </IconButton>
    ];
  }
  return (
    <Snack
      anchorOrigin={{
        vertical: place.indexOf("t") === -1 ? "bottom" : "top",
        horizontal:
          place.indexOf("l") !== -1
            ? "left"
            : place.indexOf("c") !== -1 ? "center" : "right"
      }}
      open={open}
      message={
        <div>
          {icon !== undefined ? <props.icon className={classes.icon} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      action={action}
      SnackbarContentProps={{
        classes: {
          root: classes.root + " " + classes[color],
          message: classes.message
        }
      }}
    />
  );
}

export default withStyles(snackbarContentStyle)(Snackbar);
