// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

// core components
import Badge from '../Badge/Badge';

import timelineStyle from '../../asets/jss/material-dashboard-pro-react/components/timelineStyle';

/* eslint-disable react/require-default-props */
export type Props = {
  classes: Object,
  stories: Array<Object>,
  simple?: boolean
};

function Timeline(props: Props) {
  const { classes, stories, simple } = props;
  const timelineClass =
    `${classes.timeline
    } ${
      cx({
        [classes.timelineSimple]: simple
      })}`;
  return (
    <ul className={timelineClass}>
      {stories.map((prop, key) => {
        const panelClasses =
          `${classes.timelinePanel
          } ${
          cx({
            [classes.timelinePanelInverted]: prop.inverted,
            [classes.timelineSimplePanel]: simple
          })}`;
        const timelineBadgeClasses =
          `${classes.timelineBadge
          } ${
          classes[prop.badgeColor]
          } ${
          cx({
            [classes.timelineSimpleBadge]: simple
          })}`;
        return (
          <li className={classes.item} key={key}>
            {prop.badgeIcon ? (
              <div className={timelineBadgeClasses}>
                <prop.badgeIcon className={classes.badgeIcon} />
              </div>
            ) : null}
            <div className={panelClasses}>
              {prop.title ? (
                <div className={classes.timelineHeading}>
                  <Badge color={prop.titleColor}>{prop.title}</Badge>
                </div>
              ) : null}
              <div className={classes.timelineBody}>{prop.body}</div>
              {prop.footerTitle ? (
                <h6 className={classes.footerTitle}>{prop.footerTitle}</h6>
              ) : null}
              {prop.footer ? <hr className={classes.footerLine} /> : null}
              {prop.footer ? (
                <div className={classes.timelineFooter}>{prop.footer}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default withStyles(timelineStyle)(Timeline);
