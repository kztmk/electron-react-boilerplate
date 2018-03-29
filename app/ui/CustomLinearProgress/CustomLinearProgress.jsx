// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import LinearProgress from 'material-ui/Progress/LinearProgress';

import customLinearProgressStyle from '../../asets/jss/material-dashboard-pro-react/components/customLinearProgressStyle';

export type Props = {
  classes: Object,
  color?: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'rose' | 'gray'
};

function CustomLinearProgress(props: Props) {
  const { classes, color, ...rest } = props;
  return (
    <LinearProgress
      {...rest}
      classes={{
        root: `${classes.root} ${classes[`${color}Background`]}`,
        bar: `${classes.bar} ${classes[color]}`
      }}
    />
  );
}

CustomLinearProgress.defaultProps = {
  color: 'gray'
};

export default withStyles(customLinearProgressStyle)(CustomLinearProgress);
