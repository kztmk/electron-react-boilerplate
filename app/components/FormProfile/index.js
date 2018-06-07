// @flow
import React from 'react';
import { Grid, Select, MenuItem, withStyles } from 'material-ui';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import moment from 'moment';
import AddAlert from 'material-ui-icons/AddAlert';
import { FullHeaderCard, Button, CustomInput, ItemGrid, Snackbar } from '../../ui';
import type { UserAccountType } from '../../types/userAccount';
import validateTextField from '../../assets/jss/material-dashboard-pro-react/components/validateTextField';

export type Props = {
  userInfo: UserAccountType,
  addProfile: () => void,
  classes: Object
};

type State = {
  userInfo: UserAccountType,
  expireDateString: string,
  formatPaymentMethod: string,
  mailAddressError: boolean,
  passwordError: boolean,
  disabled: boolean,
  isOpenErrorSnackbar: boolean,
  isOpenSuccessSnackbar: boolean
};

/**
 * 支払い方法をｄｂへ格納している文字列から、表示用文字列へ変換
 * @param paymentMethod
 * @returns {string}
 */
const convertStringToPaymentMethod = (paymentMethod: ?string) => {
  if (!paymentMethod) return '';
  switch (paymentMethod) {
    case 'py':
      return 'ペイパル年間支払い';
    case 'pm':
      return 'ペイパル月支払い';
    case 'by':
      return '銀行振込-年間支払い';
    case 'bm':
      return '銀行振込 3ヶ月支払い';
    default:
      return '設定なし';
  }
};

/**
 * Profile form
 * ログインユーザーは、メールアドレス、パスワードを変更可能
 * 管理者は、支払い方法、有効期限を変更可能
 */
class FormProfile extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: this.props.userInfo,
      expireDateString: moment(this.props.userInfo.expireDate).format('YYYY-MM-DD'),
      formatPaymentMethod: convertStringToPaymentMethod(this.props.userInfo.paymentMethod),
      mailAddressError: false,
      passwordError: false,
      disabled: true,
      isOpenErrorSnackbar: false,
      isOpenSuccessSnackbar: false
    };
  }

  /**
   * ValidatorFormにパスワードチェック用のバリデーションを追加する
   */
  componentWillMount() {
    const reg = /^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/;
    ValidatorForm.addValidationRule('isPassword', value => {
      if (!reg.test(value)) {
        return false;
      }
      return true;
    });
  }

  /**
   * Props更新後にstateを更新
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    const isError = nextProps.userInfo.isFailure;

    this.setState({
      userInfo: {
        ...nextProps.userInfo
      },
      isOpenErrorSnackbar: isError,
      isOpenSuccessSnackbar: !isError
    });
  };

  /**
   * プロファイル更新ボタンのクリック
   * ユーザ情報をPropsとして受け取っているsetProfileアクションをdispatch
   */
  handleUpdateUserInfo = () => {
    this.props.addProfile(this.state.userInfo);
  };

  /**
   * 有効期限の更新
   * @param event field value change
   */
  handleChangeExpire = event => {
    if (event.target instanceof HTMLInputElement) {
      const val = event.target.value;
      const dateNumber = new Date(val).getTime();
      this.setState(prevState => ({
        userInfo: {
          ...prevState.userInfo,
          expireDate: dateNumber
        },
        expireDateString: moment(dateNumber).format('YYYY-MM-DD'),
        expireDateObj: new Date(val),
        disabled: false
      }));
    }
  };

  /**
   * 支払い方法の変更
   * @param event field value change
   */
  handleChangePaymentMethod = event => {
    this.setState(prevState => ({
      userInfo: {
        ...prevState.userInfo,
        paymentMethod: event.target.value
      },
      formatPaymentMethod: convertStringToPaymentMethod(event.target.value)
    }));
  };

  /**
   * メールアドレスの変更
   * @param event field value change
   */
  handleChangeMailAddress = event => {
    const val = event.target.value;
    if (event.target instanceof HTMLInputElement) {
      this.setState(prevState => ({
        userInfo: {
          ...prevState.userInfo,
          mailAddress: val
        }
      }));
    }
  };

  /**
   * パスワードの更新
   * @param event field value change
   */
  handleChangePassword = event => {
    const val = event.target.value;
    if (event.target instanceof HTMLInputElement) {
      this.setState(prevState => ({
        userInfo: {
          ...prevState.userInfo,
          password: val
        }
      }));
    }
  };

  /**
   *フォーム送信
   */
  handleSubmit = () => {};

  /**
   * mailAddress欄のエラーチェック
   * password欄共にエラーがない場合、送信ボタンをenableに
   * @param result
   */
  validatorListenerMailAddress = result => {
    this.setState({ mailAddressError: !result });
    if (result && !this.state.passwordError) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  };

  /**
   * password欄のエラーチェック
   * mailAddress欄と共にエラーがない場合に、送信ボタンをenableに
   * @param result
   */
  validatorListenerPassword = result => {
    this.setState({ passwordError: !result });
    if (!this.state.mailAddressError && result) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  };

  /**
   * エラー通知を消す際にstateを更新
   */
  handleErrorSnackbarClose = () => {
    this.setState({ isOpenErrorSnackbar: false });
  };

  /**
   * 正常更新通知を消す際にstateを更新
   */
  handleSuccessSnackbarClose = () => {
    this.setState({ isOpenSuccessSnackbar: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="center">
        <ItemGrid xs={12} sm={12} md={8}>
          <ValidatorForm onSubmit={this.handleSubmit} onError={errors => this.validateForm(errors)}>
            <FullHeaderCard
              cardTitle="ユーザー情報"
              cardSubtitle=""
              content={
                <div>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={10}>
                      <TextValidator
                        className={classes.validatedField}
                        fullWidth
                        label="登録メールアドレス"
                        name="mailAddress"
                        value={this.state.userInfo.mailAddress}
                        onChange={this.handleChangeMailAddress}
                        validators={['required', 'isEmail']}
                        errorMessages={[
                          '必須項目です。',
                          '有効なメールアドレスを入力してください。'
                        ]}
                        helperText="登録メールアドレスは、自由に変更することができます。"
                        validatorListener={this.validatorListenerMailAddress}
                      />
                    </ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={10}>
                      <TextValidator
                        className={classes.validatedField}
                        label="パスワード"
                        onChange={this.handleChangePassword}
                        name="password"
                        value={this.state.userInfo.password}
                        validators={['required', 'minStringLength:8', 'isPassword']}
                        errorMessages={[
                          '必須項目です。',
                          '最低8文字が必要です。',
                          '半角英数記号以外が含まれています。'
                        ]}
                        fullWidth
                        validatorListener={this.validatorListenerPassword}
                        helperText="半角英数字、記号が使えます。"
                      />
                    </ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={10}>
                      <CustomInput
                        labelText="決済時メールアドレス(登録メールアドレス問合せ時に使用)"
                        id="original-mailaddress"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true,
                          value: this.state.userInfo.registeredMailAddress
                        }}
                      />
                    </ItemGrid>
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="有効期限"
                        id="expire-date"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: this.state.expireDateString,
                          disabled: true
                        }}
                      />
                    </ItemGrid>
                    {/* 管理者用
                    <ItemGrid>
                      <CustomInput
                        labelText="有効期限設定"
                        id="expire-date-set"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: 'date',
                          value: this.state.expireDateString,
                          onChange: this.handleChangeExpire
                        }}
                      />
                    </ItemGrid> */}
                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="支払い方法"
                        id="payment-method"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: this.state.formatPaymentMethod,
                          disabled: true
                        }}
                      />
                    </ItemGrid>
                    {/* 管理者用
                    <ItemGrid xs={12} sm={12} md={6}>
                      <Select
                        value={this.state.userInfo.paymentMethod}
                        onChange={this.handleChangePaymentMethod}
                        inputProps={{
                          name: 'paymentMethod',
                          id: 'paymentMethod'
                        }}
                      >
                        <MenuItem value="">設定なし</MenuItem>
                        <MenuItem value="py">ペイパル年間支払い</MenuItem>
                        <MenuItem value="pm">ペイパル月支払い</MenuItem>
                        <MenuItem value="by">銀行振込年間支払い</MenuItem>
                        <MenuItem value="bm">銀行振込3ヶ月支払い</MenuItem>
                      </Select>
                    </ItemGrid> */}
                  </Grid>
                </div>
              }
              footer={
                <Button
                  type="submit"
                  color="primary"
                  onClick={this.handleUpdateUserInfo}
                  disabled={this.state.disabled}
                >
                  ユーザー情報更新
                </Button>
              }
            />
          </ValidatorForm>
          <Snackbar
            color="warning"
            place="bc"
            icon={AddAlert}
            open={this.state.isOpenErrorSnackbar}
            closeNotification={this.handleErrorSnackbarClose}
            close
            message={<span id="login_error">{this.state.userInfo.errorMessage}</span>}
          />
          <Snackbar
            color="success"
            place="bc"
            icon={AddAlert}
            open={this.state.isOpenSuccessSnackbar}
            closeNotification={this.handleSuccessSnackbarClose}
            close
            message={<span id="login_error">ユーザー情報を更新しました。</span>}
          />
        </ItemGrid>
      </Grid>
    );
  }
}

export default withStyles(validateTextField)(FormProfile);
