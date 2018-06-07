// @flow
import React from 'react';

import moment from 'moment';
import generatePassword from 'password-generator';
// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import { InputAdornment } from 'material-ui';
import InputLabel from 'material-ui/Input/InputLabel';
import Tooltip from 'material-ui/Tooltip';
import FormLabel from 'material-ui/Form/FormLabel';
import FormControl from 'material-ui/Form/FormControl';
import Switch from 'material-ui/Switch';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';

// @material-ui/icons
import FolderShared from 'material-ui-icons/FolderShared';
import AddAlert from 'material-ui-icons/AddAlert';
import Refresh from 'material-ui-icons/Refresh';

// core components
import { GridContainer, ItemGrid, Button, CustomInput, Snackbar } from '../../../ui';

import formAddStyle from '../../../assets/jss/material-dashboard-pro-react/views/formAddStyle';

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

type Props = {
  classes: Object
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
  errorMessage: string,
  openErrorSnackbar: false
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
      firstName: '',
      firstNameState: '',
      gender: true,
      birthDate: '',
      birthDateState: '',
      postalCode: '',
      postalCodeState: '',
      errorMessage: '',
      openErrorSnackbar: false
    };
  }

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
      errorMsg += 'メール提供元を選択してください。\n';
    }
    if (!this.isRequiredLength(this.state.accountId, 8)) {
      this.setState({ accountIdState: 'error' });
      errorMsg += 'アカウントIDは8文字以上です。\n';
    }

    if (!this.isRequiredLength(this.state.password, 8)) {
      this.setState({ passwordState: 'error' });
      errorMsg += 'パスワードは8文字以上です。\n';
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

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer style={stepContent}>
          <GridContainer container justify="center" style={groupBoxTop}>
            <ItemGrid xs={12} sm={3} md={3}>
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
                    Yahoo!メール
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="Outlook"
                  >
                    Outlook
                  </MenuItem>
                </Select>
              </FormControl>
            </ItemGrid>
            <ItemGrid xs={12} sm={4} md={4}>
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
                      <Tooltip title="ランダムアカウントIDを再取得" position="bottom">
                        <Button
                          size="xs"
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
            </ItemGrid>
            <ItemGrid xs={12} sm={4} md={4}>
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
                      <Tooltip title="ランダムパスワードを再取得" position="bottom">
                        <Button
                          size="xs"
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
            </ItemGrid>
          </GridContainer>
        </GridContainer>
        <GridContainer style={stepContent}>
          <GridContainer style={groupBox} container justify="center">
            <GridContainer>
              <ItemGrid xs={12} sm={2} md={2}>
                <FormLabel className={classes.labelHorizontal}>姓名</FormLabel>
              </ItemGrid>
              <ItemGrid xs={12} sm={3} md={3}>
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
              </ItemGrid>
              <ItemGrid xs={12} sm={3} md={3}>
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
              </ItemGrid>
              <ItemGrid xs={12} sm={2} md={2}>
                <Tooltip title="ランダムな個人情報を再取得します。" positions="bottom">
                  <Button color="primary">
                    <Refresh />
                    ランダムデータ再取得
                  </Button>
                </Tooltip>
              </ItemGrid>
            </GridContainer>
            <GridContainer>
              <ItemGrid xs={12} sm={2} md={2}>
                <FormLabel className={classes.labelHorizontalSwitchLeft}>男</FormLabel>
                <Switch
                  checked={this.state.gender}
                  onChange={this.handleChangeGender('gender')}
                  value="gender"
                  classes={{
                    checked: classes.switchChecked,
                    bar: classes.switchBarChecked,
                    icon: classes.switchIcon,
                    default: classes.switchUnchecked,
                    iconChecked: classes.switchIconChecked
                  }}
                />
                <FormLabel className={classes.labelHorizontalSwitchRight}>女</FormLabel>
              </ItemGrid>
              <ItemGrid xs={12} sm={3} md={3}>
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
              </ItemGrid>
              <ItemGrid xs={12} sm={3} md={3}>
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
              </ItemGrid>
              <ItemGrid xs={12} sm={2} md={2}>
                <Tooltip title="設定画面で保存した個人情報を読込ます。" positions="bottom">
                  <Button color="primary">
                    <FolderShared />
                    既存のデータを使用
                  </Button>
                </Tooltip>
              </ItemGrid>
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
    );
  }
}

export default withStyles(formAddStyle)(Steps00);