/* @flow */
import React from "react";
import { withStyles } from "material-ui";

import typographyStyle from "../../variables/styles/typographyStyle.jsx";

export type Props = { classes: Object };

function Success(props: Props) {
  const { classes, children } = props;
  return (
    <div className={classes.defaultFontStyle + " " + classes.successText}>
      {children}
    </div>
  );
}

export default withStyles(typographyStyle)(Success);
