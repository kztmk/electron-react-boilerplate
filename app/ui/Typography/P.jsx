/* @flow */
import React from "react";
import { withStyles } from "material-ui";

import typographyStyle from "../../variables/styles/typographyStyle.jsx";

export type Props = { classes: Object };

function P(props: Props) {
  const { classes, children } = props;
  return (
    <p className={classes.defaultFontStyle + " " + classes.pStyle}>
      {children}
    </p>
  );
}

export default withStyles(typographyStyle)(P);
