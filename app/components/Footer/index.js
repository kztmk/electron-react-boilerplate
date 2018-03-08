import React from 'react';
import { withStyles } from 'material-ui';
import footerStyle from '../../variables/styles/footerStyle';

function Footer({ ...props }) {
  const { classes } = props;
  return <footer className={classes.footer} />;
}

export default withStyles(footerStyle)(Footer);
