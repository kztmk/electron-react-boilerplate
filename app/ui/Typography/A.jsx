/* @flow */
import React from "react";
import { withStyles } from "material-ui";

import typographyStyle from "../../variables/styles/typographyStyle.jsx";

export type Props = { classes: Object };

function A(props: Props) {
  const { classes, children, ...rest } = props;
  return (
    <a {...rest} className={classes.defaultFontStyle + " " + classes.aStyle}>
      {children}
    </a>
  );
}

export default withStyles(typographyStyle)(A);
