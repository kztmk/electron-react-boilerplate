import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Grid from 'material-ui/Grid';

const style = {
  grid: {
    margin: '0 -15px',
    width: 'calc(100% + 30px)'
    // '&:before,&:after':{
    //   display: 'table',
    //   content: '" "',
    // },
    // '&:after':{
    //   clear: 'both',
    // }
  }
};

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  className?: string,
  children?: React.Node
}
/* eslint-enable */

function GridContainer(props: Props) {
  const {
    classes, children, className, ...rest
  } = props;
  return (
    <Grid container {...rest} className={`${classes.grid} ${className}`}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(GridContainer);
