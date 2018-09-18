// @flow
import React from 'react';
import moment from 'moment';
import Loadable from 'react-loading-overlay';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Check from '@material-ui/icons/Check';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import AddAlert from '@material-ui/icons/AddAlert';
import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';
import CustomInput from '../../ui/CustomInput/CustomInput';
import Button from '../../ui/CustomButtons/Button';
import Clearfix from '../../ui/Clearfix/Clearfix';
import Snackbar from '../../ui/Snackbar/Snackbar';
import { SaveAltIcon } from '../../assets/icons/index';

import settingPageStyle from '../../assets/jss/material-dashboard-pro-react/views/settingsPage';
import type PersonalInfoType from '../../types/personalInfo';

import prefectures from '../Commons/prefecture';

const iconStyle = {
  width: '18px',
  height: '18px'
};

type Props = {
  classes: Object,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  personalInfo: PersonalInfoType,
  // startGetPersonalInfo: () => void,
  startSavePersonalInfo: () => void
};

type State = {
  lastName: string,
  lastNameState: string,
  firstName: string,
  firstNameState: string,
  lastNameKana: string,
  lastNameKanaState: string,
  firstNameKana: string,
  firstNameKanaState: string,
  gender: number,
  birthDate: string,
  postalCode: string,
  postalCodeState: string,
  prefecture: string,
  useDefault: boolean,
  errorMessage: string,
  openSuccessSnackbar: boolean,
  openErrorSnackbar: boolean
};

class PreferencesPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      lastName: this.props.personalInfo.lastName,
      lastNameState: '',
      firstName: this.props.personalInfo.firstName,
      firstNameState: '',
      lastNameKana: this.props.personalInfo.lastNameKana,
      lastNameKanaState: '',
      firstNameKana: this.props.personalInfo.firstNameKana,
      firstNameKanaState: '',
      gender: this.props.personalInfo.gender,
      birthDate: this.props.personalInfo.birthDate,
      postalCode: this.props.personalInfo.postalCode,
      postalCodeState: '',
      prefecture: this.props.personalInfo.prefecture,
      useDefault: this.props.personalInfo.useDefault,
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
      case 'lastName':
        if (this.isRequired(event.target.value)) {
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
        if (this.isRequired(event.target.value)) {
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
      case 'postalCode':
        if (this.isPostalCode(event.target.value)) {
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
   * ひらがなチェック
   *
   * @param checkString
   * @returns {*}
   */
  isHiragana = checkString => checkString.match(/^[\u3040-\u309f]/);

  /**
   * カタカナチェック
   *
   * @param checkString
   * @returns {*}
   */
  isKatakana = checkString => checkString.match(/^[\u30a0-\u30ff]/);

  /**
   * 半角英文字チェック
   *
   * @param checkString
   * @returns {boolean}
   */
  isAlphabet = checkString => !checkString.match(/[^A-Za-z]+/);

  /**
   * 7ケタ数字チェック
   * @param checkString
   * @returns {*}
   */
  isPostalCode = checkString => checkString.match(/[0-9]{7}/);

  /**
   * 性別ラジオボタン変更
   *
   * @param event
   */
  handleChangeGender = event => {
    let val = 0;
    if (event.target.value === '1') {
      val = 1;
    }
    this.setState({
      gender: val
    });
  };

  /**
   * チェックボックス値変更
   */
  handleCheckBoxClicked = event => {
    this.setState({ useDefault: event.target.checked });
  };

  /**
   * データ保存
   *
   * 保存前にデータをチェック
   */
  saveSettings = () => {
    let errorMsg = '';
    if (this.state.useDefault) {
      if (this.state.lastName.length === 0) {
        this.setState({ lastNameState: 'error' });
        errorMsg += '姓(漢字)は必須項目です。\n';
      } else {
        this.setState({ lastNameState: 'success' });
      }

      if (this.state.firstName.length === 0) {
        this.setState({ firstNameState: 'error' });
        errorMsg += '名(漢字)は必須項目です。\n';
      } else {
        this.setState({ firstNameState: 'success' });
      }

      if (this.state.lastNameKana.length === 0) {
        this.setState({ lastNameKanaState: 'error' });
        errorMsg += 'せい(ひらがな)は、必須項目です。\n';
      } else if (!this.isHiragana(this.state.lastNameKana)) {
        errorMsg += 'せい（ひらがな）に、平仮名以外が含まれていませんか？\n';
      } else {
        this.setState({ lastNameKanaState: 'success' });
      }

      if (this.state.firstNameKana.length === 0) {
        this.setState({ firstNameKanaState: 'error' });
        errorMsg += 'めい(ひらがな)は、必須項目です。\n';
      } else if (!this.isHiragana(this.state.firstNameKana)) {
        errorMsg += 'めい(ひらがな)に、平仮名以外が含まれていませんか？\n';
      } else {
        this.setState({ firstNameKanaState: 'success' });
      }

      if (this.state.postalCode.length === 0) {
        this.setState({ postalCodeState: 'error' });
        errorMsg += '郵便番号は必須項目です。\n';
      } else if (!this.isPostalCode(this.state.postalCode)) {
        errorMsg += '郵便番号に半角数字以外が含まれていませんか？\n';
      } else {
        this.setState({ postalCodeState: 'success' });
      }

      if (!moment(this.state.birthDate, ['YYYY/MM/DD'], true).isValid()) {
        this.setState({ birthDateState: 'error' });
        errorMsg += '生年月日が有効な日付ではありません。';
      } else {
        this.setState({ birthDateState: 'success' });
      }

      if (errorMsg.length > 0) {
        this.setState({
          openErrorSnackbar: true,
          errorMessage: errorMsg
        });
        return;
      }
    }

    // save settings
    const personalInfo = {
      lastName: this.state.lastName,
      firstName: this.state.firstName,
      lastNameKana: this.state.lastNameKana,
      firstNameKana: this.state.firstNameKana,
      gender: this.state.gender,
      birthDate: this.state.birthDate,
      postalCode: this.state.postalCode,
      prefecture: this.state.prefecture,
      address1: '',
      useDefault: this.state.useDefault
    };
    this.props.startSavePersonalInfo(personalInfo);
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

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.props.isLoading} spinner text="サーバーと通信中・・・・">
        <GridContainer justify="center">
          <GridContainer>
            <GridItem xs={12} sm={12} md={1} />
            <GridItem xs={12} sm={12} md={11}>
              <div className={`${classes.checkboxAndRadio} ${classes.checkboxAndRadioHorizontal}`}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.useDefault}
                      tabIndex={-1}
                      onChange={this.handleCheckBoxClicked}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked
                      }}
                    />
                  }
                  classes={{
                    label: classes.label
                  }}
                  label="メール・ブログアカウント作成時に以下の個人情報を使う"
                />
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={1} />
            <GridItem xs={12} sm={12} md={11}>
              <div className={!this.state.useDefault ? classes.groupBoxDisabled : classes.groupBox}>
                <GridContainer>
                  <GridItem xs={12} sm={2} md={3}>
                    <FormLabel
                      className={
                        !this.state.useDefault
                          ? classes.labelHorizontalDisabled
                          : classes.labelHorizontal
                      }
                    >
                      漢字
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={5} md={4}>
                    <CustomInput
                      success={this.state.lastNameState === 'success'}
                      error={this.state.lastNameState === 'error'}
                      labelText="姓"
                      id="lastName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'lastName'),
                        value: this.state.lastName,
                        type: 'text',
                        disabled: !this.state.useDefault
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={5} md={4}>
                    <CustomInput
                      success={this.state.firstNameState === 'success'}
                      error={this.state.firstNameState === 'error'}
                      labelText="名"
                      id="firstName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'firstName'),
                        value: this.state.firstName,
                        type: 'text',
                        disabled: !this.state.useDefault
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2} md={3}>
                    <FormLabel
                      className={
                        !this.state.useDefault
                          ? classes.labelHorizontalDisabled
                          : classes.labelHorizontal
                      }
                    >
                      ふりがな(ひらがな)
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={5} md={4}>
                    <CustomInput
                      success={this.state.lastNameKanaState === 'success'}
                      error={this.state.lastNameKanaState === 'error'}
                      labelText="せい"
                      id="lastNameKana"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'lastNameKana'),
                        value: this.state.lastNameKana,
                        type: 'text',
                        disabled: !this.state.useDefault
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={5} md={4}>
                    <CustomInput
                      success={this.state.firstNameKanaState === 'success'}
                      error={this.state.firstNameKanaState === 'error'}
                      labelText="めい"
                      id="firstNameKana"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'firstNameKana'),
                        value: this.state.firstNameKana,
                        type: 'text',
                        disabled: !this.state.useDefault
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={1} />
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <div
                      className={`${classes.checkboxAndRadio} ${
                        classes.checkboxAndRadioHorizontal
                      }`}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={this.state.gender === 0}
                            onChange={this.handleChangeGender}
                            value="0"
                            name="gender_male"
                            aria-label="0"
                            icon={<FiberManualRecord className={classes.radioUnchecked} />}
                            checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                            classes={{
                              checked: classes.radio
                            }}
                            disabled={!this.state.useDefault}
                          />
                        }
                        classes={{
                          label: !this.state.useDefault ? classes.labelDisabled : classes.label
                        }}
                        label="男性"
                      />
                    </div>
                    <div
                      className={`${classes.checkboxAndRadio} ${
                        classes.checkboxAndRadioHorizontal
                      }`}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={this.state.gender === 1}
                            onChange={this.handleChangeGender}
                            value="1"
                            name="gender_female"
                            aria-label="1"
                            icon={<FiberManualRecord className={classes.radioUnchecked} />}
                            checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                            classes={{
                              checked: classes.radio
                            }}
                            disabled={!this.state.useDefault}
                          />
                        }
                        classes={{
                          label: !this.state.useDefault ? classes.labelDisabled : classes.label
                        }}
                        label="女性"
                      />
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      success={this.state.postalCodeState === 'success'}
                      error={this.state.postalCodeState === 'error'}
                      labelText="郵便番号"
                      id="postalCode"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'postalCode'),
                        value: this.state.postalCode,
                        type: 'text',
                        disabled: !this.state.useDefault
                      }}
                      helpText="（-）ハイフンなしで7桁"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <InputLabel
                        htmlFor="prefecture-select"
                        className={
                          !this.state.useDefault ? classes.selectLabelDisabled : classes.selectLabel
                        }
                      >
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
                          id: 'prefecture-select',
                          disabled: !this.state.useDefault
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
                  <GridItem xs={12} sm={12} md={1} />
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3} md={3}>
                    <FormLabel
                      className={
                        !this.state.useDefault
                          ? classes.labelHorizontalDisabled
                          : classes.labelHorizontal
                      }
                    >
                      生年月日
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={3} md={4}>
                    <CustomInput
                      success={this.state.birthDateState === 'success'}
                      error={this.state.birthDateState === 'error'}
                      labelText="生年月日"
                      id="birthDate"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.inputFormField(event, 'birthDate'),
                        value: this.state.birthDate,
                        placeholder: '西暦/月/日',
                        type: 'text',
                        disabled: !this.state.useDefault
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3} md={5} />
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={11} md={9} />
                  <GridItem xs={12} sm={1} md={3}>
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
          message={<span id="login_error">既定の個人情報を保存しました。</span>}
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

export default withStyles(settingPageStyle)(PreferencesPage);
