// @flow
import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from 'material-ui';
import Grid from 'material-ui/Grid';
import AddAlert from 'material-ui-icons/AddAlert';

import type { AuthType } from '../../types/auth';
import { FullHeaderCard, ItemGrid, Button, Snackbar } from '../../ui';
import { LoginIcon } from '../../asets/icons';
import customInputStyle from '../../asets/jss/material-dashboard-pro-react/components/customInputStyle';
import type { UserAccountType } from '../../types/userAccount';
import type { State as MailAccountState } from '../../containers/MailAddressList/reducer';
import type { State as BlogAccountState } from '../../containers/BlogList/reducer';

export type Props = {
  userAuth: AuthType,
  profile: UserAccountType,
  mailAccountState: MailAccountState,
  blogAccountState: BlogAccountState,
  loginStart: (userAuth: AuthType) => void,
  requestPasswordReset: () => void,
  startGetProfile: () => void,
  startGetMailAccounts: () => void,
  startGetBlogAccounts: () => void,
  isLoginDone: () => void
};

type State = {
  userAuth: AuthType,
  isOpenErrorSnackbar: boolean,
  isLogin: boolean,
  errorMessage: string,
  step: string
};

/**
 *   ログイン用フォーム
 */
class LoginForm extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      userAuth: this.props.userAuth,
      errorMessage: '',
      isOpenErrorSnackbar: false,
      isLogin: this.props.userAuth.userId.length > 0,
      step: ''
    };
  }

  /**
   * Firebase認証完了後の更新されたpropsでstateを更新
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    const isError = nextProps.userAuth.isLoginFailure;
    const isLoginSuccess = nextProps.userAuth.userId.length > 0;

    // login success action
    if (
      this.state.step === 'getAuth' &&
      !nextProps.userAuth.isLoadingIcon &&
      isLoginSuccess &&
      !isError
    ) {
      // profileの取得
      this.setState({ step: 'getProfile' });
      this.props.startGetProfile();
    } else if (isError) {
      // error表示
      this.setState({
        userAuth: {
          ...nextProps.userAuth
        },
        errorMessage: nextProps.userAuth.errorMessage,
        isOpenErrorSnackbar: isError
      });
      return;
    }

    if (
      this.state.step === 'getProfile' &&
      !nextProps.profile.isLoadingIcon &&
      !nextProps.profile.isFailure
    ) {
      // getMailAccounts
      this.setState({ step: 'getMailAccount' });
      this.props.startGetMailAccounts();
    } else if (this.state.step === 'getProfile' && nextProps.profile.isFailure) {
      this.setState({
        isOpenErrorSnackbar: nextProps.profile.isFailure,
        errorMessage: nextProps.profile.errorMessage
      });
      return;
    }

    if (
      this.state.step === 'getMailAccount' &&
      !nextProps.mailAccountState.isGetting &&
      !nextProps.mailAccountState.isFailure
    ) {
      // getBlogAccounts
      this.setState({ step: 'getBlogAccount' });
      this.props.startGetBlogAccounts();
    } else if (this.state.step === 'getMailAccount' && nextProps.mailAccountState.isFailure) {
      this.setState({
        isOpenErrorSnackbar: nextProps.mailAccountState.isFailure,
        errorMessage: nextProps.mailAccountState.metaMessage
      });
      return;
    }

    if (
      this.state.step === 'getBlogAccount' &&
      !nextProps.blogAccountState.isLoading &&
      !nextProps.blogAccountState.isFailure
    ) {
      this.setState({ isLogin: true, step: '' });
      this.props.isLoginDone(true);
    } else if (this.state.step === 'getBlogAccount' && nextProps.blogAccountState.isFailure) {
      this.setState({
        isOpenErrorSnackbar: nextProps.blogAccountState.isFailure,
        errorMessage: nextProps.blogAccountState.errorMessage
      });
    }
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
    this.setState({ isOpenErrorSnackbar: false, step: 'getAuth' });
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
    this.setState({
      isOpenErrorSnackbar: false,
      userAuth: { ...this.state.userAuth, errorMessage: '' }
    });
  };

  /**
   * コンポーネント表示
   * @returns {*}
   */
  render() {
    return (
      <Grid container justify="center">
        <ItemGrid xs={12} sm={8} md={6}>
          <FullHeaderCard
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
                  message={<span id="login_error">{this.state.errorMessage}</span>}
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
