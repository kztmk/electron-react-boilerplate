/* eslint-disable react/no-unused-state */
// @flow
import React from 'react';
import Loadable from 'react-loading-overlay';
import moment from 'moment';
import generatePassword from 'password-generator';
// material-ui components
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// @material-ui/icons
import FolderShared from '@material-ui/icons/FolderShared';
import AddAlert from '@material-ui/icons/AddAlert';
import Refresh from '@material-ui/icons/Refresh';

// core components
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import Button from '../../../ui/CustomButtons/Button';
import CustomInput from '../../../ui/CustomInput/CustomInput';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import formAddStyle from '../../../assets/jss/material-dashboard-pro-react/views/formAddStyle';
import type PersonalInfoType from '../../../types/personalInfo';

import Yahoo from '../../../assets/img/providerImage/y64.png';
import Gmail from '../../../assets/img/providerImage/gmail64.png';
import Yandex from '../../../assets/img/providerImage/yandex64.png';

import prefectures from '../../Commons/prefecture';
import type AliasMailType from '../../../types/aliasMailInfo';
import type MailAccountType from "../../../types/mailAccount";

const stepContent = {
  padding: '5px'
};


const groupBoxTop = {
  border: '1px solid #333',
  padding: '10px 0 20px 0',
  borderRadius: '20px',
  margin: '0'
};

const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 20px 20px',
  borderRadius: '20px',
  margin: '20px 0 0 0'
};

const selectAvatarStyle = {
  display: 'flex',
  alignItems: 'center'
};

type Props = {
  classes: Object,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  personalInfo: PersonalInfoType,
  randomPersonalInfo: PersonalInfoType,
  startGetRandomPersonalInfo: () => void,
  aliasInfo: Array<AliasMailType>
};

type State = {
  provider: string,
  accountId: string,
  accountIdState: string,
  password: string,
  passwordState: string,
  lastName: string,
  lastNameState: string,
  firstName: string,
  firstNameState: string,
  gender: boolean,
  birthDate: string,
  birthDateState: string,
  postalCode: string,
  postalCodeState: string,
  prefecture: string,
  errorMessage: string,
  openErrorSnackbar: false,
  forceUseDefault: boolean,
  forceUseRandom: boolean,
  yahooContactAliasNumber: number,
  yahooContactAliasAccountId: string,
  yahooContactAliasDomain: string,
  contactMailAccount: MailAccountType
};

/**
 * mailAccount自動取得のWizard画面 Step0
 */
class Steps00 extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      provider: '',
      accountId: '',
      accountIdState: '',
      password: '',
      passwordState: '',
      lastName: '',
      lastNameState: '',
      lastNameKana: '',
      firstName: '',
      firstNameState: '',
      firstNameKana: '',
      gender: false,
      birthDate: '',
      birthDateState: '',
      postalCode: '',
      postalCodeState: '',
      prefecture: '',
      errorMessage: '',
      openErrorSnackbar: false,
      forceUseDefault: false,
      forceUseRandom: false,
      yahooContactAliasNumber: 0,
      yahooContactAliasAccountId: '',
      yahooContactAliasDomain: '',
      contactMailAccount: null
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.isLoading && !nextProps.isLoading && !nextProps.isFailure) {
      this.handleGenerateAccountId();
      this.handleGeneratePassword();

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
          postalCode: nextProps.randomPersonalInfo.postalCode,
          prefecture: nextProps.randomPersonalInfo.prefecture
        });
      } else {
        this.setState({
          lastName: nextProps.personalInfo.lastName,
          lastNameKana: nextProps.personalInfo.lastNameKana,
          firstName: nextProps.personalInfo.firstName,
          firstNameKana: nextProps.personalInfo.firstNameKana,
          gender: nextProps.personalInfo.gender === 1,
          birthDate: nextProps.personalInfo.birthDate,
          postalCode: nextProps.personalInfo.postalCode,
          prefecture: nextProps.personalInfo.prefecture
        });
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
   * 親フォームから呼ばれてstateを返す
   * @returns {*}
   */
  sendState = () => this.state;

  /**
   * stateを初期化する
   */
  initState = () => {
    this.setState({
      provider: '',
      accountId: '',
      accountIdState: '',
      password: '',
      passwordState: '',
      lastName: '',
      lastNameState: '',
      lastNameKana: '',
      firstName: '',
      firstNameState: '',
      firstNameKana: '',
      gender: false,
      birthDate: '',
      birthDateState: '',
      postalCode: '',
      postalCodeState: '',
      errorMessage: '',
      openErrorSnackbar: false,
      forceUseDefault: false,
      forceUseRandom: false,
      yahooContactAliasNumber: 0,
      yahooContactAliasAccountId: '',
      yahooContactAliasDomain: '',
      contactMailAccount: null
    });
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
   * Provider選択時
   * @param event
   */
  handleSelectProvider = event => {
    let gmailInfo = {};
    let yandexInfo = {};
    switch (event.target.value) {
      case 'Gmail':
        gmailInfo = this.props.aliasInfo.find(alias => alias.provider === 'gmail');
        if (gmailInfo && gmailInfo.accountId.length > 0) {
          this.setState({
            provider: event.target.value,
            accountId: gmailInfo.accountId.trim(),
            password: gmailInfo.password.trim(),
            firstName: gmailInfo.firstName.trim(),
            lastName: gmailInfo.lastName.trim(),
            firstNameKana: gmailInfo.firstNameKana.trim(),
            lastNameKana: gmailInfo.lastNameKana.trim(),
            gender: gmailInfo.gender,
            postalCode: gmailInfo.postalCode.trim(),
            prefecture: gmailInfo.prefecture.trim()
          });
        } else {
          this.setState({
            errorMessage: '基になるGmailを設定画面で登録してください。',
            openErrorSnackbar: true
          });
        }
        break;
      case 'Yandex':
        yandexInfo = this.props.aliasInfo.find(alias => alias.provider === 'yandex');
        if (yandexInfo && yandexInfo.accountId.length > 0) {
          this.setState({
            provider: event.target.value,
            accountId: yandexInfo.accountId.trim(),
            password: yandexInfo.password.trim(),
            firstName: yandexInfo.firstName.trim(),
            lastName: yandexInfo.lastName.trim(),
            firstNameKana: yandexInfo.firstNameKana.trim(),
            lastNameKana: yandexInfo.lastNameKana.trim(),
            gender: yandexInfo.gender,
            postalCode: yandexInfo.postalCode.trim(),
            prefecture: yandexInfo.prefecture.trim()
          });
        } else {
          this.setState({
            errorMessage: '基になるYandexメールを設定画面で登録してください。',
            openErrorSnackbar: true
          });
        }
        break;
      default:
        // yahoo!メールの連絡先メールとしてGmailを使用するため、Gmailアカウントをチェック
        gmailInfo = this.props.aliasInfo.find(alias => alias.provider === 'gmail');
        if (gmailInfo && gmailInfo.accountId.length > 0) {
           const yahooContactMailAddress = {
             key: '',
             accountId: gmailInfo.accountId,
             password: gmailInfo.password,
             mailAddress: `${gmailInfo.accountId}@${gmailInfo.domain}`,
             provider: 'Gmail',
             createDate: 0,
             lastLogin: 0,
             tags: null,
             detailInfo: []
           }

            this.setState({
              accountId: 'Yahoo!から提供されます。',
              yahooContactAliasNumber: gmailInfo.sequenceCounter +1,
              yahooContactAliasAccountId: gmailInfo.accountId.trim(),
              yahooContactAliasDomain: gmailInfo.domain.trim(),
              contactMailAccount: yahooContactMailAddress
            })
        } else {
          // not have gmail account
          this.setState({
            errorMessage: 'Yahoo!メール作成に必要な連絡先メールアドレスとして使用するGmailアカウントを作成してください。',
            openErrorSnackbar: true
          });
        }
        this.setState({ provider: event.target.value });
    }
  };

  /**
   * ランダムな文字列でaccountIdを作成
   *
   * 文字列長をaccountId欄に入力すれば優先、default length 8
   */
  handleGenerateAccountId = () => {
    let acLength = 8;
    if (/^\d+$/.test(this.state.accountId) && this.state.accountId.length < 3) {
      const newAcLength = parseInt(this.state.accountId, 10);
      if (newAcLength < 32) {
        if (!Number.isNaN(newAcLength)) {
          if (newAcLength > 8) {
            acLength = newAcLength;
          }
        }
      } else {
        this.setState({
          errorMessage: '指定出来る桁数は、32以下です。',
          openErrorSnackbar: true
        })
      }
    }
    const newAccountId =
      generatePassword(1, false, /[a-z]/) + generatePassword(acLength -1, false, /[a-z0-9]/);
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
    if (/^\d+$/.test(this.state.password) && this.state.password.length < 3) {
      const newPwLength = parseInt(this.state.password, 10);
      if (newPwLength < 17) {
        if (!Number.isNaN(newPwLength)) {
          if (newPwLength > 8) {
            pwLength = newPwLength;
          }
        }
      } else {
        this.setState({
          errorMessage: '指定出来るパスワード桁数は、16以下です。',
          openErrorSnackbar: true
        })
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
        if (this.isRequiredLength(event.target.value, 8)) {
          this.setState({
            accountId: event.target.value,
            accountIdState: 'success'
          });
        } else {
          if (this.state.provider === 'Yahoo') {
            if(event.target.value === 'Yahoo!から提供されます。') {
              this.setState({
                accountId: event.target.value,
                accountIdState: 'success'
              })
              break;
            }
          }
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
   * form移動時に全ての入力項目のチェック
   *
   * @returns {boolean}
   */
  isValidated = () => {
    let errorMsg = '';
    if (this.state.provider.length === 0) {
      errorMsg += 'メール提供元を選択してください。\n';
    }

    if (this.state.provider === 'Yahoo') {
      if (this.state.yahooContactAliasNumber === 0) {
        errorMsg += 'Yahoo!メール作成には、連絡先メールアドレスが必要です。Gmailを使用しますので、まずはGmailを作成してください。\n';
      }
    }

    if (this.state.provider !== 'Gmail') {
      if (!this.isRequiredLength(this.state.accountId, 8)) {
        this.setState({ accountIdState: 'error' });
        errorMsg += 'アカウントIDは8文字以上です。\n';
      }
    } else {
      if (!this.isRequiredLength(this.state.accountId, 4)) {
        this.setState({ accountIdState: 'error' });
        errorMsg += 'アカウントIDは4文字以上です。\n';
      }
    }

    if (!this.isRequiredLength(this.state.password, 8)) {
      this.setState({ passwordState: 'error' });
      errorMsg += 'パスワードは8文字以上です。\n';
    }

    if (!/^[a-zA-Z0-9!#$%&()*+,.:;=?@\[\]^_{}-]+$/.test(this.state.password)) {
      this.setState({ passwordState: 'error' });
      errorMsg += 'パスワードに半角英数字・記号以外が使用されています。\n';
    }

    if (this.state.lastName.length === 0) {
      this.setState({ lastNameState: 'error' });
      errorMsg += '姓は必須です。\n';
    }

    if (this.state.firstName.length === 0) {
      this.setState({ firstNameState: 'error' });
      errorMsg += '名は必須です。\n';
    }

    if (!moment(this.state.birthDate, ['YYYY/MM/DD'], true).isValid()) {
      this.setState({ birthDateState: 'error' });
      errorMsg += '生年月日(西暦/月/日)を正しく入力してください。\n';
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
   * provider選択完了チェック 親から呼ばれるメソッド
   *
   * @returns {*}
   */
  getProvider = () => {
    if (this.state.provider.length === 0) {
      console.log('not selecte provider');
    } else {
      console.log(`selected provider:${this.state.provider}`);
      return this.state.provider;
    }
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

  /**
   * 既定の個人情報をセット
   */
  handleSetDefaultData = () => {
    if (this.props.personalInfo.lastName.length > 0) {
      this.setState({
        lastName: this.props.personalInfo.lastName,
        firstName: this.props.personalInfo.firstName,
        gender: this.props.personalInfo.gender === 1,
        birthDate: this.props.personalInfo.birthDate,
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

  toolTipsForPassword = () => {
    return 'ランダムパスワードを再取得<br />16以下の数字の入力で桁数指定。Gmail、Yandexは変更不可。';
  }

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.props.isLoading} spinner text="個人情報取得中・・・・">
        <div>
          <GridContainer style={stepContent}>
            <GridContainer container justify="center" style={groupBoxTop}>
              <GridItem xs={12} sm={3} md={3}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="provider-select" className={classes.selectLabel}>
                    メール提供元
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    value={this.state.provider}
                    onChange={this.handleSelectProvider}
                    inputProps={{
                      name: 'providerSelect',
                      id: 'provider-select'
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      メール提供元
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="Yahoo"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="Yahoo" src={Yahoo} className={classes.avatar} />
                        Yahoo!メール
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="Gmail"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="Gmail" src={Gmail} className={classes.avatar} />
                        Gmail
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="Yandex"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="Yandex" src={Yandex} className={classes.avatar} />
                        Yandex
                      </div>
                    </MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
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
                        <Tooltip title="ランダムアカウントIDを再取得、Gmail,Yandexは次の画面で変更します。">
                          <Button
                            justIcon
                            size="sm"
                            color="primary"
                            onClick={() => this.handleGenerateAccountId()}
                            disabled={(this.state.provider === 'Yandex') || (this.state.provider=== 'Gmail')}
                          >
                            <Refresh />
                          </Button>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    value: this.state.accountId,
                    onChange: event => this.formFieldChange(event, 'accountId'),
                    disabled: (this.state.provider === 'Yandex') || (this.state.provider=== 'Gmail'),
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
                        <Tooltip title= "ランダムパスワードを再取得。16以下の数字の入力で桁数指定。Gmail、Yandexは変更不可">
                          <Button
                            justIcon
                            size="sm"
                            color="primary"
                            onClick={() => this.handleGeneratePassword()}
                            disabled={(this.state.provider === 'Yandex') || (this.state.provider=== 'Gmail')}
                          >
                            <Refresh />
                          </Button>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    disabled: (this.state.provider === 'Yandex') || (this.state.provider=== 'Gmail'),
                    value: this.state.password,
                    onChange: event => this.formFieldChange(event, 'password')
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridContainer>
          <GridContainer style={stepContent}>
            <GridContainer style={groupBox} container justify="center">
              <GridContainer>
                <GridItem xs={12} sm={2} md={2}>
                  <FormLabel className={classes.labelHorizontal}>姓名</FormLabel>
                </GridItem>
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
                <GridItem xs={12} sm={2} md={2}>
                  <Tooltip title="ランダムな個人情報を再取得します。">
                    <Button color="primary" onClick={() => this.handleSetRandomData()}>
                      <Refresh />
                      ランダムデータ再取得
                    </Button>
                  </Tooltip>
                </GridItem>
              </GridContainer>
              <GridContainer container justify="center">
                <GridItem xs={12} sm={3} md={3}>
                  <FormLabel className={classes.labelHorizontalSwitchLeft}>男</FormLabel>
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
                  <FormLabel className={classes.labelHorizontalSwitchRight}>女</FormLabel>
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
                <GridItem xs={12} sm={2} md={2}>
                  <Tooltip title="設定画面で保存した個人情報を読込みます。" placement="bottom">
                    <Button color="primary" onClick={() => this.handleSetDefaultData()}>
                      <FolderShared />
                      既存のデータを使用
                    </Button>
                  </Tooltip>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2} md={2} />
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
              </GridContainer>
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
        </div>
      </Loadable>
    );
  }
}

export default withStyles(formAddStyle)(Steps00);
