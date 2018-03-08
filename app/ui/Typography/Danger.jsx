/* @flow */
import React from "react";
import { withStyles } from "material-ui";

import typographyStyle from "../../variables/styles/typographyStyle.jsx";

export type Props = { classes: Object };

function Danger(props: Props) {
  const { classes, children } = props;
  return (
    <div className={classes.defaultFontStyle + " " + classes.dangerText}>
      {children}
    </div>
  );
}

export default withStyles(typographyStyle)(Danger);
