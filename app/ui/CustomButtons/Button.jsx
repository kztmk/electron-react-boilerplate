// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button';

import buttonStyle from '../../asets/jss/material-dashboard-pro-react/components/buttonStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'defaultNoBackground' | 'primaryNoBackground' | 'infoNoBackground' | 'successNoBackground' | 'warningNoBackground' | 'dangerNoBackground' | 'roseNoBackground' | 'twitter' | 'twitterNoBackground' | 'facebook' | 'facebookNoBackground' | 'google' | 'googleNoBackground' | 'linkedin' | 'linkedinNoBackground' | 'pinterest' | 'pinterestNoBackground' | 'youtube' | 'youtubeNoBackground' | 'tumblr' | 'tumblrNoBackground' | 'github' | 'githubNoBackground' | 'behance' | 'behanceNoBackground' | 'dribbble' | 'dribbbleNoBackground' | 'reddit' | 'redditNoBackground' | 'white' | 'simple' | 'transparent',
  round?: boolean,
  fullWidth?: boolean,
  disabled?: boolean,
  customClass?: string,
  // make the button's min width to 160px
  wd?: boolean,
  // make the button smaller
  justIcon?: boolean,
  // button will float right
  right?: boolean,
  size?: 'sm' | 'lg' | 'xs',
  children?: React.Node
};
/* eslint-enable */

function RegularButton(props: Props) {
  const {
    classes,
    color,
    round,
    children,
    fullWidth,
    disabled,
    customClass,
    right,
    justIcon,
    size,
    wd,
    ...rest
  } = props;
  const btnClasses = cx({
    [classes[color]]: color,
    [classes.round]: round,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled,
    [customClass]: customClass,
    [classes.right]: right,
    [classes.justIcon]: justIcon,
    [classes.wd]: wd,
    [classes[size]]: size
  });
  return (
    <Button {...rest} className={`${classes.button} ${btnClasses}`}>
      {children}
    </Button>
  );
}

export default withStyles(buttonStyle)(RegularButton);
