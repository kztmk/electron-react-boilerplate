// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Card from 'material-ui/Card';
import CardContent from 'material-ui/Card/CardContent';
import CardHeader from 'material-ui/Card/CardHeader';
import CardActions from 'material-ui/Card/CardActions';
import Typography from 'material-ui/Typography';

import statsCardStyle from '../../asets/jss/material-dashboard-pro-react/components/statsCardStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  icon: Function,
  iconColor?: 'orange' | 'green' | 'red' | 'blue' | 'purple',
  title?: number | string | React.Element | Array<any>,
  description?: number | string | React.Element | Array<any>,
  small?: number | string | React.Element | Array<any>,
  statIcon: Function,
  statIconColor?: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  statLink?: Object,
  statText?: number | string | React.Element | Array<any>
};
/* eslint-enable */

function StatsCard(props: Props) {
  const {
    classes,
    title,
    description,
    statLink,
    small,
    statText,
    statIconColor,
    iconColor
  } = props;
  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{
          root: `${classes.cardHeader} ${classes[`${iconColor}CardHeader`]}`,
          avatar: classes.cardAvatar
        }}
        avatar={<props.icon className={classes.cardIcon} />}
      />
      <CardContent className={classes.cardContent}>
        <Typography component="p" className={classes.cardCategory}>
          {title}
        </Typography>
        <Typography
          variant="headline"
          component="h2"
          className={classes.cardTitle}
        >
          {description}{' '}
          {small !== undefined ? (
            <small className={classes.cardTitleSmall}>{small}</small>
          ) : null}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.cardStats}>
          <props.statIcon
            className={
              `${classes.cardStatsIcon
              } ${
              classes[`${statIconColor}CardStatsIcon`]}`
            }
          />{' '}
          {statLink !== undefined ? (
            <a href={statLink.href} className={classes.cardStatsLink}>
              {statLink.text}
            </a>
          ) : statText !== undefined ? (
            statText
          ) : null}
        </div>
      </CardActions>
    </Card>
  );
}

StatsCard.defaultProps = {
  iconColor: 'purple',
  statIconColor: 'gray'
};

export default withStyles(statsCardStyle)(StatsCard);
