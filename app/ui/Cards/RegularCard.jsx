/* @flow */
import React from "react";
import {
  withStyles,
  Card,
  CardContent,
  CardHeader,
  CardActions
} from "material-ui";
import cx from "classnames";

import regularCardStyle from "../../variables/styles/regularCardStyle";

export type Props = {
  plainCard?: boolean,
  classes: Object,
  headerColor?: 'orange' | 'green' | 'red' | 'blue' | 'purple',
  cardTitle?: number | string | React.Element | Array<any>,
  cardSubtitle?: number | string | React.Element | Array<any>,
  content?: number | string | React.Element | Array<any>,
  footer?: number | string | React.Element | Array<any>,
};

function RegularCard(props: Props) {
  //const { ...props } = props;
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
    [" " + classes.cardPlain]: plainCard
  });
  const cardPlainHeaderClasses = cx({
    [" " + classes.cardPlainHeader]: plainCard
  });
  return (
    <Card className={classes.card + plainCardClasses}>
      <CardHeader
        classes={{
          root:
            classes.cardHeader +
            " " +
            classes[headerColor + "CardHeader"] +
            cardPlainHeaderClasses,
          title: classes.cardTitle,
          subheader: classes.cardSubtitle
        }}
        title={cardTitle}
        subheader={cardSubtitle}
      />
      <CardContent>{content}</CardContent>
      {footer !== undefined ? (
        <CardActions className={classes.cardActions}>{footer}</CardActions>
      ) : null}
    </Card>
  );
}

RegularCard.defaultProps = {
  headerColor: "purple"
};

export default withStyles(regularCardStyle)(RegularCard);
