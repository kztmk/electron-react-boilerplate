// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

const style = {
  clearfix: {
    '&:after,&:before': {
      display: 'table',
      content: '" "'
    },
    '&:after': {
      clear: 'both'
    }
  }
};

export type Props = { classes: Object };

function Clearfix(props: Props) {
  const { classes } = props;
  return <div className={classes.clearfix} />;
}

export default withStyles(style)(Clearfix);
