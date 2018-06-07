// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Card from 'material-ui/Card';
import CardContent from 'material-ui/Card/CardContent';
import CardHeader from 'material-ui/Card/CardHeader';

import regularCardStyle from '../../assets/jss/material-dashboard-pro-react/components/regularCardStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  customCardClasses?: string,
  customCardTitleClasses?: string,
  plainCard?: boolean,
  cardTitle?: number | string | React.Element | Array<any>,
  cardSubtitle?: number | string | React.Element | Array<any>,
  content?: number | string | React.Element | Array<any>,
  titleAlign?: 'right' | 'left' | 'center',
  contentAlign?: 'right' | 'left' | 'center',
  subtitleAlign?: 'right' | 'left' | 'center'
};
/* eslint-enable */

function RegularCard(props: Props) {
  const {
    classes,
    plainCard,
    cardTitle,
    cardSubtitle,
    content,
    titleAlign,
    customCardClasses,
    contentAlign,
    subtitleAlign,
    customCardTitleClasses
  } = props;
  const cardClasses =
    classes.card +
    cx({
      [` ${classes.cardPlain}`]: plainCard,
      [` ${customCardClasses}`]: customCardClasses !== undefined
    });
  return (
    <Card className={cardClasses}>
      {cardTitle !== undefined || cardSubtitle !== undefined ? (
        <CardHeader
          classes={{
            root: classes.cardHeader,
            title: `${classes.cardTitle} ${classes[titleAlign]} ${customCardTitleClasses}`,
            subheader: `${classes.cardSubtitle} ${classes[subtitleAlign]}`
          }}
          title={cardTitle}
          subheader={cardSubtitle}
        />
      ) : null}
      <CardContent
        className={`${classes.cardContent} ${classes[contentAlign]}`}
      >
        {content}
      </CardContent>
    </Card>
  );
}

export default withStyles(regularCardStyle)(RegularCard);
