// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

import typographyStyle from '../../assets/jss/material-dashboard-pro-react/components/typographyStyle';

/* eslint-disable react/require-default-props */
export type Props = {
  classes: Object,
  children: React.Node
};

function Muted(props: Props) {
  const { classes, children } = props;
  return (
    <div className={`${classes.defaultFontStyle} ${classes.mutedText}`}>
      {children}
    </div>
  );
}

export default withStyles(typographyStyle)(Muted);
