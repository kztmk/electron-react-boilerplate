// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { withStyles } from 'material-ui/styles';
import Checkbox from 'material-ui/Checkbox';
import FormControl from 'material-ui/Form/FormControl';
import FormLabel from 'material-ui/Form/FormLabel';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import InputLabel from 'material-ui/Input/InputLabel';
import Radio from 'material-ui/Radio';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import PermIdentity from 'material-ui-icons/PermIdentity';
import Check from 'material-ui-icons/Check';
import FiberManualRecord from 'material-ui-icons/FiberManualRecord';
import AddAlert from 'material-ui-icons/AddAlert';
import {
  GridContainer,
  ItemGrid,
  IconCard,
  CustomInput,
  Button,
  Clearfix,
  Snackbar
} from '../../ui';
import { SaveAltIcon } from '../../asets/icons';

import settingPageStyle from '../../asets/jss/material-dashboard-pro-react/views/settingsPage';

const iconStyle = {
  width: '18px',
  height: '18px'
};

type Props = {
  classes: Object
};

type State = {
  lastNameKanji: string,
  lastNameKanjiState: string,
  firstNameKanji: string,
  firstNameKanjiState: string,
  lastNameKana: string,
  lastNameKanaState: string,
  firstNameKana: string,
  firstNameKanaState: string,
  lastNameKatakana: string,
  lastNameKatakanaState: string,
  firstNameKatakana: string,
  firstNameKatakanaState: string,
  lastNameHepburn: string,
  lastNameHepburnState: string,
  firstNameHepburn: string,
  firstNameHepburnState: string,
  gender: string,
  birthDate: string,
  postalCode: string,
  postalCodeState: string,
  prefecture: string,
  prefectureState: string,
  useDefault: boolean,
  errorMessage: string,
  openErrorSnackbar: boolean
};

class SettingsPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      lastNameKanji: '',
      lastNameKanjiState: '',
      firstNameKanji: '',
      firstNameKanjiState: '',
      lastNameKana: '',
      lastNameKanaState: '',
      firstNameKana: '',
      firstNameKanaState: '',
      lastNameKatakana: '',
      lastNameKatakanaState: '',
      firstNameKatakana: '',
      firstNameKatakanaState: '',
      lastNameHepburn: '',
      lastNameHepburnState: '',
      firstNameHepburn: '',
      firstNameHepburnState: '',
      gender: '',
      birthDate: '',
      postalCode: '',
      postalCodeState: '',
      prefecture: '',
      prefectureState: '',
      useDefault: false,
      errorMessage: '',
      openErrorSnackbar: false
    };
  }

  inputFormField = (event, fieldName) => {
    switch (fieldName) {
      case 'lastNameKanji':
        if (this.isRequired(event.target.value)) {
          this.setState({
            lastNameKanji: event.target.value,
            lastNameKanjiState: 'success'
          });
        } else {
          this.setState({
            lastNameKanji: event.target.value,
            lastNameKanjiState: 'error'
          });
        }
        break;
      case 'firstNameKanji':
        if (this.isRequired(event.target.value)) {
          this.setState({
            firstNameKanji: event.target.value,
            firstNameKanjiState: 'success'
          });
        } else {
          this.setState({
            firstNameKanji: event.target.value,
            firstNameKanjiState: 'error'
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
      case 'lastNameKatakana':
        if (this.isKatakana(event.target.value)) {
          this.setState({
            lastNameKatakana: event.target.value,
            lastNameKatakanaState: 'success'
          });
        } else {
          this.setState({
            lastNameKatakana: event.target.value,
            lastNameKatakanaState: 'error'
          });
        }
        break;
      case 'firstNameKatakana':
        if (this.isKatakana(event.target.value)) {
          this.setState({
            firstNameKatakana: event.target.value,
            firstNameKatakanaState: 'success'
          });
        } else {
          this.setState({
            firstNameKatakana: event.target.value,
            firstNameKatakanaState: 'error'
          });
        }
        break;
      case 'lastNameHepburn':
        if (this.isAlphabet(event.target.value)) {
          this.setState({
            lastNameHepburn: event.target.value,
            lastNameHepburnState: 'success'
          });
        } else {
          this.setState({
            lastNameHepburn: event.target.value,
            lastNameHepburnState: 'error'
          });
        }
        break;
      case 'firstNameHepburn':
        if (this.isAlphabet(event.target.value)) {
          this.setState({
            firstNameHepburn: event.target.value,
            firstNameHepburnState: 'success'
          });
        } else {
          this.setState({
            firstNameHepburn: event.target.value,
            firstNameHepburnState: 'error'
          });
        }
        break;
      case 'postalCode':
        if (this.isPostalcode(event.target.value)) {
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
        this.setState({ birthDate: event.target.value });
        break;
      default:
    }
  };

  isRequired = value => value.length > 0;

  isHiragana = checkString => {
    return checkString.match(/^[\u3040-\u309f]/);
  };

  isKatakana = checkString => {
    return checkString.match(/^[\u30a0-\u30ff]/);
  };

  isAlphabet = checkString => {
    return checkString.match(/[^A-Za-z]+/);
  };

  isPostalcode = checkString => {
    return checkString.match(/[0-9]{7}/);
  };

  handleChangeGender = event => {
    this.setState({
      gender: event.target.value
    });
  };

  handleCheckBoxClicked = () => {
    this.setState({ useDefault: !this.state.useDefault });
  };

  saveSettings = () => {
    let errorMsg = '';
    if (this.state.lastNameKanji.length === 0) {
      this.setState({ lastNameKanjiState: 'error' });
      errorMsg += '姓(漢字)は必須項目です。\n';
    }

    if (this.state.firstNameKanji.length === 0) {
      this.setState({ firstNameKanjiState: 'error' });
      errorMsg += '名(漢字)は必須項目です。\n';
    }

    if (this.state.lastNameKana.length === 0) {
      this.setState({ lastNameKanaState: 'error' });
      errorMsg += 'せい(ひらがな)は、必須項目です。\n';
    } else if (this.state.lastNameKanaState !== 'success') {
      errorMsg += 'せい（ひらがな）に、平仮名以外が含まれていませんか？\n';
    }

    if (this.state.firstNameKana.length === 0) {
      this.setState({ firstNameKanaState: 'error' });
      errorMsg += 'めい(ひらがな)は、必須項目です。\n';
    } else if (this.state.firstNameKanaState !== 'success') {
      errorMsg += 'めい(ひらがな)に、平仮名以外が含まれていませんか？\n';
    }

    if (this.state.lastNameKatakana.length === 0) {
      this.setState({ lastNameKatakanaState: 'error' });
      errorMsg += 'セイ(カタカナ)は、必須項目です。\n';
    } else if (this.state.lastNameKatakanaState !== 'success') {
      errorMsg += 'セイ（カタカナ）に、カタカナ以外が含まれていませんか？\n';
    }

    if (this.state.firstNameKatakana.length === 0) {
      this.setState({ firstNameKatakanaState: 'error' });
      errorMsg += 'メイ(カタカナ)は、必須項目です。\n';
    } else if (this.state.firstNameKatakanaState !== 'success') {
      errorMsg += 'メイ(カタカナ)に、カタカナ以外が含まれていませんか？\n';
    }

    if (this.state.lastNameHepburn.length === 0) {
      this.setState({ lastNameHepburnState: 'error' });
      errorMsg += '姓(ローマ字)は必須項目です。\n';
    } else if (this.state.lastNameHepburnState !== 'success') {
      errorMsg += '姓（ローマ字）に、半角英文字以外が含まれていませんか？\n';
    }

    if (this.state.firstNameHepburn.length === 0) {
      this.setState({ firstNameHepburnState: 'error' });
      errorMsg += '名(ローマ字)は、必須項目です。\n';
    } else if (this.state.firstNameHepburnState !== 'success') {
      errorMsg += '名(ローマ字)に、半角英文字以外が含まれていませんか？\n';
    }

    if (this.state.postalCode.length === 0) {
      this.setState({ postalCodeState: 'error' });
      errorMsg += '郵便番号は必須項目です。\n';
    } else if (this.state.postalCodeState !== 'success') {
      errorMsg += '郵便番号に半角数字以外が含まれていませんか？\n';
    }

    if (!moment(this.state.birthDate).isValid()) {
      this.setState({ birthDateState: 'error' });
      errorMsg += '生年月日が有効な日付ではありません。';
    }

    if (errorMsg.length > 0) {
      this.setState({
        openErrorSnackbar: true,
        errorMessage: errorMsg
      });
    }

    // save settings
  };

  handleErrorSnackbarClose = () => {
    this.setState({ openErrorSnackbar: false });
  };

  selectMenuItems = () => {
    const prefectures = [
      '北海道',
      '青森県',
      '岩手県',
      '宮城県',
      '秋田県',
      '山形県',
      '福島県',
      '茨城県',
      '栃木県',
      '群馬県',
      '埼玉県',
      '千葉県',
      '東京都',
      '神奈川県',
      '新潟県',
      '富山県',
      '石川県',
      '福井県',
      '山梨県',
      '長野県',
      '岐阜県',
      '静岡県',
      '愛知県',
      '三重県',
      '滋賀県',
      '京都府',
      '大阪府',
      '兵庫県',
      '奈良県',
      '和歌山県',
      '鳥取県',
      '島根県',
      '岡山県',
      '広島県',
      '山口県',
      '徳島県',
      '香川県',
      '愛媛県',
      '高知県',
      '福岡県',
      '佐賀県',
      '長崎県',
      '熊本県',
      '大分県',
      '宮崎県',
      '鹿児島県',
      '沖縄県'
    ];

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

  handleSelectPrefecture = event => {
    this.setState({ prefecture: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer container justify="center" className={classes.marginReset}>
        <GridContainer justify="center">
          <ItemGrid xs={12} sm={12} md={1} />
          <ItemGrid xs={12} sm={12} md={10}>
            <IconCard
              icon={PermIdentity}
              iconColor="rose"
              title="使用する個人情報 - "
              category="メール・ブログ作成時"
              content={
                <div>
                  <GridContainer justify="flex-end" className={classes.cardContentRight}>
                    <ItemGrid xs={12} sm={12} md={9} />
                    <ItemGrid
                      xs={12}
                      sm={12}
                      md={3}
                      className={classes.labelHorizontalLessUpperSpace}
                    >
                      <div className={classes.buttonGroupStyle}>
                        <div className={classes.buttonGroup}>
                          <Button
                            color="primary"
                            customClass={classes.lastButton}
                            onClick={this.saveSettings}
                          >
                            <SaveAltIcon style={iconStyle} />
                            保存
                          </Button>
                        </div>
                      </div>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={12} md={1} />
                    <ItemGrid xs={12} sm={12} md={11}>
                      <div
                        className={
                          classes.checkboxAndRadio + ' ' + classes.checkboxAndRadioHorizontal
                        }
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              tabIndex={-1}
                              onClick={() => this.handleCheckBoxClicked()}
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
                    </ItemGrid>
                  </GridContainer>
                  <div
                    className={!this.state.useDefault ? classes.groupBoxDisabled : classes.groupBox}
                  >
                    <GridContainer>
                      <ItemGrid xs={12} sm={2} md={3}>
                        <FormLabel
                          className={
                            !this.state.useDefault
                              ? classes.labelHorizontalDisabled
                              : classes.labelHorizontal
                          }
                        >
                          漢字
                        </FormLabel>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={5} md={4}>
                        <CustomInput
                          success={this.state.lastNameKanjiState === 'success'}
                          error={this.state.lastNameKanjiState === 'error'}
                          labelText="姓"
                          id="lastNameKanji"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.inputFormField(event, 'lastNameKanji'),
                            value: this.state.lastNameKanji,
                            type: 'text',
                            disabled: !this.state.useDefault
                          }}
                        />
                      </ItemGrid>
                      <ItemGrid xs={12} sm={5} md={4}>
                        <CustomInput
                          success={this.state.firstNameKanjiState === 'success'}
                          error={this.state.firstNameKanjiState === 'error'}
                          labelText="名"
                          id="firstNameKanji"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.inputFormField(event, 'firstNameKanji'),
                            value: this.state.firstNameKanji,
                            type: 'text',
                            disabled: !this.state.useDefault
                          }}
                        />
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </GridContainer>
                    <GridContainer>
                      <ItemGrid xs={12} sm={2} md={3}>
                        <FormLabel
                          className={
                            !this.state.useDefault
                              ? classes.labelHorizontalDisabled
                              : classes.labelHorizontal
                          }
                        >
                          ふりがな(ひらがな)
                        </FormLabel>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={5} md={4}>
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
                      </ItemGrid>
                      <ItemGrid xs={12} sm={5} md={4}>
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
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </GridContainer>
                    <GridContainer>
                      <ItemGrid xs={12} sm={2} md={3}>
                        <FormLabel
                          className={
                            !this.state.useDefault
                              ? classes.labelHorizontalDisabled
                              : classes.labelHorizontal
                          }
                        >
                          フリガナ(カタカナ)
                        </FormLabel>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={5} md={4}>
                        <CustomInput
                          success={this.state.lastNameKatakanaState === 'success'}
                          error={this.state.lastNameKatakanaState === 'error'}
                          labelText="セイ"
                          id="lastNameKatakana"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.inputFormField(event, 'lastNameKatakana'),
                            value: this.state.lastNameKatakana,
                            type: 'text',
                            disabled: !this.state.useDefault
                          }}
                        />
                      </ItemGrid>
                      <ItemGrid xs={12} sm={5} md={4}>
                        <CustomInput
                          success={this.state.firstNameKatakanaState === 'success'}
                          error={this.state.firstNameKatakanaState === 'error'}
                          labelText="メイ"
                          id="firstNameKatakana"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.inputFormField(event, 'firstNameKatakana'),
                            value: this.state.firstNameKatakana,
                            type: 'text',
                            disabled: !this.state.useDefault
                          }}
                        />
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </GridContainer>
                    <GridContainer>
                      <ItemGrid xs={12} sm={2} md={3}>
                        <FormLabel
                          className={
                            !this.state.useDefault
                              ? classes.labelHorizontalDisabled
                              : classes.labelHorizontal
                          }
                        >
                          ローマ字
                        </FormLabel>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={5} md={4}>
                        <CustomInput
                          success={this.state.lastNameHepburnState === 'success'}
                          error={this.state.lastNameHepburnState === 'error'}
                          labelText="Last Name"
                          id="lastNameHepburn"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.inputFormField(event, 'lastNameHepburn'),
                            value: this.state.lastNameHepburn,
                            type: 'text',
                            disabled: !this.state.useDefault
                          }}
                        />
                      </ItemGrid>
                      <ItemGrid xs={12} sm={5} md={4}>
                        <CustomInput
                          success={this.state.firstNameHepburnState === 'success'}
                          error={this.state.firstNameHepburnState === 'error'}
                          labelText="First Name"
                          id="firstNameHepburn"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.inputFormField(event, 'firstNameHepburn'),
                            value: this.state.firstNameHepburn,
                            type: 'text',
                            disabled: !this.state.useDefault
                          }}
                        />
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </GridContainer>
                    <GridContainer>
                      <ItemGrid xs={12} sm={12} md={3}>
                        <div
                          className={`${classes.checkboxAndRadio} ${
                            classes.checkboxAndRadioHorizontal
                          }`}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={this.state.gender === 'm'}
                                onChange={this.handleChangeGender}
                                value="m"
                                name="gender_male"
                                aria-label="m"
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
                                checked={this.state.gender === 'f'}
                                onChange={this.handleChangeGender}
                                value="f"
                                name="gender_female"
                                aria-label="f"
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
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={4}>
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
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={4}>
                        <FormControl fullWidth className={classes.selectFormControl}>
                          <InputLabel
                            htmlFor="prefecture-select"
                            className={
                              !this.state.useDefault
                                ? classes.selectLabelDisabled
                                : classes.selectLabel
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
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={1} />
                    </GridContainer>
                    <GridContainer>
                      <ItemGrid xs={12} sm={3} md={3}>
                        <FormLabel
                          className={
                            !this.state.useDefault
                              ? classes.labelHorizontalDisabled
                              : classes.labelHorizontal
                          }
                        >
                          生年月日
                        </FormLabel>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={3} md={4}>
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
                      </ItemGrid>
                      <ItemGrid xs={12} sm={3} md={5} />
                    </GridContainer>
                    <Clearfix />
                  </div>
                </div>
              }
            />
          </ItemGrid>
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

export default withStyles(settingPageStyle)(SettingsPage);
