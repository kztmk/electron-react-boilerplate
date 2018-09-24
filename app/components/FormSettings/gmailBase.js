/* eslint-disable react/no-unused-state */
// @flow
import React from 'react';
import Loadable from 'react-loading-overlay';
import moment from 'moment';
import generatePassword from 'password-generator';
import validator from 'email-validator';
import SweetAlert from 'react-bootstrap-sweetalert';
// material-ui components
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

// @material-ui/icons
import FolderShared from '@material-ui/icons/FolderShared';
import AddAlert from '@material-ui/icons/AddAlert';
import Refresh from '@material-ui/icons/Refresh';
import Cancel from '@material-ui/icons/Cancel';
import ContactMail from '@material-ui/icons/ContactMail';
import MarkunreadMailbox from '@material-ui/icons/MarkunreadMailbox';

// core components
import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';
import Button from '../../ui/CustomButtons/Button';
import CustomInput from '../../ui/CustomInput/CustomInput';
import Snackbar from '../../ui/Snackbar/Snackbar';

import formAddStyle from '../../assets/jss/material-dashboard-pro-react/views/formAddStyle';
import type PersonalInfoType from '../../types/personalInfo';

import type AliasMailType from '../../types/aliasMailInfo';
import prefectures from '../Commons/prefecture';
import { SaveAltIcon } from '../../assets/icons';
import PuppeteerEmail from '../MailAccountCreate/puppeteerEmail';
import type MailAccountType from '../../types/mailAccount';

const stepContent = {
  padding: '5px',
  marginTop: '-10px'
};

const groupBoxTop = {
  border: '1px solid #333',
  padding: '10px 0 10px 0',
  borderRadius: '20px',
  margin: '0'
};

const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 10px 20px',
  borderRadius: '20px',
  margin: '20px 0 0 0'
};

const iconStyle = {
  width: '18px',
  height: '18px'
};

type Props = {
  classes: Object,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  isAliasLoading: boolean,
  isAliasFailure: boolean,
  errorMessageAlias: string,
  personalInfo: PersonalInfoType,
  randomPersonalInfo: PersonalInfoType,
  startGetRandomPersonalInfo: () => void,
  gmailBase: AliasMailType,
  startSaveAlias: AliasMailType => void,
  startDeleteAlias: AliasMailType => void,
  openImapMail: MailAccountType => void
};

type State = {
  accountId: string,
  accountIdState: string,
  password: string,
  passwordState: string,
  domain: string,
  domainState: string,
  lastName: string,
  lastNameState: string,
  lastNameKana: string,
  lastNameKanaState: string,
  firstName: string,
  firstNameState: string,
  firstNameKana: string,
  firstNameKanaState: string,
  gender: boolean,
  birthDate: string,
  birthDateState: string,
  contactMail: string,
  contactMailState: string,
  postalCode: string,
  postalCodeState: string,
  prefecture: string,
  prefectureState: string,
  errorMessage: string,
  openErrorSnackbar: false,
  forceUseDefault: boolean,
  forceUseRandom: boolean,
  mode: string,
  sweetAlert: React.Node
};

/**
 * mailAccount自動取得のWizard画面 Step0
 */
class GmailBaseSettings extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      accountId: this.props.gmailBase.accountId,
      accountIdState: '',
      password: this.props.gmailBase.password,
      passwordState: '',
      domain: this.props.gmailBase.domain.length > 0 ? this.props.gmailBase.domain : 'gmail.com',
      domainState: '',
      lastName: this.props.gmailBase.lastName,
      lastNameState: '',
      lastNameKana: this.props.gmailBase.lastNameKana,
      lastNameKanaState: '',
      firstName: this.props.gmailBase.firstName,
      firstNameState: '',
      firstNameKana: this.props.gmailBase.firstNameKana,
      firstNameKanaState: '',
      gender: this.props.gmailBase.gender,
      birthDate: this.props.gmailBase.birthDate,
      birthDateState: '',
      contactMail: this.props.gmailBase.contactMail,
      contactMailState: '',
      postalCode: this.props.gmailBase.postalCode,
      postalCodeState: '',
      prefecture: this.props.gmailBase.prefecture,
      prefectureState: '',
      errorMessage: '',
      openErrorSnackbar: false,
      forceUseDefault: false,
      forceUseRandom: false,
      mode: '',
      sweetAlert: null
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.isAliasLoading && !nextProps.isAliasLoading) {
      if (!nextProps.isAliasFailure) {
        // gmail save success
        this.setState({
          accountId: nextProps.gmailBase.accountId,
          password: nextProps.gmailBase.password,
          domain: nextProps.gmailBase.domain,
          firstName: nextProps.gmailBase.firstName,
          firstNameKana: nextProps.gmailBase.firstNameKana,
          lastName: nextProps.gmailBase.lastName,
          lastNameKana: nextProps.gmailBase.lastNameKana,
          gender: nextProps.gmailBase.gender,
          birthDate: nextProps.gmailBase.birthDate,
          contactMail: nextProps.gmailBase.contactMail,
          postalCode: nextProps.gmailBase.postalCode,
          prefecture: nextProps.gmailBase.prefecture
        });

        if (this.state.mode === 'gmail-save') {
          // update state
          this.setState({
            sweetAlert: (
              <SweetAlert
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title="登録完了"
                onConfirm={() => this.hideAlert()}
                onCancel={() => this.hideAlert()}
                confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
              >
                Gmailの設定を保存しました。
              </SweetAlert>
            )
          });
        } else if (this.state.mode === 'gmail-delete') {
          this.setState({
            sweetAlert: (
              <SweetAlert
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title="削除完了"
                onConfirm={() => this.hideAlert()}
                onCancel={() => this.hideAlert()}
                confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
              >
                Gmailの設定を削除しました。
              </SweetAlert>
            )
          });
        }
        // message dialog on
      } else {
        // gmail save fail
        this.setState({
          sweetAlert: (
            <SweetAlert
              warning
              style={{ display: 'block', marginTop: '-100px' }}
              title="エラー発生"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
            >
              以下のエラーが発生しました:{nextProps.errorMessageAlias}
            </SweetAlert>
          )
        });
      }
    }
    if (this.props.isLoading && !nextProps.isLoading && !nextProps.isFailure) {
      if (
        (!this.state.forceUseDefault && !nextProps.personalInfo.useDefault) ||
        this.state.forceUseRandom
      ) {
        this.setState({
          lastName: nextProps.randomPersonalInfo.lastName,
          lastNameKana: nextProps.randomPersonalInfo.lastNameKana,
          firstName: nextProps.randomPersonalInfo.firstName,
          firstNameKana: nextProps.randomPersonalInfo.firstNameKana,
          gender: nextProps.randomPersonalInfo.gender === 1,
          birthDate: nextProps.randomPersonalInfo.birthDate,
          contactMail: '',
          postalCode: nextProps.randomPersonalInfo.postalCode,
          prefecture: nextProps.randomPersonalInfo.prefecture
        });
      } else {
        this.setState({
          accountId: nextProps.personalInfo.accountId,
          password: nextProps.personalInfo.password,
          domain: nextProps.personalInfo.domain,
          lastName: nextProps.personalInfo.lastName,
          lastNameKana: nextProps.personalInfo.lastNameKana,
          firstName: nextProps.personalInfo.firstName,
          firstNameKana: nextProps.personalInfo.firstNameKana,
          gender: nextProps.personalInfo.gender === 1,
          birthDate: nextProps.personalInfo.birthDate,
          contactMail: '',
          postalCode: nextProps.personalInfo.postalCode,
          prefecture: nextProps.personalInfo.prefecture
        });
      }
      if (nextProps.gmailBase.accountId.length === 0) {
        this.handleGenerateAccountId();
      }
      if (nextProps.gmailBase.password.length === 0) {
        this.handleGeneratePassword();
      }
    }

    // error get random personalInfo
    if (this.props.isLoading && !nextProps.isLoading && nextProps.isFailure) {
      this.setState({
        errorMessage: nextProps.errorMessage,
        openErrorSnackbar: true
      });
    }
  };

  /**
   * 性別switch変更時
   *
   * @param name
   * @returns {Function}
   */
  handleChangeGender = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  /**
   * ランダムな文字列でaccountIdを作成
   *
   * 文字列長をaccountId欄に入力すれば優先、default length 8
   */
  handleGenerateAccountId = () => {
    let acLength = 7;
    const newAcLength = parseInt(this.state.accountId, 10);
    if (!Number.isNaN(newAcLength)) {
      if (newAcLength > 8) {
        acLength = newAcLength - 1;
      }
    }
    const newAccountId =
      generatePassword(1, false, /[a-z]/) + generatePassword(acLength, false, /[a-z0-9]/);
    if (this.isRequiredLength(newAccountId, 8)) {
      this.setState({
        accountId: newAccountId.toLowerCase(),
        accountIdState: 'success'
      });
    } else {
      this.setState({
        accountId: newAccountId.toLowerCase(),
        accountIdState: 'error'
      });
    }
  };

  /**
   * ランダムな文字列でpasswordを作成
   *
   * 文字列長をpassword欄に入力すれば優先 default length 8
   */
  handleGeneratePassword = () => {
    let pwLength = 8;
    const newPwLength = parseInt(this.state.password, 10);
    if (!Number.isNaN(newPwLength)) {
      if (newPwLength > 8) {
        pwLength = newPwLength;
      }
    }

    let newPassword = '';
    while (!this.isStrongPassword(newPassword, pwLength)) {
      newPassword = generatePassword(pwLength, false, /[a-zA-Z0-9]/);
    }

    this.setState({ password: newPassword, passwordState: 'success' });
  };

  /**
   * Passwordルール
   *
   * @param password
   * @param length
   * @returns {boolean|*}
   */
  isStrongPassword = (password, length) => {
    const minLength = length;
    const uppercaseMinCount = 1;
    const lowercaseMinCount = 1;
    const numberMinCount = 1;
    const UPPERCASE_RE = /([A-Z])/g;
    const LOWERCASE_RE = /([a-z])/g;
    const NUMBER_RE = /([\d])/g;
    const NON_REPEATING_CHAR_RE = /([\w\d])\1{2,}/g;

    const uc = password.match(UPPERCASE_RE);
    const lc = password.match(LOWERCASE_RE);
    const n = password.match(NUMBER_RE);
    const nr = password.match(NON_REPEATING_CHAR_RE);

    return (
      password.length >= minLength &&
      !nr &&
      uc &&
      uc.length >= uppercaseMinCount &&
      lc &&
      lc.length >= lowercaseMinCount &&
      n &&
      n.length >= numberMinCount
    );
  };

  /**
   * 入力欄が変更されたときのメソッド
   *
   * @param event
   * @param fieldName
   */
  formFieldChange = (event, fieldName) => {
    switch (fieldName) {
      case 'accountId':
        if (
          this.isRequiredLength(event.target.value, 4) &&
          /^[A-Za-z0-9\.]+$/.test(event.target.value)
        ) {
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
      case 'password':
        if (this.isRequiredLength(event.target.value, 8)) {
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
      case 'domain':
        this.setState({ domain: event.target.value });
        break;
      case 'lastName':
        if (event.target.value.length > 0) {
          this.setState({
            lastName: event.target.value,
            lastNameKana: '',
            lastNameState: 'success'
          });
        } else {
          this.setState({
            lastName: event.target.value,
            lastNameKana: '',
            lastNameState: 'error'
          });
        }
        break;
      case 'firstName':
        if (event.target.value.length > 0) {
          this.setState({
            firstName: event.target.value,
            firstNameKana: '',
            firstNameState: 'success'
          });
        } else {
          this.setState({
            firstName: event.target.value,
            firstNameKana: '',
            firstNameState: 'error'
          });
        }
        break;
      case 'lastNameKana':
        if (this.isHiragana(event.target.value)) {
          this.setState({
            lastNameKana: event.target.value,
            lastNameKanaState: 'success'
          });
        } else {
          this.setState({
            lastNameKana: event.target.value,
            lastNameKanaState: 'error'
          });
        }
        break;
      case 'firstNameKana':
        if (this.isHiragana(event.target.value)) {
          this.setState({
            firstNameKana: event.target.value,
            firstNameKanaState: 'success'
          });
        } else {
          this.setState({
            firstNameKana: event.target.value,
            firstNameKanaState: 'error'
          });
        }
        break;
      case 'birthDate':
        if (moment(event.target.value, ['YYYY/MM/DD'], true).isValid()) {
          this.setState({
            birthDate: event.target.value,
            birthDateState: 'success'
          });
        } else {
          this.setState({
            birthDate: event.target.value,
            birthDateState: 'error'
          });
        }
        break;
      case 'contactMail':
        if (validator.validate(event.target.value)) {
          this.setState({
            contactMail: event.target.value,
            contactMailState: 'success'
          });
        } else {
          this.setState({
            contactMail: event.target.value,
            contactMailState: 'error'
          });
        }
        break;
      case 'postalCode':
        {
          const myRegx = /^[0-9]{7}$/;
          if (myRegx.test(event.target.value)) {
            this.setState({
              postalCode: event.target.value,
              postalCodeState: 'success'
            });
          } else {
            this.setState({
              postalCode: event.target.value,
              postalCodeState: 'error'
            });
          }
        }
        break;
      default:
    }
  };

  /**
   * 文字列長確認メソッド
   *
   * @param value
   * @param length
   * @returns {boolean}
   */
  isRequiredLength = (value, length) => value.length >= length;

  /**
   * ひらがなチェック
   *
   * @param checkString
   * @returns {*}
   */
  isHiragana = checkString => checkString.match(/^[\u3040-\u309f]/);

  /**
   * form移動時に全ての入力項目のチェック
   *
   * @returns {boolean}
   */
  isValidated = () => {
    let errorMsg = '';

    if (!this.isRequiredLength(this.state.accountId, 4)) {
      this.setState({ accountIdState: 'error' });
      errorMsg += 'アカウントIDは4文字以上です。\n';
    } else {
      this.setState({ accountIdState: 'success' });
    }

    if (!/^[A-Za-z0-9\.]+$/.test(this.state.accountId)) {
      this.setState({ accountIdState: 'error' });
      errorMsg += 'アカウントIDは英数字、ピリオドのみ使用できます。\n';
    }

    if (!this.isRequiredLength(this.state.password, 8)) {
      this.setState({ passwordState: 'error' });
      errorMsg += 'パスワードは8文字以上です。\n';
    } else {
      this.setState({ passwordState: 'success' });
    }

    if (!/^[a-zA-Z0-9!#$%&()*+,.:;=?@\[\]^_{}-]+$/.test(this.state.password)) {
      this.setState({ passwordState: 'error' });
      errorMsg += 'パスワードは半角英数字のみ使用できます。\n';
    }

    if (this.state.domain.length > 3) {
      this.setState({ domainState: 'success' });
    } else {
      this.setState({ domainState: 'error' });
      errorMsg += 'ドメイン名は必須です。\n';
    }

    if (this.state.lastName.length === 0) {
      this.setState({ lastNameState: 'error' });
      errorMsg += '姓は必須です。\n';
    }

    if (this.state.firstName.length === 0) {
      this.setState({ firstNameState: 'error' });
      errorMsg += '名は必須です。\n';
    }

    if (this.isHiragana(this.state.lastNameKana)) {
      this.setState({ lastNameKanaState: 'success' });
    } else {
      this.setState({ lastNameKanaState: 'error' });
      errorMsg += '姓(かな)は、ひらがなのみ使用できます。\n';
    }

    if (this.isHiragana(this.state.firstNameKana)) {
      this.setState({ firstNameKanaState: 'success' });
    } else {
      this.setState({ firstNameKanaState: 'error' });
      errorMsg += '名(かな)は、ひらがなのみ使用できます。\n';
    }

    if (!moment(this.state.birthDate, ['YYYY/MM/DD'], true).isValid()) {
      this.setState({ birthDateState: 'error' });
      errorMsg += '生年月日(西暦/月/日)を正しく入力してください。\n';
    }

    if (validator.validate(this.state.contactMail)) {
      this.setState({ contactMailState: 'success' });
    } else {
      this.setState({ contactMailState: 'error' });
      errorMsg += '再設定用メールアドレスを正しく入力してください。';
    }

    if (!/^[0-9]{7}$/.test(this.state.postalCode)) {
      this.setState({ postalCodeState: 'error' });
      errorMsg += '郵便番号は、7桁の数字でハイフンは不要です。\n';
    }

    if (this.state.prefecture.length === 0) {
      errorMsg += '都道府県を選択してください。\n';
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
   * フォーム移動時の入力チェックでエラーがあった場合のエラー表示
   */
  handleErrorSnackbarClose = () => {
    this.setState({
      openErrorSnackbar: false
    });
  };

  /**
   * ランダム個人情報をセット
   */
  handleSetRandomData = () => {
    this.setState({
      forceUseDefault: false,
      forceUseRandom: true
    });
    this.props.startGetRandomPersonalInfo();
  };

  handleSaveGmailAlias = () => {
    if (this.isValidated()) {
      this.setState({ mode: 'gmail-save' });
      const gmailAlias: AliasMailType = {
        provider: 'gmail',
        accountId: this.state.accountId,
        password: this.state.password,
        domain: this.state.domain,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        firstNameKana: this.state.firstNameKana,
        lastNameKana: this.state.lastNameKana,
        gender: this.state.gender,
        birthDate: this.state.birthDate,
        contactMail: this.state.contactMail,
        secretQuestion: '',
        secretAnswer: '',
        postalCode: this.state.postalCode,
        prefecture: this.state.prefecture
      };

      this.props.startSaveAlias(gmailAlias);
    }
  };

  handleDeleteGmailAlias = () => {
    this.setState({
      sweetAlert: (
        <SweetAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title="Gmailの設定を削除しますか?"
          onConfirm={() => this.proceedDelete()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
          cancelBtnCssClass={`${this.props.classes.button} ${this.props.classes.danger}`}
          confirmBtnText="削除"
          cancelBtnText="キャンセル"
          showCancel
        >
          Gmailの設定が削除されます。作成したエイリアスは、引き続き使用することができます。
        </SweetAlert>
      )
    });
  };

  proceedDelete = () => {
    this.setState({ mode: 'gmail-delete' });
    const gmailAlias: AliasMailType = {
      provider: 'gmail',
      accountId: this.state.accountId,
      password: this.state.password,
      domain: this.state.domain,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      firstNameKana: this.state.firstNameKana,
      lastNameKana: this.state.lastNameKana,
      gender: this.state.gender,
      birthDate: this.state.birthDate,
      contactMail: this.state.contactMail,
      secretQuestion: '',
      secretAnswer: '',
      postalCode: this.state.postalCode,
      prefecture: this.state.prefecture
    };

    this.props.startDeleteAlias(gmailAlias);
  };

  /**
   * 既定の個人情報をセット
   */
  handleSetDefaultData = () => {
    if (this.props.personalInfo.lastName.length > 0) {
      this.setState({
        lastName: this.props.personalInfo.lastName,
        lastNameKana: this.props.personalInfo.lastNameKana,
        firstName: this.props.personalInfo.firstName,
        firstNameKana: this.props.personalInfo.firstNameKana,
        gender: this.props.personalInfo.gender === 1,
        birthDate: this.props.personalInfo.birthDate,
        contactMail: '',
        postalCode: this.props.personalInfo.postalCode,
        prefecture: this.props.personalInfo.prefecture,
        forceUseDefault: true,
        forceUseRandom: false
      });
    } else {
      this.setState({
        errorMessage: '既定の個人情報は設定されていません。設定画面で設定してください。',
        openErrorSnackbar: true
      });
    }
  };

  hideAlert = () => {
    this.setState({
      sweetAlert: null
    });
  };

  /**
   * 都道府県選択用オプション作成
   * @returns {any[]}
   */
  selectMenuItems = () => {
    const { classes } = this.props;

    return prefectures.map(p => (
      <MenuItem
        key={p}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={p}
      >
        {p}
      </MenuItem>
    ));
  };

  /**
   * 都道府県選択
   * @param event
   */
  handleSelectPrefecture = event => {
    this.setState({ prefecture: event.target.value });
  };

  handleCreateGoogleAccount = () => {
    if (this.isValidated()) {
      // this.handleSaveGmailAlias();
      const user = {};
      user.provider = 'gmail';
      user.username = this.state.accountId;
      user.password = this.state.password;
      user.firstName = this.state.firstName;
      user.lastName = this.state.lastName;
      user.contactMail = this.state.contactMail;
      user.birthday = {};
      const birthdays = this.state.birthDate.split('/');
      if (birthdays.length === 3) {
        user.birthday.year = birthdays[0];
        const numOfMonth = parseInt(birthdays[1], 10);
        user.birthday.month = numOfMonth.toString();
        const numOfDays = parseInt(birthdays[2], 10);
        user.birthday.day = numOfDays.toString();
      }
      console.log('---g user==');
      console.log(user);

      const puppeteerEmail = new PuppeteerEmail(user);
      puppeteerEmail.signup(user);
    }
  };

  handleOpenImap = () => {
    if (this.isValidated()) {
      const mailAccount: MailAccountType = {
        key: '',
        accountId: `${this.state.accountId}@${this.state.domain}`,
        password: this.state.password,
        mailAddress: `${this.state.accountId}@${this.state.domain}`,
        provider: 'Gmail',
        createDate: 0,
        lastLogin: 0,
        tags: '',
        detailInfo: []
      };

      this.props.openImapMail(mailAccount);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.props.isLoading} spinner text="個人情報取得中・・・・">
        <div>
          <GridContainer style={stepContent}>
            <GridContainer container justify="center" style={groupBoxTop}>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  success={this.state.accountIdState === 'success'}
                  error={this.state.accountIdState === 'error'}
                  labelText="アカウントID:"
                  id="accountId"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="ランダムアカウントIDを再取得">
                          <Button
                            justIcon
                            size="sm"
                            color="primary"
                            onClick={() => this.handleGenerateAccountId()}
                          >
                            <Refresh />
                          </Button>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    value: this.state.accountId,
                    onChange: event => this.formFieldChange(event, 'accountId'),
                    type: 'text'
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  success={this.state.passwordState === 'success'}
                  error={this.state.passwordState === 'error'}
                  labelText="パスワード"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="ランダムパスワードを再取得">
                          <Button
                            justIcon
                            size="sm"
                            color="primary"
                            onClick={() => this.handleGeneratePassword()}
                          >
                            <Refresh />
                          </Button>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    value: this.state.password,
                    onChange: event => this.formFieldChange(event, 'password')
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  success={this.state.domainState === 'success'}
                  error={this.state.domainState === 'error'}
                  labelText="ドメイン"
                  id="domain"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: this.state.domain,
                    onChange: event => this.formFieldChange(event, 'domain')
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridContainer>
          <GridContainer style={stepContent}>
            <GridContainer style={groupBox} container justify="center">
              <GridContainer justify="center">
                <GridItem xs={12} sm={3} md={3}>
                  <CustomInput
                    success={this.state.lastNameState === 'success'}
                    error={this.state.lastNameState === 'error'}
                    labelText="姓"
                    id="lastName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => this.formFieldChange(event, 'lastName'),
                      value: this.state.lastName
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3} md={3}>
                  <CustomInput
                    success={this.state.firstNameState === 'success'}
                    error={this.state.firstNameState === 'error'}
                    labelText="名"
                    id="firstname"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => this.formFieldChange(event, 'firstName'),
                      value: this.state.firstName
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3} md={3}>
                  <Tooltip title="ランダムな個人情報を再取得します。">
                    <Button color="primary" onClick={() => this.handleSetRandomData()}>
                      <Refresh />
                      ランダムデータ再取得
                    </Button>
                  </Tooltip>
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={3} md={3}>
                  <CustomInput
                    success={this.state.lastNameKanaState === 'success'}
                    error={this.state.lastNameKanaState === 'error'}
                    labelText="せい"
                    id="lastNameKana"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => this.formFieldChange(event, 'lastNameKana'),
                      value: this.state.lastNameKana,
                      type: 'text'
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3} md={3}>
                  <CustomInput
                    success={this.state.firstNameKanaState === 'success'}
                    error={this.state.firstNameKanaState === 'error'}
                    labelText="めい"
                    id="firstNameKana"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => this.formFieldChange(event, 'firstNameKana'),
                      value: this.state.firstNameKana,
                      type: 'text'
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3} md={3}>
                  <Tooltip title="設定画面で保存した個人情報を読込みます。" placement="bottom">
                    <Button color="primary" onClick={() => this.handleSetDefaultData()}>
                      <FolderShared />
                      既存のデータを使用
                    </Button>
                  </Tooltip>
                </GridItem>
              </GridContainer>
              <GridContainer container justify="center">
                <GridItem xs={12} sm={3} md={3}>
                  <FormLabel className={classes.labelHorizontalSwitchLeft}>男</FormLabel>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.gender}
                        onChange={this.handleChangeGender('gender')}
                        value="gender"
                        classes={{
                          checked: classes.switchChecked,
                          bar: classes.switchBarChecked,
                          icon: classes.switchIcon,
                          iconChecked: classes.switchIconChecked
                        }}
                      />
                    }
                    label="女"
                  />
                </GridItem>
                <GridItem xs={12} sm={3} md={3}>
                  <CustomInput
                    success={this.state.birthDateState === 'success'}
                    error={this.state.birthDateState === 'error'}
                    labelText="生年月日(YYYY/MM/DD)"
                    id="birthDate"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => this.formFieldChange(event, 'birthDate'),
                      value: this.state.birthDate
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <CustomInput
                    success={this.state.contactMailState === 'success'}
                    error={this.state.contactMailState === 'error'}
                    labelText="再設定用メールアドレス"
                    id="contactMail"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => this.formFieldChange(event, 'contactMail'),
                      value: this.state.contactMail
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={3} md={3}>
                  <CustomInput
                    success={this.state.postalCodeState === 'success'}
                    error={this.state.postalCodeState === 'error'}
                    labelText="郵便番号(7ケタ)"
                    id="postalCode"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => this.formFieldChange(event, 'postalCode'),
                      value: this.state.postalCode,
                      placeholder: 'ハイフンなしで7桁の半角数字'
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3} md={3}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel htmlFor="prefecture-select" className={classes.selectLabel}>
                      都道府県名を選択
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={this.state.prefecture}
                      onChange={this.handleSelectPrefecture}
                      inputProps={{
                        name: 'prefectureSelect',
                        id: 'prefecture-select'
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        都道府県名
                      </MenuItem>
                      {this.selectMenuItems()}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={3} md={3} />
              </GridContainer>
            </GridContainer>
          </GridContainer>
          <GridContainer justify="center">
            <GridItem xs={12} sm={3} md={5}>
              <div className={classes.cardContentRight}>
                <div className={classes.buttonGroup}>
                  <Tooltip title="Googleアカウントの情報を保存します。">
                    <Button
                      color="primary"
                      className={classes.firstButton}
                      onClick={() => this.handleSaveGmailAlias()}
                    >
                      <SaveAltIcon style={iconStyle} />
                      保存
                    </Button>
                  </Tooltip>
                  <Tooltip title="Googleアカウント情報を削除します。">
                    <Button
                      color="primary"
                      className={classes.lastButton}
                      onClick={() => this.handleDeleteGmailAlias()}
                    >
                      <Cancel style={iconStyle} />
                      削除
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </GridItem>
            <GridItem xm={12} sm={1} md={1} />
            <GridItem xm={12} sm={2} md={2}>
              <Tooltip title="Gmailをimapで開けるかテストします。">
                <Button color="info" onClick={() => this.handleOpenImap()}>
                  <MarkunreadMailbox />
                  Gmailを開く
                </Button>
              </Tooltip>
            </GridItem>
            <GridItem xm={12} sm={1} md={1} />
            <GridItem xm={12} sm={2} md={2}>
              <Tooltip title="上記の情報でGoogleアカウントを作成します。">
                <Button color="rose" onClick={() => this.handleCreateGoogleAccount()}>
                  <ContactMail />
                  Gmailを作成
                </Button>
              </Tooltip>
            </GridItem>
          </GridContainer>
          {this.state.sweetAlert}
          <Snackbar
            color="warning"
            place="bc"
            icon={AddAlert}
            open={this.state.openErrorSnackbar}
            closeNotification={this.handleErrorSnackbarClose}
            close
            message={<span id="login_error">{this.state.errorMessage}</span>}
          />
        </div>
      </Loadable>
    );
  }
}

export default withStyles(formAddStyle)(GmailBaseSettings);
