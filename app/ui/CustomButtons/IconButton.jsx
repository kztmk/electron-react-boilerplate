// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import IconButton from 'material-ui/IconButton';

import iconButtonStyle from '../../asets/jss/material-dashboard-pro-react/components/iconButtonStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'white' | 'simple' | 'defaultNoBackground' | 'primaryNoBackground' | 'infoNoBackground' | 'successNoBackground' | 'warningNoBackground' | 'dangerNoBackground' | 'roseNoBackground' | 'twitter' | 'twitterNoBackground' | 'facebook' | 'facebookNoBackground' | 'google' | 'googleNoBackground' | 'linkedin' | 'linkedinNoBackground' | 'pinterest' | 'pinterestNoBackground' | 'youtube' | 'youtubeNoBackground' | 'tumblr' | 'tumblrNoBackground' | 'github' | 'githubNoBackground' | 'behance' | 'behanceNoBackground' | 'dribbble' | 'dribbbleNoBackground' | 'reddit' | 'redditNoBackground',
  customClass?: string,
  disabled?: boolean,
  children?: React.Node
};
/* eslint-enable */

function IconCustomButton(props: Props) {
  const {
    classes, color, children, customClass, ...rest
  } = props;
  const buttonClasses =
    classes.button +
    cx({
      [` ${classes[color]}`]: color,
      [` ${customClass}`]: customClass
    });
  return (
    <IconButton {...rest} className={buttonClasses}>
      {children}
    </IconButton>
  );
}

export default withStyles(iconButtonStyle)(IconCustomButton);
