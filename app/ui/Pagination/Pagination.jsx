// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button';

import paginationStyle from '../../assets/jss/material-dashboard-pro-react/components/paginationStyle';

export type Props = {
  classes: Object,
  pages: Array<{
    active?: boolean,
    disabled?: boolean,
    text: number | 'PREV' | 'NEXT' | '...',
    onClick?: Function
  }>,
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger'
};

function Pagination(props: Props) {
  const { classes, pages, color } = props;
  return (
    <ul className={classes.pagination}>
      {pages.map((prop, key) => {
        const paginationLink = cx({
          [classes.paginationLink]: true,
          [classes[color]]: prop.active,
          [classes.disabled]: prop.disabled
        });
        return (
          <li className={classes.paginationItem} key={key}>
            {prop.onClick !== undefined ? (
              <Button onClick={prop.onClick} className={paginationLink}>
                {prop.text}
              </Button>
            ) : (
              <Button
                onClick={() => console.log(`you've clicked ${prop.text}`)}
                className={paginationLink}
              >
                {prop.text}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

Pagination.defaultProps = {
  color: 'primary'
};

export default withStyles(paginationStyle)(Pagination);
