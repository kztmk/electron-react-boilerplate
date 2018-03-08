/* @flow */
import React from "react";
import { withStyles, IconButton } from "material-ui";

import iconButtonStyle from "../../variables/styles/iconButtonStyle";

export type Props = {
  classes: Object,
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'white' | 'simple',
  customClass?: string,
  disabled?: boolean,
};

function IconCustomButton(props: Props) {
  const { classes, color, children, customClass, ...rest } = props;
  return (
    <IconButton
      {...rest}
      className={
        classes.button +
        (color ? " " + classes[color] : "") +
        (customClass ? " " + customClass : "")
      }
    >
      {children}
    </IconButton>
  );
}

export default withStyles(iconButtonStyle)(IconCustomButton);
