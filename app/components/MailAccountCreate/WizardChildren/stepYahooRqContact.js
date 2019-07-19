// @flow
import React from 'react';
import validator from "email-validator";

// material-ui components
import { withStyles } from '@material-ui/core/styles';
// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';

// core components
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import CustomInput from '../../../ui/CustomInput/CustomInput';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import extendedFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle';


// import yahooQuestions from './questionsForApply';
const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 20px 20px',
  borderRadius: '20px',
  margin: '20px 0'
};

type Props = {
  classes: Object
};

type State = {
  contactMailAddress: string,
  yahooContactMailAccountId: string,
  yahooContactMailCounter: number,
  yahooContactMailDomain: string,
  answerState: string,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * mailAccount自動取得時のYahoo!メール用追加情報フォーム
 */
class StepYahooRqContact extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      contactMailAddress: '',
      yahooContactMailAccountId: '',
      yahooContactMailCounter: 0,
      yahooContactMailDomain: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false
    };
  }

  /**
   * 親フォームから呼ばれてstateを返す
   * @returns {*}
   */
  sendState = () => {
    const plusInfo = [];
    plusInfo.contactMailAddress = this.state.contactMailAddress;

    // gmail, gmailAliasSequenceから自動作成したアドレス
    const defaultContactMailAddress = `${this.state.yahooContactMailAccountId}+y${this.state.yahooContactMailCounter}@${this.state.yahooContactMailDomain}`;

    console.log(`defaultContactMail: ${defaultContactMailAddress}`);
    // 自動作成したアドレスと使用する連絡先アドレスが違う場合
    if (defaultContactMailAddress !== this.state.contactMailAddress) {
      // AliasSequenceをカウントアップしないために渡すデータをクリア
      console.log('--contact mailaddress info clear');
      this.setState({
        yahooContactMailAccountId: '',
        yahooContactMailCounter: 0,
        yahooContactMailDomain: ''
      });
    }

    return plusInfo;
  };

  initState = () => {
    this.setState({
      contactMailAddress: '',
      answerState: '',
      errorMessage: '',
      openErrorSnackbar: false
    });
  };

  setData = () => {
  };

  setContactMailAddress = ({ yahooContactAliasNumber,
                                          yahooContactAliasAccountId,
                                          yahooContactAliasDomain }) => {
    this.setState({
      contactMailAddress:  `${yahooContactAliasAccountId}+y${yahooContactAliasNumber}@${yahooContactAliasDomain}`,
      yahooContactMailAccountId: yahooContactAliasAccountId,
      yahooContactMailCounter: yahooContactAliasNumber,
      yahooContactMailDomain: yahooContactAliasDomain
    });
  }

  /**
   * 連絡先メールアドレスの入力
   *
   * @param event
   * @param fieldName
   */
  changeFormField = (event, fieldName) => {
    if (fieldName === 'contactMailAddress') {
      if (validator.validate(event.target.value)) {
        this.setState({
          contactMailAddress: event.target.value,
          answerState: 'success'
        });
      } else {
        this.setState({
          contactMailAddress: event.target.value,
          answerState: 'error'
        });
      }
    }
  };

  /**
   * 入力完了時(フォーム移動時)に全入力項目をチェック
   * @returns {boolean}
   */
  isValidated = () => {
    let mailValidate = false;
    if(validator.validate(this.state.contactMailAddress)) {
      mailValidate = true;
      console.log('--yes, validate');
    } else {
      console.log('--no, invalid mailaddress');
    }
    let errorMsg = '';
    if (!mailValidate) {
      errorMsg += '有効なメールアドレスを入力してください。';
    }
    if (errorMsg.length > 0) {
      this.setState({
        errorMessage: errorMsg,
        openErrorSnackbar: true
      });
      return false;
    }
    return true;
  };

  /**
   * 入力項目全チェック時にエラー表示を閉じる
   */
  handleErrorSnackbarClose = () => {
    this.setState({ openErrorSnackbar: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridContainer style={groupBox}>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={8} md={8}>
              <CustomInput
                success={this.state.answerState === 'success'}
                error={this.state.answerState === 'error'}
                labelText="連絡先メールアドレス"
                id="contactMailAddress"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.contactMailAddress,
                  onChange: event => this.changeFormField(event, 'contactMailAddress'),
                  type: 'text'
                }}
              />
            </GridItem>
          </GridContainer>
        </GridContainer>
        <Snackbar
          color="warning"
          place="bc"
          icon={AddAlert}
          open={this.state.openErrorSnackbar}
          closeNotification={this.handleErrorSnackbarClose}
          close
          message={<span id="login_error">{this.state.errorMessage}</span>}
        />
      </GridContainer>
    );
  }
}

export default withStyles(extendedFormsStyle)(StepYahooRqContact);
