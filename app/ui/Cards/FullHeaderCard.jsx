// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Card from 'material-ui/Card';
import CardContent from 'material-ui/Card/CardContent';
import CardHeader from 'material-ui/Card/CardHeader';
import CardActions from 'material-ui/Card/CardActions';

import fullHeaderCardStyle from '../../assets/jss/material-dashboard-pro-react/components/fullHeaderCardStyle';

/* eslint-disable */
// react/require-default-props
export type Props = {
  plainCard?: boolean,
  classes: Object,
  headerColor?: 'orange' | 'green' | 'red' | 'blue' | 'purple' | 'rose',
  cardTitle?: number | string | React.Element | Array<any>,
  cardSubtitle?: number | string | React.Element | Array<any>,
  content?: number | string | React.Element | Array<any>,
  footer?: number | string | React.Element | Array<any>
};
/* eslint-enable */

function FullHeaderCard(props: Props) {
  const {
    classes,
    headerColor,
    plainCard,
    cardTitle,
    cardSubtitle,
    content,
    footer
  } = props;
  const plainCardClasses = cx({
    [` ${classes.cardPlain}`]: plainCard
  });
  const cardPlainHeaderClasses = cx({
    [` ${classes.cardPlainHeader}`]: plainCard
  });
  return (
    <Card className={classes.card + plainCardClasses}>
      <CardHeader
        classes={{
          root:
            `${classes.cardHeader
            } ${
            classes[`${headerColor}CardHeader`]
            }${cardPlainHeaderClasses}`,
          title: classes.cardTitle,
          subheader: classes.cardSubtitle
        }}
        title={cardTitle}
        subheader={cardSubtitle}
      />
      <CardContent className={classes.cardContent}>{content}</CardContent>
      {footer !== undefined ? (
        <CardActions className={classes.cardActions}>{footer}</CardActions>
      ) : null}
    </Card>
  );
}

FullHeaderCard.defaultProps = {
  headerColor: 'purple'
};

export default withStyles(fullHeaderCardStyle)(FullHeaderCard);
