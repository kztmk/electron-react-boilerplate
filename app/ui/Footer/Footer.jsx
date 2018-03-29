// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';

import footerStyle from '../../asets/jss/material-dashboard-pro-react/components/footerStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  fluid?: boolean,
  white?: boolean,
  rtlActive?: boolean
};
/* eslint-enable */

function Footer(props: Props) {
  const {
    classes, fluid, white
  } = props;
  const container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white
  });
  const anchor =
    classes.a +
    cx({
      [` ${classes.whiteColor}`]: white
    });
  const block = cx({
    [classes.block]: true,
    [classes.whiteColor]: white
  });
  return (
    <footer className={classes.footer}>
      <div className={container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="#home" className={block}>
                {'Home'}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#company" className={block}>
                {'Company'}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#portfolio" className={block}>
                {'Portfolio'}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#blog" className={block}>
                {'Blog'}
              </a>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          &copy; {1900 + new Date().getYear()}{' '}
          <a href="http://v5.yoriki.cloud" className={anchor}>
            {'Support'}
          </a>
          {'made with love for a better web'}
        </p>
      </div>
    </footer>
  );
}

export default withStyles(footerStyle)(Footer);
