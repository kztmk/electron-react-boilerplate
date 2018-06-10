import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import footerStyle from '../../assets/jss/material-dashboard-pro-react/components/footerStyle';

function Footer({ ...props }) {
  const { classes } = props;
  return <footer className={classes.footer} />;
}

export default withStyles(footerStyle)(Footer);
