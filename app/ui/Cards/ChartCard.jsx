/* @flow */
import React from "react";
import {
  withStyles,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography
} from "material-ui";

import chartCardStyle from "../../variables/styles/chartCardStyle";

export type Props = {
  classes: Object,
  chart: Object,
  title?: number | string | React.Element | Array<any>,
  text?: number | string | React.Element | Array<any>,
  statIcon: Function,
  statIconColor?: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  chartColor?: 'orange' | 'green' | 'red' | 'blue' | 'purple',
  statLink?: Object,
  statText?: number | string | React.Element | Array<any>,
};

function ChartCard(props: Props) {
  const {
    classes,
    chartColor,
    statIconColor,
    chart,
    title,
    text,
    statLink,
    statText
  } = props;
  return (
    <Card className={classes.card}>
      <CardHeader
        className={
          classes.cardHeader + " " + classes[chartColor + "CardHeader"]
        }
        subheader={chart}
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="title" component="h4" className={classes.cardTitle}>
          {title}
        </Typography>
        <Typography component="p" className={classes.cardCategory}>
          {text}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.cardStats}>
          <props.statIcon
            className={
              classes.cardStatsIcon +
              " " +
              classes[statIconColor + "CardStatsIcon"]
            }
          />{" "}
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

ChartCard.defaultProps = {
  statIconColor: "gray",
  chartColor: "purple"
};

export default withStyles(chartCardStyle)(ChartCard);
