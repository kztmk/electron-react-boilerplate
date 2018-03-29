// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Card from 'material-ui/Card';
import CardContent from 'material-ui/Card/CardContent';

// material-ui-icons
import FormatQuote from 'material-ui-icons/FormatQuote';

import testimonialCardStyle from '../../asets/jss/material-dashboard-pro-react/components/testimonialCardStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  cardDescription?: string,
  cardTitle?: string,
  cardSubtitle?: string,
  imageAlt?: string,
  image?: string
};
/* eslint-enable */

function TestimonialCard(props: Props) {
  const {
    classes,
    cardDescription,
    cardTitle,
    cardSubtitle,
    imageAlt,
    image
  } = props;
  return (
    <Card className={classes.card}>
      <div className={classes.iconWrapper}>
        <FormatQuote className={classes.icon} />
      </div>
      <CardContent className={classes.cardContent}>
        <h5 className={classes.cardDescription}>{cardDescription}</h5>
      </CardContent>
      <div className={classes.footer}>
        <h4 className={classes.cardTitle}>{cardTitle}</h4>
        <h6 className={classes.cardCategory}>{cardSubtitle}</h6>
        <div className={classes.cardAvatar}>
          <img className={classes.img} alt={imageAlt} src={image} />
        </div>
      </div>
    </Card>
  );
}

TestimonialCard.defaultProps = {
  whitePrice: true
};

export default withStyles(testimonialCardStyle)(TestimonialCard);
