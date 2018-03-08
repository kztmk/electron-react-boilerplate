/* @flow */
import React from "react";
import { withStyles, Button } from "material-ui";
import cx from "classnames";

import buttonStyle from "../../variables/styles/buttonStyle";

export type Props = {
  classes: Object,
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'white' | 'simple' | 'transparent',
  round?: boolean,
  fullWidth?: boolean,
  disabled?: boolean,
};

function RegularButton(props: Props) {
  const {
    classes,
    color,
    round,
    children,
    fullWidth,
    disabled,
    ...rest
  } = props;
  const btnClasses = cx({
    [classes[color]]: color,
    [classes.round]: round,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled
  });
  return (
    <Button {...rest} className={classes.button + " " + btnClasses}>
      {children}
    </Button>
  );
}

export default withStyles(buttonStyle)(RegularButton);
