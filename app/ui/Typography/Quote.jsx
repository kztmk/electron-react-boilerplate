// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

import typographyStyle from '../../asets/jss/material-dashboard-pro-react/components/typographyStyle';

/* eslint-disable react/require-default-props */
export type Props = {
  classes: Object,
  text?: number | string | React.Element | Array<any>,
  author?: number | string | React.Element | Array<any>
};

function Quote(props: Props) {
  const { classes, text, author } = props;
  return (
    <blockquote className={`${classes.defaultFontStyle} ${classes.quote}`}>
      <p className={classes.quoteText}>{text}</p>
      <small className={classes.quoteAuthor}>{author}</small>
    </blockquote>
  );
}

export default withStyles(typographyStyle)(Quote);
