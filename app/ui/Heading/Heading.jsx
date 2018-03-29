// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

import headingStyle from '../../asets/jss/material-dashboard-pro-react/components/headingStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  title?: number | string | React.Element | Array<any>,
  category?: number | string | React.Element | Array<any>,
  textAlign?: 'right' | 'left' | 'center'
};
/* eslint-enable */

function Heading(props: Props) {
  const {
    textAlign, category, title, classes
  } = props;
  const heading =
    `${classes.heading
    } ${
      cx({
        [classes[`${textAlign}TextAlign`]]: textAlign !== undefined
      })}`;
  if (title !== undefined || category !== undefined) {
    return (
      <div className={heading}>
        {title !== undefined ? (
          <h3 className={classes.title}>{title}</h3>
        ) : null}
        {category !== undefined ? (
          <p className={classes.category}>{category}</p>
        ) : null}
      </div>
    );
  }
  return null;
}

export default withStyles(headingStyle)(Heading);
