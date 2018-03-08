/* @flow */
import React from "react";
import {
  withStyles,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography
} from "material-ui";

import profileCardStyle from "../../variables/styles/profileCardStyle";

export type Props = {
  classes: Object,
  title?: number | string | React.Element | Array<any>,
  subtitle?: number | string | React.Element | Array<any>,
  description?: number | string | React.Element | Array<any>,
  footer?: number | string | React.Element | Array<any>,
  avatar?: string,
};

function ProfileCard(props: Props) {
  const { classes, subtitle, title, description, footer, avatar } = props;
  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{
          root: classes.cardHeader,
          avatar: classes.cardAvatar
        }}
        avatar={<img src={avatar} alt="..." className={classes.img} />}
      />
      <CardContent className={classes.textAlign}>
        {subtitle !== undefined ? (
          <Typography component="h6" className={classes.cardSubtitle}>
            {subtitle}
          </Typography>
        ) : null}
        {title !== undefined ? (
          <Typography component="h4" className={classes.cardTitle}>
            {title}
          </Typography>
        ) : null}
        {description !== undefined ? (
          <Typography component="p" className={classes.cardDescription}>
            {description}
          </Typography>
        ) : null}
      </CardContent>
      <CardActions className={classes.textAlign + " " + classes.cardActions}>
        {footer}
      </CardActions>
    </Card>
  );
}

export default withStyles(profileCardStyle)(ProfileCard);
