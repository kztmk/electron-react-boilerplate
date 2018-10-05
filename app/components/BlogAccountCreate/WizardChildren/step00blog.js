/* eslint-disable react/no-unused-state,prefer-destructuring */
// @flow
import React from 'react';
import Loadable from 'react-loading-overlay';
import moment from 'moment';
import generatePassword from 'password-generator';

// material-ui components
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
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

import Fc2 from '../../../assets/img/blogs/fc2.png';
import Webnode from '../../../assets/img/blogs/webnode.png';
import Livedoor from '../../../assets/img/blogs/livedoor.png';
import Seesaa from '../../../assets/img/blogs/seesaa.png';
import Ameba from '../../../assets/img/blogs/ameba.png';
import Rakuten from '../../../assets/img/blogs/rakuten.png';
import Kokolog from '../../../assets/img/blogs/kokolog.png';
import Yaplog from '../../../assets/img/blogs/yaplog.png';
import Ninjya from '../../../assets/img/blogs/ninja.png';
import Hatena from '../../../assets/img/blogs/hatena.png';
import Webryblog from '../../../assets/img/blogs/webryblog.png';
import Wpcom from '../../../assets/img/blogs/wpcom.png';
import Goo from '../../../assets/img/blogs/goo.png';
import prefectures from '../../Commons/prefecture';
import type MailAccountType from '../../../types/mailAccount';

// TODO
// fc2 -------->comp
// webnode
// livedoor---->comp
// seesaa
// ameba
// rakuten
// kokolog
// yaplog
// ninjya
// hatena
// webryblog
// wpcom
// goo
//
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

const legendStyle = {
  margin: '10px 0 10px 60px',
  fontWeight: 'bold'
};

type Props = {
  classes: Object,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  personalInfo: PersonalInfoType,
  randomPersonalInfo: PersonalInfoType,
  startGetRandomPersonalInfo: () => void,
  startClearPersonalInfo: () => void
};

type State = {
  provider: string,
  mailAddress: string,
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
  forceUseDefault: boolean,
  forceUseRAndom: boolean,
  errorMessage: string,
  openErrorSnackbar: boolean,
  init: boolean,
  mailAccount: MailAccountType
};

/**
 * blogAccount自動取得のWizard画面 Step0
 */
class Steps00blog extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      provider: '',
      mailAddress: '',
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
      gender: true,
      birthDate: '',
      birthDateState: '',
      postalCode: '',
      postalCodeState: '',
      prefecture: '',
      errorMessage: '',
      openErrorSnackbar: false,
      forceUseDefault: false,
      forceUseRandom: false,
      init: true,
      mailAccount: {}
    };
  }

  componentWillReceiveProps = nextProps => {
    if (!nextProps.isLoading && !nextProps.isFailure) {
      const accountMeta = nextProps.randomPersonalInfo.address1;
      let accountMetaData = [];
      let mailAddress = '';
      let accountId = '';
      let password = '';

      if (accountMeta.length > 0) {
        accountMetaData = accountMeta.split(':');
        console.log(accountMetaData);
      }
      if (accountMetaData.length === 3) {
        mailAddress = accountMetaData[2];
        accountId = accountMetaData[0];
        password = accountMetaData[1];
      }

      if (this.state.mailAddress.length > 0 && !this.state.init) {
        mailAddress = this.state.mailAddress;
      }

      if (this.state.accountId.length > 0 && !this.state.init) {
        accountId = this.state.accountId;
      }

      if (this.state.password.length > 0 && !this.state.init) {
        password = this.state.password;
      }

      if (
        (!this.state.forceUseDefault && !nextProps.personalInfo.useDefault) ||
        this.state.forceUseRandom
      ) {
        this.setState({
          mailAddress,
          accountId,
          password,
          lastName: nextProps.randomPersonalInfo.lastName.trim(),
          lastNameKana: nextProps.randomPersonalInfo.lastNameKana.trim(),
          firstName: nextProps.randomPersonalInfo.firstName.trim(),
          firstNameKana: nextProps.randomPersonalInfo.firstNameKana.trim(),
          gender: nextProps.randomPersonalInfo.gender === 1,
          birthDate: nextProps.randomPersonalInfo.birthDate.trim(),
          postalCode: nextProps.randomPersonalInfo.postalCode.trim(),
          prefecture: nextProps.randomPersonalInfo.prefecture.trim(),
          mailAccount: nextProps.randomPersonalInfo.mailAccount
        });
      } else {
        this.setState({
          mailAddress,
          accountId,
          password,
          lastName: nextProps.personalInfo.lastName.trim(),
          lastNameKana: nextProps.personalInfo.lastNameKana.trim(),
          firstName: nextProps.personalInfo.firstName.trim(),
          firstNameKana: nextProps.personalInfo.firstNameKana.trim(),
          gender: nextProps.personalInfo.gender === 1,
          birthDate: nextProps.personalInfo.birthDate.trim(),
          postalCode: nextProps.personalInfo.postalCode.trim(),
          prefecture: nextProps.personalInfo.prefecture.trim(),
          mailAccount: nextProps.randomPersonalInfo.mailAccount
        });
      }
    }

    // error get random personalInfo
    if (!nextProps.isLoading && nextProps.isFailure) {
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
    this.props.startClearPersonalInfo();
    this.setState({
      mailAddress: '',
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
      init: true
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
    this.setState({ provider: event.target.value });
  };

  isInteger = digits => {
    const myRegx = /^[1-9]\d|0$/;
    return digits.test(myRegx);
  };

  /**
   * ランダムな文字列でaccountIdを作成
   *
   * 文字列長をaccountId欄に入力すれば優先、default length 8
   */
  handleGenerateAccountId = () => {
    let acLength = 8;
    const newAcLength = parseInt(this.state.accountId, 10);
    if (!Number.isNaN(newAcLength)) {
      if (newAcLength > 8) {
        acLength = newAcLength;
      }
    }
    const newAccountId = generatePassword(acLength, false, /[a-zA-Z0-9]/);
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
        if (this.isRequiredLength(event.target.value, 8)) {
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
      case 'lastName':
        if (event.target.value.length > 0) {
          this.setState({
            lastName: event.target.value,
            lastNameState: 'success'
          });
        } else {
          this.setState({
            lastName: event.target.value,
            lastNameState: 'error'
          });
        }
        break;
      case 'firstName':
        if (event.target.value.length > 0) {
          this.setState({
            firstName: event.target.value,
            firstNameState: 'success'
          });
        } else {
          this.setState({
            firstName: event.target.value,
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
      errorMsg += 'ブログ提供元を選択してください。\n';
    }

    if (!this.isRequiredLength(this.state.accountId, 8)) {
      this.setState({ accountIdState: 'error' });
      errorMsg += 'アカウントIDは8文字以上です。\n';
    } else {
      this.setState({ accountIdState: 'success' });
    }

    if (!/^[a-z0-9]+$/.test(this.state.accountId)) {
      this.setState({ accountIdState: 'error' });
      errorMsg += 'アカウントIDに半角英数以外が含まれています。\n';
    }

    if (!this.isRequiredLength(this.state.password, 8)) {
      this.setState({ passwordState: 'error' });
      errorMsg += 'パスワードは8文字以上です。\n';
    } else {
      this.setState({ passwordState: 'success' });
    }

    if (this.state.lastName.length === 0) {
      this.setState({ lastNameState: 'error' });
      errorMsg += '姓は必須です。\n';
    } else {
      this.setState({ lastNameState: 'success' });
    }

    if (this.state.firstName.length === 0) {
      this.setState({ firstNameState: 'error' });
      errorMsg += '名は必須です。\n';
    } else {
      this.setState({ firstNameState: 'success' });
    }

    if (!moment(this.state.birthDate, ['YYYY/MM/DD'], true).isValid()) {
      this.setState({ birthDateState: 'error' });
      errorMsg += '生年月日(西暦/月/日)を正しく入力してください。\n';
    } else {
      this.setState({ birthDateState: 'success' });
    }

    if (!/^[0-9]{7}$/.test(this.state.postalCode)) {
      this.setState({ postalCodeState: 'error' });
      errorMsg += '郵便番号は、7桁の数字でハイフンは不要です。\n';
    } else {
      this.setState({ postalCodeState: 'success' });
    }

    if (this.state.prefecture.length < 3) {
      errorMsg += '都道府県を選択してください。';
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
      console.log('not select provider');
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

  handleSetRandomData = () => {
    this.setState({ init: false });
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

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.props.isLoading} spinner text="個人情報取得中・・・・">
        <div>
          <GridContainer style={stepContent}>
            <GridContainer>
              <legend style={legendStyle}>使用メールアドレス:{this.state.mailAddress}</legend>
            </GridContainer>
            <GridContainer container justify="center" style={groupBoxTop}>
              <GridItem xs={12} sm={3} md={3}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="provider-select" className={classes.selectLabel}>
                    ブログ提供元
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
                      ブログ提供元
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="fc2"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="FC2" src={Fc2} className={classes.avatar} />
                        FC2
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="webnode"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="webnode" src={Webnode} className={classes.avatar} />
                        webnode
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="livedoor"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="Livedoor" src={Livedoor} className={classes.avatar} />
                        Livedoor
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="seesaa"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="Seesaa" src={Seesaa} className={classes.avatar} />
                        Seesaa
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="ameba"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="アメーバ" src={Ameba} className={classes.avatar} />
                        アメーバー
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="rakuten"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="楽天" src={Rakuten} className={classes.avatar} />
                        楽天
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="kokolog"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="ココログ" src={Kokolog} className={classes.avatar} />
                        ココログ
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="yaplog"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="Yaplog" src={Yaplog} className={classes.avatar} />
                        Yaplog
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="ninjya"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="忍者" src={Ninjya} className={classes.avatar} />
                        忍者
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="hatena"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="はてな" src={Hatena} className={classes.avatar} />
                        はてな
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="webryblog"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="ウェブリブログ" src={Webryblog} className={classes.avatar} />
                        ウェブリブログ
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="wpcom"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="WordPress.com" src={Wpcom} className={classes.avatar} />
                        WordPress.com
                      </div>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="goo"
                    >
                      <div style={selectAvatarStyle}>
                        <Avatar alt="gooブログ" src={Goo} className={classes.avatar} />
                        gooブログ
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
                        <Tooltip title="ランダムアカウントIDを再取得">
                          <Button
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
                  <Tooltip title="設定画面で保存した個人情報を読込ます。" placement="bottom">
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

export default withStyles(formAddStyle)(Steps00blog);
