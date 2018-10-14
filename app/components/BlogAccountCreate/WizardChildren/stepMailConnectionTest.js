// @flow
import React, { Component } from 'react';
import Loadable from "react-loading-overlay";
// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import AddAlert from "@material-ui/icons/AddAlert";
import CheckCircle from "@material-ui/icons/CheckCircle";
import HighlightOff from "@material-ui/icons/HighlightOff";

import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import CustomInput from '../../../ui/CustomInput/CustomInput';

import Snackbar from "../../../ui/Snackbar/Snackbar";

import type MailAccountType from "../../../types/mailAccount";
import type PersonalInfoType from "../../../types/personalInfo";

import Yahoo from '../../../assets/img/providerImage/y64.png';
import Outlook from '../../../assets/img/providerImage/outlook64.png';
import gmail from '../../../assets/img/providerImage/gmail64.png';
import Yandex from '../../../assets/img/providerImage/yandex64.png';
import ownDomain from '../../../assets/img/providerImage/domain64.png';
import Button from "../../../ui/CustomButtons/Button";
import { MailTest } from "../../../assets/icons";

import { getProviderImage } from '../../MailAddressList/mailAddressList';

import formAddStyle from '../../../assets/jss/material-dashboard-pro-react/views/formAddStyle';

const providerImageStyle = {
  marginLeft: '-15px',
  paddingTop: '6px',
  width: '32px',
  height: '36px'
};

type Props = {
  classes: Object,
  randomPersonalInfo: PersonalInfoType,
  imapMessageLoading: boolean,
  imapIsError: boolean,
  imapErrorMessage: string,
  imapSelectMailBoxPath: string,
  imapMailCount: number,
  startTestImapConnection: MailAccountType => void
};

type State = {
  errorMessage: string,
  successMessage: string,
  openErrorDialog: boolean,
  openSuccessDialog: boolean,
  isValidate?: boolean,
  providerImg: Object,
  buttonState: React.NODE
};

class StepMailConnectionTest extends Component<Props, State> {
  constructor(props) {
    super(props);
    const button = this.changeButtonState();
    this.state = {
      errorMessage: '',
      successMessage: '',
      openErrorDialog: false,
      openSuccessDialog: false,
      isValidate: null,
      providerImg: null,
      buttonState: button
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.imapMessageLoading && !nextProps.imapMessageLoading) {
      // imap connection test done
      if (!nextProps.imapIsError) {
        const button = this.changeButtonState(true);
        this.setState({
          isValidate: true,
          successMessage: `このメールアドレスへimapでの接続に成功しました。受信箱に${nextProps.imapMailCount}通のメールがあります。`,
          openSuccessDialog: true,
          buttonState: button
        })
      } else {
        const button = this.changeButtonState(false);
        this.setState({
          isValidate: false,
          errorMessage: `エラー：${nextProps.imapErrorMessage}`,
          openErrorDialog: true,
          buttonState: button
        })
      }
    }
    switch (nextProps.randomPersonalInfo.mailAccount.provider) {
      case 'Yahoo':
        this.setState({ providerImg: Yahoo });
        break;
      case 'Outlook':
        this.setState({ providerImg: Outlook });
        break;
      case 'Gmail':
        this.setState({ providerImg: gmail });
        break;
      case 'Yandex':
        this.setState({ providerImg: Yandex });
        break;
      default:
        this.setState({ providerImg: ownDomain });
    }
  };

  /**
   * 親フォームから呼ばれてstateを返す
   * @returns {*}
   */
  sendState = () => this.props.randomPersonalInfo.mailAccount;

  /**
   * stateを初期化する
   */
  initState = () => {
    const button = this.changeButtonState();
    this.setState({
      errorMessage: '',
      successMessage: '',
      openErrorDialog: false,
      openSuccessDialog: false,
      isValidate: null,
      providerImg: null,
      buttonState: button
    })
  }

  isValidated = () => {
    if (this.state.isValidate) {
      return true
    }
    if (this.state.isValidate === null) {
      this.setState({
        openErrorDialog: true,
        errorMessage: 'このメールアカウントで接続テストを行ってください。'
      });
      return false;
    }
    this.setState({
      openErrorDialog: true,
      errorMessage: 'このメールアカウントでは、imap接続ができません。\nアカウントが削除されていないか？\nパスワードがあっているか？\nを確認してください。'
    })
  }

  changeButtonState = result => {
    switch (result) {
      case true:
        return (
          <Button
            size="lg"
            color="success"
          >
            <CheckCircle />接続確認完了
          </Button>
        )
      case false:
        return (
          <Button
            size="lg"
            color="warning"
            onClick={this.handleImapConnectionTest}
          >
            <HighlightOff />接続できません。
          </Button>
        )
      default:
        return (
          <Button
            size="lg"
            color="primary"
            onClick={this.handleImapConnectionTest}
          >
            <MailTest />メール接続テスト
          </Button>
        )
    }
  }

  handleImapConnectionTest = () =>{
    this.props.startTestImapConnection(this.props.randomPersonalInfo.mailAccount);
  }

  closeErrorSnackbar = () => {
    this.setState({
      openErrorDialog: false,
      errorMessage: ''
    });
  }

  closeSuccessSnackbar = () => {
    this.setState({
      openSuccessDialog: false,
      successMessage: ''
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.props.imapMessageLoading} spinner text="サーバーへ接続中・・・・">
      <GridContainer justify="center">
        <GridItem xs={12} sm={10} md={10}>
          <GridContainer>
            <GridItem xs={12} sm={2}>
              <FormLabel className={classes.labelHorizontal}>
                E-mail
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={9} md={9}>
              <CustomInput
                labelText="メールアドレス"
                id="mailAddress"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.props.randomPersonalInfo.mailAccount.mailAddress,
                  type: 'email',
                  disabled: true
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={1} md={1}>
              <img
                style={providerImageStyle}
                src={getProviderImage(this.props.randomPersonalInfo.mailAccount.provider)}
                alt={this.props.randomPersonalInfo.mailAccount.provider}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={2}>
              <FormLabel className={classes.labelHorizontal}>
                アカウントID:
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={4}>
              <CustomInput
                id="accountId"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.props.randomPersonalInfo.mailAccount.accountId,
                  type: 'text',
                  disabled: true
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={2}>
              <FormLabel className={classes.labelHorizontal}>
                パスワード:
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={4}>
              <CustomInput
                id="pass"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.props.randomPersonalInfo.mailAccount.password,
                  type: 'text',
                  disabled: true
                }}
              />
            </GridItem>

          </GridContainer>
        <GridContainer justify="center">
          <GridItem>
            {this.state.buttonState}
          </GridItem>
        </GridContainer>
        </GridItem>
        <Snackbar
          place="bc"
          color="warning"
          icon={AddAlert}
          message={this.state.errorMessage}
          open={this.state.openErrorDialog}
          closeNotification={() =>
            this.closeErrorSnackbar()
          }
          close
        />
        <Snackbar
          place="bc"
          color="success"
          icon={AddAlert}
          message={this.state.successMessage}
          open={this.state.openSuccessDialog}
          closeNotification={() => this.closeSuccessSnackbar()}
          close
        />
      </GridContainer>
      </Loadable>
    );
  }
}

export default withStyles(formAddStyle)(StepMailConnectionTest);
