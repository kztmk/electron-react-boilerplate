// @flow
import React, { Component } from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import MenuAppBar from './AppBar/';

import LoginForm from '../containers/Login';

type Props = {};

const styles = {
  width: '400px'
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <MenuAppBar />
        <Card style={styles}>
          <CardContent>
            <CardHeader
              title="寄騎　Version5"
              subheader="登録メールアドレスとパスワードでログインすると、データを同期します。"
            />
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    );
  }
}
