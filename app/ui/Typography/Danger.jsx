// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

import typographyStyle from '../../asets/jss/material-dashboard-pro-react/components/typographyStyle';

/* eslint-disable react/require-default-props */
export type Props = {
  classes: Object,
  children?: React.Node
};

function Danger(props: Props) {
  const { classes, children } = props;
  return (
    <div className={`${classes.defaultFontStyle} ${classes.dangerText}`}>
      {children}
    </div>
  );
}

export default withStyles(typographyStyle)(Danger);
