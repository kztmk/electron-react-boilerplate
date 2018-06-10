// @flow
import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AddAlert from '@material-ui/icons/AddAlert';
import Cancel from '@material-ui/icons/Cancel';
import type { AuthType } from '../../types/auth';
import Card from '../../ui/Card/Card';
import CardHeader from '../../ui/Card/CardHeader';
import CardText from '../../ui/Card/CardText';
import CardBody from '../../ui/Card/CardBody';
import GridItem from '../../ui/Grid/GridItem';
import Button from '../../ui/CustomButtons/Button';
import Snackbar from '../../ui/Snackbar/Snackbar';
import { PasswordResetIcon } from '../../assets/icons';

import customInputStyle from '../../assets/jss/material-dashboard-pro-react/components/customInputStyle';

export type Props = {
  classes: Object,
  userAuth: AuthType,
  resetPasswordStart: (userAuth: AuthType) => void,
  cancelRequestPasswordReset: () => void
};

type State = {
  userAuth: AuthType
};

class FormResetPassword extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      userAuth: this.props.userAuth,
      isOpenErrorSnackbar: false,
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
    const { classes } = this.props;
    return (
      <Grid container justify="center">
        <GridItem xs={12} sm={8} md={6}>
          <Card>
            <CardHeader text color="primary">
              <CardText color="primary">
                <h4 className={classes.cardTitleWhite}>パスワードリセット</h4>
                <h4 className={classes.cardCategoryWhite}>
                  登録済みのメールアドレスを入力してください。折り返しパスワードリセット用URLを送ります。
                </h4>
              </CardText>
            </CardHeader>
            <CardBody>
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
                <Button onClick={this.props.cancelRequestPasswordReset}>
                  <Cancel />
                  キャンセル
                </Button>
                <Button color="primary" type="submit" onClick={this.handleResetPassword}>
                  <PasswordResetIcon />
                  パスワードをリセット
                </Button>

                <Snackbar
                  color="warning"
                  place="bc"
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
                  place="bc"
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
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    );
  }
}

export default withStyles(customInputStyle)(FormResetPassword);
