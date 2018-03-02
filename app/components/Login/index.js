// @flow
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import type { AuthType } from '../../types/auth';

//TODO: userAuth.uid.length > 0 の場合は、ログインボタン disableed
//TODO: ログアウトボタンでCLEARE_LOGININFOをdispatch
//TODO: errorMessageがある場合には、noticeを表示
//TODO: ログイン成功でredirect
//TODO: https://github.com/sotojuan/saga-login-flow sample
export type Props = {
  userAuth: AuthType,
  loginStart: (userAuth: AuthType) => void,
  logoutStart: () => void
};

type State = {
  userAuth: AuthType
};

// We can use inline-style
const style = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
  margin: '40px 20px'
};

class LoginForm extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.handleChangeMailAddress = this.handleChangeMailAddress.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleStartLogin = this.handleStartLogin.bind(this);
    this.handleStartLogout = this.handleStartLogout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      userAuth: {
        ...nextProps.userAuth
      }
    });
  }

  state = {
    userAuth: this.props.userAuth
  };

  handleChangeMailAddress = event => {
    if (event.target instanceof HTMLInputElement) {
      const val = event.target.value;
      this.setState(prevState => ({
        userAuth: {
          ...prevState.userAuth,
          mailAddress: val
        }
      }));
    }
  };

  handleChangePassword(event) {
    if (event.target instanceof HTMLInputElement) {
      const val = event.target.value;
      this.setState(prevState => ({
        userAuth: {
          ...prevState.userAuth,
          password: val
        }
      }));
    }
  }

  handleStartLogin() {
    this.props.loginStart(this.state.userAuth);
  }

  handleStartLogout() {
    this.props.logoutStart();
  }

  render() {
    return (
      <ValidatorForm onSubmit={this.handleStartLogin}>
        <TextValidator
          label="メールアドレス"
          onChange={this.handleChangeMailAddress}
          name="mailAddress"
          value={this.state.userAuth.mailAddress}
          validators={['required', 'isEmail']}
          errorMessages={['必須項目です。', '有効なメールアドレスを入力してください。']}
          helperText="登録メールアドレスを入力します。"
        />
        <br />
        <TextValidator
          label="パスワード"
          onChange={this.handleChangePassword}
          name="password"
          type="password"
          value={this.state.userAuth.password}
          validators={['required', 'minStringLength:8']}
          errorMessages={['必須項目です。', '最低8文字が必要です。']}
        />
        <br />

        <Button type="submit" style={style} onClick={this.handleStartLogin}>
          ログイン
        </Button>
        <Button style={style} onClick={this.handleStartLogout}>
          ログアウト
        </Button>
      </ValidatorForm>
    );
  }
}

export default LoginForm;
