// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from 'material-ui';
import Slide from 'material-ui/transitions/Slide';
import type { AuthType } from '../../types/auth';
import Grid from 'material-ui/Grid';
import { RegularCard, ItemGrid, Button, Snackbar } from '../../ui';
import { AddAlert } from 'material-ui-icons/AddAlert';
import { PasswordResetIcon } from '../../asets/icons';

export type Props = {
  userAuth: AuthType,
  resetPasswordStart: (userAuth: AuthType) => void,
  cancelRequestPasswordReset: () => void
};

type State = {
  userAuth: AuthType
};

/**
 * エラーメッセージ用のsnackbarを表示
 * @returns {*}
 * @constructor
 */
function ErrorSnackbarTransition() {
  return <Slide direction="down" />;
}

class FormResetPassword extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      userAuth: this.props.userAuth,
      isOpenErrorSnackbar: false,
      transition: ErrorSnackbarTransition,
      isPasswordReset: false
    };
  }



  /**
   * Firebaseへパスワードリセット要求完了後の更新されたpropsでstateを更新
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    const isError = nextProps.userAuth.isLoginFailure;
    const isResetRequestSuccess =
      !nextProps.userAuth.isLoginFailure && nextProps.userAuth.errorMessage.length === 0;

    console.log(isResetRequestSuccess ? 'yes' : 'no');
    this.setState({
      userAuth: {
        ...nextProps.userAuth
      },
      isOpenErrorSnackbar: isError,
      isPasswordReset: isResetRequestSuccess
    });
  };

  handleResetPassword = () => {
    this.props.resetPasswordStart(this.state.userAuth);
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
   * リセットパスワードボタンのクリックでform送信のイベント発生
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
   * 成功通知用snackbarを非表示にする
   */
  handleSuccessSnackbarClose = () => {
    this.setState({ isPasswordReset: false });
    this.props.cancelRequestPasswordReset();
  };

  render() {
    return (
      <Grid container justify="center">
        <ItemGrid xs={12} sm={8} md={6}>
          <RegularCard
            cardTitle="パスワードリセット"
            cardSubtitle="登録済みのメールアドレスを入力してください。折り返しパスワードリセット用URLを送ります。"
            content={
              <ValidatorForm onSubmit={this.handleSubmit}>
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
                <Button onClick={this.props.cancelRequestPasswordReset}>キャンセル</Button>
                <Button color="primary" type="submit" onClick={this.handleResetPassword}>
                  <PasswordResetIcon />
                  パスワードをリセット
                </Button>

                <Snackbar
                  color="warning"
                  place={'bc'}
                  icon={AddAlert}
                  open={this.state.isOpenErrorSnackbar}
                  closeNotification={this.handleErrorSnackbarClose}
                  close
                  message={
                    <span id="password_reset_error">{this.state.userAuth.errorMessage}</span>
                  }
                />
                <Snackbar
                  color="success"
                  place={'bc'}
                  icon={AddAlert}
                  open={this.state.isPasswordReset}
                  closeNotification={this.handleSuccessSnackbarClose}
                  close
                  message={
                    <span id="password_reset_success">
                      パスワードリセット用のメールを送信しました。メールアカウントを確認してください。
                    </span>
                  }
                />
              </ValidatorForm>
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

export default FormResetPassword;
