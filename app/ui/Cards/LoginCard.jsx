// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Card from 'material-ui/Card';
import CardContent from 'material-ui/Card/CardContent';
import CardHeader from 'material-ui/Card/CardHeader';
import CardActions from 'material-ui/Card/CardActions';

import loginCardStyle from '../../asets/jss/material-dashboard-pro-react/components/loginCardStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  plainCard?: boolean,
  classes: Object,
  headerColor?: 'orange' | 'green' | 'red' | 'blue' | 'purple' | 'rose',
  cardTitle?: number | string | React.Element | Array<any>,
  cardSubtitle?: number | string | React.Element | Array<any>,
  content?: number | string | React.Element | Array<any>,
  footer?: number | string | React.Element | Array<any>,
  socials?: number | string | React.Element | Array<any>,
  footerAlign?: 'left' | 'right' | 'center',
  customCardClass?: string
};
/* eslint-enable */

function LoginCard(props: Props) {
  const {
    classes,
    headerColor,
    plainCard,
    cardTitle,
    cardSubtitle,
    content,
    footer,
    socials,
    footerAlign,
    customCardClass
  } = props;
  const plainCardClasses = cx({
    [` ${classes.cardPlain}`]: plainCard,
    [` ${customCardClass}`]: customCardClass !== undefined
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
        subheader={socials}
      />
      <p className={classes.cardSubtitle}>{cardSubtitle}</p>
      <CardContent className={classes.cardContent}>{content}</CardContent>
      {footer !== undefined ? (
        <CardActions
          className={`${classes.cardActions} ${classes[footerAlign]}`}
        >
          {footer}
        </CardActions>
      ) : null}
    </Card>
  );
}

LoginCard.defaultProps = {
  headerColor: 'purple'
};

export default withStyles(loginCardStyle)(LoginCard);
