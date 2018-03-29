// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Card from 'material-ui/Card';
import CardContent from 'material-ui/Card/CardContent';
import CardHeader from 'material-ui/Card/CardHeader';

import iconCardStyle from '../../asets/jss/material-dashboard-pro-react/components/iconCardStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  icon: Function,
  iconColor?: 'orange' | 'green' | 'red' | 'blue' | 'purple' | 'rose',
  title?: number | string | React.Element | Array<any>,
  category?: number | string | React.Element | Array<any>,
  content?: number | string | React.Element | Array<any>,
  footer?: number | string | React.Element | Array<any>,
  plain?: boolean,
  customCardContentClass?: string
};
/* eslint-enable */

function IconCard(props: Props) {
  const {
    classes,
    title,
    content,
    iconColor,
    category,
    footer,
    plain,
    customCardContentClass
  } = props;
  const cardClasses =
    `${classes.card
    } ${
      cx({
        [classes.cardPlain]: plain
      })}`;
  const cardContentClasses =
    `${classes.cardContent
    } ${
      cx({
        [customCardContentClass]: customCardContentClass !== undefined
      })}`;
  return (
    <Card className={cardClasses}>
      <CardHeader
        classes={{
          root: `${classes.cardHeader} ${classes[`${iconColor}CardHeader`]}`,
          avatar: classes.cardAvatar
        }}
        avatar={<props.icon className={classes.cardIcon} />}
      />
      <CardContent className={cardContentClasses}>
        <h4 className={classes.cardTitle}>
          {title}
          {category !== undefined ? (
            <small className={classes.cardCategory}>{category}</small>
          ) : null}
        </h4>
        {content}
      </CardContent>
      {footer !== undefined ? (
        <div className={classes.cardFooter}>{footer}</div>
      ) : null}
    </Card>
  );
}

IconCard.defaultProps = {
  iconColor: 'purple',
};

export default withStyles(iconCardStyle)(IconCard);
