// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Card from 'material-ui/Card';
import CardContent from 'material-ui/Card/CardContent';

import pricingCardStyle from '../../asets/jss/material-dashboard-pro-react/components/pricingCardStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  title?: string,
  price?: string,
  description?: string,
  icon?: Function,
  iconColor?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'gray' | 'white',
  plain?: boolean,
  footer?: number | string | React.Element | Array<any>,
  whitePrice?: boolean
};
/* eslint-enable */

function PricingCard(props: Props) {
  const {
    classes,
    title,
    price,
    description,
    plain,
    footer,
    iconColor,
    whitePrice
  } = props;
  const cardClasses =
    `${classes.card
    } ${
      cx({
        [classes.cardPlain]: plain
      })}`;
  const cardPrice =
    `${classes.cardPrice
    } ${
      cx({
        [classes.white]: whitePrice === true && plain
      })}`;
  const iconWrapper =
    `${classes.iconWrapper
    } ${
      cx({
        [classes[iconColor]]: iconColor !== undefined,
        [classes.white]: plain && iconColor === undefined,
        [classes.grayColor]: plain === undefined && iconColor === undefined,
        [classes.iconOnPlain]: plain
      })}`;
  return (
    <Card className={cardClasses}>
      <CardContent className={classes.cardContent}>
        <h6 className={classes.cardTitle}>{title}</h6>
        <div className={iconWrapper}>
          <props.icon className={classes.icon} />
        </div>
        <h3 className={cardPrice}>{price}</h3>
        <p className={classes.cardDescription}>{description}</p>
        {footer}
      </CardContent>
    </Card>
  );
}

PricingCard.defaultProps = {
  whitePrice: true
};

export default withStyles(pricingCardStyle)(PricingCard);
