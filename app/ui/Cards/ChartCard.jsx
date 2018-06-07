// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Card from 'material-ui/Card';
import CardContent from 'material-ui/Card/CardContent';
import CardHeader from 'material-ui/Card/CardHeader';
import CardActions from 'material-ui/Card/CardActions';
import Typography from 'material-ui/Typography';

import chartCardStyle from '../../assets/jss/material-dashboard-pro-react/components/chartCardStyle';

/* eslint-disable */
//react/require-default-props
export type Props = {
  classes: Object,
  chart: Object,
  title?: number | string | React.Element | Array<any>,
  text?: number | string | React.Element | Array<any>,
  statIcon?: Function,
  statIconColor?: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  chartColor?: 'orange' | 'green' | 'red' | 'blue' | 'purple' | 'rose',
  statLink?: Object,
  statText?: number | string | React.Element | Array<any>,
  // if the chart should move up on hover
  hover?: boolean,
  // what to be displayed under tha chart on hover
  underChart?: number | string | React.Element | Array<any>
};
/* eslint-enable */

class ChartCard extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  render() {
    const {
      classes,
      chartColor,
      statIconColor,
      chart,
      title,
      text,
      statLink,
      statText,
      underChart,
      hover
    } = this.props;
    const cardHeaderClasses =
      `${classes.cardHeader
      } ${
        classes[`${chartColor}CardHeader`]
      }${cx({
        [` ${ classes.moveChartUp}`]: this.state.hover && hover
      })}`;
    const addHoverEvent = {};
    if (hover) {
      if (navigator.userAgent.match(/iPad/i) != null) {
        addHoverEvent.onClick = () =>
          this.setState({ hover: !this.state.hover });
      } else {
        addHoverEvent.onMouseEnter = () => this.setState({ hover: true });
        addHoverEvent.onMouseLeave = () => this.setState({ hover: false });
      }
    }
    return (
      <Card className={classes.card} {...addHoverEvent}>
        <CardHeader className={cardHeaderClasses} subheader={chart} />
        <CardContent className={classes.cardContent}>
          {hover ? (
            <div className={classes.underChart}>{underChart}</div>
          ) : null}
          <Typography
            variant="title"
            component="h4"
            className={classes.cardTitle}
          >
            {title}
          </Typography>
          <Typography component="p" className={classes.cardCategory}>
            {text}
          </Typography>
        </CardContent>
        {this.props.statIcon !== undefined ||
        statLink !== undefined ||
        statText !== undefined ? (
          <CardActions className={classes.cardActions}>
            <div className={classes.cardStats}>
              {this.props.statIcon !== undefined ? (
                <this.props.statIcon
                  className={
                    `${classes.cardStatsIcon
                    } ${
                    classes[`${statIconColor}CardStatsIcon`]}`
                  }
                />
              ) : null}{' '}
              {statLink !== undefined ? (
                <a href={statLink.href} className={classes.cardStatsLink}>
                  {statLink.text}
                </a>
              ) : statText !== undefined ? (
                statText
              ) : null}
            </div>
          </CardActions>
        ) : null}
      </Card>
    );
  }
}

ChartCard.defaultProps = {
  statIconColor: 'gray',
  chartColor: 'purple',
  hover: false
};

export default withStyles(chartCardStyle)(ChartCard);
