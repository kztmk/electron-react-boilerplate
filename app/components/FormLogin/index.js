// @flow
import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Store from 'electron-store';
import Loadable from 'react-loading-overlay';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import AddAlert from '@material-ui/icons/AddAlert';
import Check from '@material-ui/icons/Check';

import type { AuthType } from '../../types/auth';
import GridItem from '../../ui/Grid/GridItem';
import Card from '../../ui/Card/Card';
import CardHeader from '../../ui/Card/CardHeader';
import CardText from '../../ui/Card/CardText';
import CardBody from '../../ui/Card/CardBody';
import Button from '../../ui/CustomButtons/Button';
import Snackbar from '../../ui/Snackbar/Snackbar';
import { LoginIcon } from '../../assets/icons';
import customInputStyle from '../../assets/jss/material-dashboard-pro-react/components/customInputStyle';
import type { UserAccountType } from '../../types/userAccount';
import type { State as MailAccountState } from '../../containers/MailAddressList/reducer';
import type { State as BlogAccountState } from '../../containers/BlogList/reducer';
import type { State as PersonalInfoState } from '../../containers/PersonalInfo/reducer';
import type { State as AliasMailInfoState } from '../../containers/AliasMailInfo/reducer';
import type { State as SequenceState } from '../../containers/Sequence/reducer';

export type Props = {
  classes: Object,
  userAuth: AuthType,
  profile: UserAccountType,
  mailAccountState: MailAccountState,
  blogAccountState: BlogAccountState,
  personalInfoState: PersonalInfoState,
  aliasMailInfoState: AliasMailInfoState,
  sequencesState: SequenceState,
  loginStart: (userAuth: AuthType) => void,
  requestPasswordReset: () => void,
  startGetProfile: () => void,
  startGetMailAccounts: () => void,
  startGetBlogAccounts: () => void,
  startGetPersonalInfo: () => void,
  startGetAliasMailInfo: () => void,
  startGetSequence: () => void,
  isLoginDone: () => void
};

type State = {
  isLoading: boolean,
  userAuth: AuthType,
  isOpenErrorSnackbar: boolean,
  isLogin: boolean,
  errorMessage: string,
  step: string,
  checked: boolean
};

const store = new Store();

/**
 *   ログイン用フォーム
 */
class LoginForm extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      userAuth: this.props.userAuth,
      errorMessage: '',
      isOpenErrorSnackbar: false,
      isLogin: this.props.userAuth.userId.length > 0,
      step: '',
      checked: false
    };
  }

  componentDidMount = () => {
    const myLoginId = store.get('mylogin.id', '');
    const myPass = store.get('mylogin.pass', '');

    if (myLoginId.length > 0 && myPass.length > 0) {
      this.setState(prevState => ({
        userAuth: {
          ...prevState.userAuth,
          mailAddress: myLoginId,
          password: myPass
        },
        checked: true
      }));
    }
  };

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
        isOpenErrorSnackbar: isError,
        isLoading: false
      });
      return;
    }

    if (
      this.state.step === 'getProfile' &&
      !nextProps.profile.isLoadingIcon &&
      !nextProps.profile.isFailure
    ) {
      // getMailAccounts
      this.setState({ step: 'getPersonalInfo' });
      this.props.startGetPersonalInfo();
    } else if (
      this.state.step === 'getProfile' &&
      nextProps.profile.isFailure
    ) {
      this.setState({
        isOpenErrorSnackbar: nextProps.profile.isFailure,
        errorMessage: nextProps.profile.errorMessage,
        isLoading: false
      });
      return;
    }

    if (
      this.state.step === 'getPersonalInfo' &&
      !nextProps.personalInfoState.isLoading &&
      !nextProps.personalInfoState.isFailure
    ) {
      // getPersonalInfo
      this.setState({ step: 'getMailAccount' });
      this.props.startGetMailAccounts();
    } else if (
      this.state.step === 'getPersonalInfo' &&
      nextProps.personalInfoState.isFailure
    ) {
      this.setState({
        isOpenErrorSnackbar: nextProps.personalInfoState.isFailure,
        errorMessage: nextProps.personalInfoState.errorMessage,
        isLoading: false
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
    } else if (
      this.state.step === 'getMailAccount' &&
      nextProps.mailAccountState.isFailure
    ) {
      this.setState({
        isOpenErrorSnackbar: nextProps.mailAccountState.isFailure,
        errorMessage: nextProps.mailAccountState.metaMessage,
        isLoading: false
      });
      return;
    }

    if (
      this.state.step === 'getBlogAccount' &&
      !nextProps.blogAccountState.isLoading &&
      !nextProps.blogAccountState.isFailure
    ) {
      this.setState({ step: 'getAliasMailInfo' });
      this.props.startGetAliasMailInfo();
    } else if (
      this.state.step === 'getBlogAccount' &&
      nextProps.blogAccountState.isFailure
    ) {
      this.setState({
        isOpenErrorSnackbar: nextProps.blogAccountState.isFailure,
        errorMessage: nextProps.blogAccountState.errorMessage,
        isLoading: false
      });
      return;
    }

    if (
      this.state.step === 'getAliasMailInfo' &&
      !nextProps.aliasMailInfoState.isLoading &&
      !nextProps.aliasMailInfoState.isFailure
    ) {
      this.setState({ step: 'getSequences' });
      this.props.startGetSequence();
    } else if (
      this.state.step === 'getAliasMailInfo' &&
      nextProps.aliasMailInfoState.isFailure
    ) {
      this.setState({
        isOpenErrorSnackbar: nextProps.aliasMailInfoState.isFailure,
        errorMessage: nextProps.aliasMailInfoState.errorMessage,
        isLoading: false
      });
      return;
    }

    if (
      this.state.step === 'getSequences' &&
      !nextProps.sequencesState.isLoading &&
      !nextProps.sequencesState.isFailure
    ) {
      this.setState({ isLogin: true, step: '', isLoading: false });
      this.props.isLoginDone(true);
    } else if (
      this.state.step === 'getSequences' &&
      nextProps.sequencesState.isFailure
    ) {
      this.setState({
        isOpenErrorSnackbar: nextProps.sequencesState.isFailure,
        errorMessage: nextProps.sequencesState.errorMessage,
        isLoading: false
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
    if (this.state.checked) {
      store.set('mylogin.id', this.state.userAuth.mailAddress);
      store.set('mylogin.pass', this.state.userAuth.password);
    } else {
      store.set('mylogin.id', '');
      store.set('mylogin.pass', '');
    }
    this.setState({
      isOpenErrorSnackbar: false,
      step: 'getAuth',
      isLoading: true
    });
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
    this.setState(prevState => ({
      userAuth: {
        ...prevState.userAuth,
        isOpenErrorSnackbar: false
      }
    }))
  };

  /**
   * チェックボックス
   * @param value
   */
  handleToggle(value) {
    this.setState({
      checked: value
    });
  }

  /**
   * コンポーネント表示
   * @returns {*}
   */
  render() {
    const { classes } = this.props;
    return (
      <Loadable
        active={this.state.isLoading}
        animate
        spinner
        text="サーバーからデータを取得中・・・・"
      >
        <Grid container justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader text color="primary">
                <CardText color="primary">
                  <h4 className={classes.cardTitleWhite}>
                    寄騎 version5 ログイン
                  </h4>
                  <h4 className={classes.cardCategoryWhite}>
                    登録済みのメールアドレス、パスワードでログイン
                  </h4>
                </CardText>
              </CardHeader>
              <CardBody>
                <ValidatorForm
                  onSubmit={this.handleSubmit}
                  onError={errors => console.log(errors)}
                >
                  <TextValidator
                    label="メールアドレス"
                    onChange={this.handleChangeMailAddress}
                    name="mailAddress"
                    value={this.state.userAuth.mailAddress}
                    validators={['required', 'isEmail']}
                    errorMessages={[
                      '必須項目です。',
                      '有効なメールアドレスを入力してください。'
                    ]}
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
                  <div className={classes.checkboxAndRadio}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => this.handleToggle(!this.state.checked)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                          }}
                          checked={this.state.checked}
                        />
                      }
                      classes={{
                        label: classes.label
                      }}
                      label="メールアドレスとパスワードを保存"
                    />
                  </div>
                  <Button
                    color="primary"
                    type="submit"
                    onClick={this.handleStartLogin}
                    disabled={this.state.isLogin}
                    style={{ marginBottom: '30px', marginTop: 0 }}
                  >
                    <LoginIcon />
                    ログイン
                  </Button>
                  <br />
                  <Button onClick={this.props.requestPasswordReset}>
                    パスワードを忘れた場合
                  </Button>
                  <Snackbar
                    color="warning"
                    place="bc"
                    icon={AddAlert}
                    open={this.state.isOpenErrorSnackbar}
                    closeNotification={this.handleErrorSnackbarClose}
                    close
                    message={
                      <span id="login_error">{this.state.errorMessage}</span>
                    }
                  />
                </ValidatorForm>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Loadable>
    );
  }
}

export default withStyles(customInputStyle)(LoginForm);
