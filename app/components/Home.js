// @flow
import React, { Component } from 'react';
import { withStyles, Grid } from 'material-ui';
import { CardHeader, CardContent } from 'material-ui/Card';
import RegularCard from '../ui/Cards/RegularCard';
import MenuAppBar from './AppBar/';

import { ItemGrid } from '../ui';
import LoginForm from '../containers/Login';
import VerticalNavi from './VerticalNav';
import { primaryColor } from '../variables/styles';

import appStyle from '../variables/styles/appStyle';
type Props = {};

class Home extends Component<Props> {
  props: Props;

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>
        <VerticalNavi className="verticalNavi" />
        <div className={classes.mainPanel} ref="mainPanel">
          <Grid container>
            <ItemGrid md={4}>
              <RegularCard
                headerColor="orange"
                cardTitle="Employees Stats"
                cardSubtitle="New employees on 15th September, 2016"
                content={<LoginForm />}
              />
            </ItemGrid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(appStyle)(Home);
