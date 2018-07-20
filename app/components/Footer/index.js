// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import footerStyle from '../../assets/jss/material-dashboard-pro-react/components/footerStyle';

type Props = {
  classes: Object
};

function Footer({ ...props }: Props) {
  const { classes } = props;
  return <footer className={classes.footer} />;
}

export default withStyles(footerStyle)(Footer);
