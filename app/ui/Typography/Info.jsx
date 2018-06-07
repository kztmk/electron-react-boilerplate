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

function Info(props: Props) {
  const { classes, children } = props;
  return (
    <div className={`${classes.defaultFontStyle} ${classes.infoText}`}>
      {children}
    </div>
  );
}

export default withStyles(typographyStyle)(Info);
