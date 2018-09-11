// @flow
import React from 'react';
import Loadable from 'react-loading-overlay';

import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import AddAlert from '@material-ui/icons/AddAlert';
import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';
import CustomInput from '../../ui/CustomInput/CustomInput';
import Button from '../../ui/CustomButtons/Button';
import Clearfix from '../../ui/Clearfix/Clearfix';
import Snackbar from '../../ui/Snackbar/Snackbar';
import { SaveAltIcon } from '../../assets/icons/index';

import settingPageStyle from '../../assets/jss/material-dashboard-pro-react/views/settingsPage';
import type GmailType from '../../types/gmail';

const iconStyle = {
  width: '18px',
  height: '18px'
};

type Props = {
  classes: Object,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  gmailInfo: GmailType,
  startSaveGmailInfo: (gmailInfo: GmailType) => void
};

type State = {
  accountId: string,
  accountIdState: string,
  domain: string,
  domainState: string,
  password: string,
  passwordState: string,
  errorMessage: '',
  openErrorSnackbar: false,
  openSuccessSnackbar: false
};

class GmailSettings extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      accountId: this.props.gmailInfo.accountId,
      domain: this.props.gmailInfo.domain,
      password: this.props.gmailInfo.password,
      errorMessage: '',
      openErrorSnackbar: false,
      openSuccessSnackbar: false
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.isLoading && !nextProps.isLoading && !nextProps.isFailure) {
      this.setState({ openSuccessSnackbar: true });
    }

    if (this.props.isLoading && !nextProps.isLoading && nextProps.isFailure) {
      this.setState({
        openErrorSnackbar: true,
        errorMessage: nextProps.errorMessage
      });
    }
  };

  /**
   * フォームフィールドに入力があった場合、値チェック、各state変更
   *
   * @param event
   * @param fieldName
   */
  inputFormField = (event, fieldName) => {
    switch (fieldName) {
      case 'accountId':
        if (this.isRequired(event.target.value) && this.isAlphabet(event.target.value)) {
          this.setState({
            accountId: event.target.value,
            accountIdState: 'success'
          });
        } else {
          this.setState({
            accountId: event.target.value,
            accountIdState: 'error'
          });
        }
        break;
      case 'domain':
        if (this.isRequired(event.target.value) && this.isDomain(event.target.value)) {
          this.setState({
            domain: event.target.value,
            domainState: 'success'
          });
        } else {
          this.setState({
            domain: event.target.value,
            domainState: 'error'
          });
        }
        break;
      case 'password':
        if (this.isRequired(event.target.value) && this.isAlphabet(event.target.value)) {
          this.setState({
            password: event.target.value,
            passwordState: 'success'
          });
        } else {
          this.setState({
            password: event.target.value,
            passwordState: 'error'
          });
        }
        break;
      default:
    }
  };

  /**
   * required check
   * @param value
   * @returns {boolean}
   */
  isRequired = value => value.length > 0;

  /**
   * 半角英文字チェック
   *
   * @param checkString
   * @returns {boolean}
   */
  isAlphabet = checkString => !checkString.match(/[^A-Za-z0-9]+/);

  isDomain = checkString =>
    checkString.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/);

  /**
   * データ保存
   *
   * 保存前にデータをチェック
   */
  saveSettings = () => {
    let errorMsg = '';

    if (this.state.accountId.length > 0) {
      this.setState({ accountIdState: 'success' });
    } else {
      this.setState({ accountIdState: 'error' });
      errorMsg = 'GmailのアカウントIDを確認してください。';
    }

    if (this.state.domain.length > 0) {
      this.setState({ domainState: 'success' });
    } else {
      this.setState({ domainState: 'error' });
      errorMsg = 'Gmailのドメインを確認してください。';
    }

    if (this.state.password.length > 7) {
      this.setState({ passwordState: 'success' });
    } else {
      this.setState({ passwordState: 'error' });
      errorMsg = 'Gmailのパスワードを確認してください。8文字以上必要です。';
    }

    if (errorMsg.length > 0) {
      this.setState({
        openErrorSnackbar: true,
        errorMessage: errorMsg
      });
      return;
    }

    // save settings
    const gmailInfo = {
      accountId: this.state.accountId,
      domain: this.state.domain,
      password: this.state.password,
      random: true,
      sequences: []
    };
    this.props.startSaveGmailInfo(gmailInfo);
  };

  /**
   * エラースナックバー表示
   */
  handleErrorSnackbarClose = () => {
    this.setState({ openErrorSnackbar: false });
  };

  /**
   * 成功スナックバー表示
   */
  handleSuccessSnackbarClose = () => {
    this.setState({ openSuccessSnackbar: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.props.isLoading} spinner text="サーバーと通信中・・・・">
        <GridContainer justify="center">
          <GridContainer>
            <GridItem xs={12} sm={12} md={1} />
            <GridItem xs={12} sm={12} md={11}>
              <div className={classes.groupBox}>
                <GridContainer>
                  <GridItem xs={12} sm={2} md={3}>
                    <FormLabel className={classes.labelHorizontal}>Gmail:</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4} md={3}>
                    <CustomInput
                      success={this.state.accountIdState === 'success'}
                      error={this.state.accountIdState === 'error'}
                      labelText="アカウントID"
                      id="accountId"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'accountId'),
                        value: this.state.accountId,
                        type: 'text'
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={1} md={1}>
                    <FormLabel className={classes.labelHorizontal}>@</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={4} md={3}>
                    <CustomInput
                      success={this.state.domainState === 'success'}
                      error={this.state.domainState === 'error'}
                      labelText="ドメイン"
                      placeholder="gmail.com"
                      id="domain"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'domain'),
                        value: this.state.domain,
                        type: 'text'
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2} md={3}>
                    <FormLabel className={classes.labelHorizontal}>パスワード:</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={5} md={4}>
                    <CustomInput
                      success={this.state.passwordState === 'success'}
                      error={this.state.passwordState === 'error'}
                      labelText="パスワード"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'password'),
                        value: this.state.password,
                        type: 'text'
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={9} />
                  <GridItem xs={12} sm={12} md={3}>
                    <Button
                      color="primary"
                      className={classes.lastButton}
                      onClick={() => this.saveSettings()}
                    >
                      <SaveAltIcon style={iconStyle} />
                      保存
                    </Button>
                  </GridItem>
                </GridContainer>
                <Clearfix />
              </div>
            </GridItem>
          </GridContainer>
        </GridContainer>
        <Snackbar
          color="success"
          place="bc"
          icon={AddAlert}
          open={this.state.openSuccessSnackbar}
          closeNotification={this.handleSuccessSnackbarClose}
          close
          message={<span id="login_error">Gmail情報を保存しました。</span>}
        />
        <Snackbar
          color="warning"
          place="bc"
          icon={AddAlert}
          open={this.state.openErrorSnackbar}
          closeNotification={this.handleErrorSnackbarClose}
          close
          message={<span id="login_error">{this.state.errorMessage}</span>}
        />
      </Loadable>
    );
  }
}

export default withStyles(settingPageStyle)(GmailSettings);
