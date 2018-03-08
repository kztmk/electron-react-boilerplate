// @flow
import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { withStyles, List, ListItem, ListItemIcon } from 'material-ui';
import VerticalNavStyle from '../../variables/styles/verticalNavi';
import IconButton from 'material-ui';

const VerticalNav = ({ ...props }) => {
  // verifies if routeName is the one active
  function activeRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1;
  }
  const { classes, color, logo, image, logoText, routes } = props;
  const links = (
    <List>
      {routes.map((prop, key) => {
        const listItemClasses = cx({
          [' ' + classes[color]]: activeRoute(prop.path)
        });
        const whiteFontClasses = cx({
          [' ' + classes.whiteFont]: activeRoute(prop.path)
        });
        return (
          <NavLink to={prop.path} className={classes.item} activeClassName="active" key={key}>
            <ListItem button className={classes.itemLink + listItemClasses}>
              <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                <prop.icon />
              </ListItemIcon>
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  //TODO: Login成功後にUserInfo dataを取得
  //TODO: verticalNavibarを作成
  //TODO: password reset

  //TODO: userProfile page
  return <div className={classes.verticalNavi}>{links}</div>;
};

export default withStyles(VerticalNavStyle)(VerticalNav);
