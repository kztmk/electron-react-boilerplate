// @flow
import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from 'material-ui';
import type { AuthType } from '../../types/auth';
import Grid from 'material-ui/Grid';
import { RegularCard, ItemGrid, Button, Snackbar } from '../../ui';
import AddAlert from 'material-ui-icons/AddAlert';
import { LoginIcon } from '../../asets/icons';

import customInputStyle from '../../variables/styles/customInputStyle';

export type Props = {
  userAuth: AuthType,
  loginStart: (userAuth: AuthType) => void,
  requestPasswordReset: () => void
};

type State = {
  userAuth: AuthType,
  isOpenErrorSnackbar: boolean,
  isLogin: boolean
};

/**
 *   ログイン用フォーム
 */
class LoginForm extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      userAuth: this.props.userAuth,
      isOpenErrorSnackbar: false,
      isLogin: this.props.userAuth.userId.length > 0
    };
  }

  /**
   * Firebase認証完了後の更新されたpropsでstateを更新
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    const isError = nextProps.userAuth.isLoginFailure;
    const isLoginSuccess = nextProps.userAuth.userId.length > 0;
    this.setState({
      userAuth: {
        ...nextProps.userAuth
      },
      isOpenErrorSnackbar: isError,
      isLogin: isLoginSuccess
    });
  };

  /**
   * メールアドレス欄の入力イベント
   * @param event
   */
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

  /**
   * パスワード欄の入力イベント
   * @param event
   */
  handleChangePassword = event => {
    if (event.target instanceof HTMLInputElement) {
      const val = event.target.value;
      this.setState(prevState => ({
        userAuth: {
          ...prevState.userAuth,
          password: val
        }
      }));
    }
  };

  /**
   * ログインボタンのクリック
   * container/Login で propsとして受け取ったactionをdispatch
   */
  handleStartLogin = () => {
    this.props.loginStart(this.state.userAuth);
  };

  /**
   * ログインボタンクリックでform送信のイベント発生
   * input欄のrequestバリデーションに必要
   */
  handleSubmit = () => {};

  /**
   * エラー用snackbarを非表示にする
   */
  handleErrorSnackbarClose = () => {
    this.setState({ isOpenErrorSnackbar: false });
  };

  /**
   * コンポーネント表示
   * @returns {*}
   */
  render() {
    return (
      <Grid container justify="center">
        <ItemGrid xs={12} sm={8} md={6}>
          <RegularCard
            cardTitle="寄騎 version5　ログイン"
            cardSubtitle="登録済みのメールアドレス、パスワードでログイン"
            content={
              <ValidatorForm onSubmit={this.handleSubmit} onError={errors => console.log(errors)}>
                <TextValidator
                  label="メールアドレス"
                  onChange={this.handleChangeMailAddress}
                  name="mailAddress"
                  value={this.state.userAuth.mailAddress}
                  validators={['required', 'isEmail']}
                  errorMessages={['必須項目です。', '有効なメールアドレスを入力してください。']}
                  helperText="登録メールアドレスを入力します。"
                  fullWidth
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
                  fullWidth
                />
                <br />
                <Button
                  color="primary"
                  type="submit"
                  onClick={this.handleStartLogin}
                  disabled={this.state.isLogin}
                  style={{ marginBottom: '40px', marginTop: '30px' }}
                >
                  <LoginIcon />
                  ログイン
                </Button>
                <br />
                <Button onClick={this.props.requestPasswordReset}>パスワードを忘れた場合</Button>
                <Snackbar
                  color="warning"
                  place="bc"
                  icon={AddAlert}
                  open={this.state.isOpenErrorSnackbar}
                  closeNotification={this.handleErrorSnackbarClose}
                  close
                  message={<span id="login_error">{this.state.userAuth.errorMessage}</span>}
                />
              </ValidatorForm>
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

export default withStyles(customInputStyle)(LoginForm);
