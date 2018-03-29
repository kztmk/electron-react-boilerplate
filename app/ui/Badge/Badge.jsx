// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

import badgeStyle from '../../asets/jss/material-dashboard-pro-react/components/badgeStyle';

export type Props = {
  classes: Object,
  color: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
// eslint-disable-next-line react/require-default-props
  children?: React.Node
};

function Badge(props: Props) {
  const { classes, color, children } = props;
  return (
    <span className={`${classes.badge} ${classes[color]}`}>{children}</span>
  );
}

export default withStyles(badgeStyle)(Badge);
