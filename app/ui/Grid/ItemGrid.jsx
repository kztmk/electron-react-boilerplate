import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Grid from 'material-ui/Grid';

const style = {
  grid: {
    padding: '0 15px !important'
  }
};

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  children?: React.Node,
  className?: string
}
/* eslint-enable */

function ItemGrid(props: Props) {
  const {
    classes, children, className, ...rest
  } = props;
  return (
    <Grid item {...rest} className={`${classes.grid} ${className}`}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(ItemGrid);
