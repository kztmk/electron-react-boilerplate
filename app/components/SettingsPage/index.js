// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Checkbox from 'material-ui/Checkbox';
import FormLabel from 'material-ui/Form/FormLabel';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import Radio from 'material-ui/Radio';
import PermIdentity from 'material-ui-icons/PermIdentity';
import Check from 'material-ui-icons/Check';
import FiberManualRecord from 'material-ui-icons/FiberManualRecord';
import { GridContainer, ItemGrid, IconCard, CustomInput, Button, Clearfix } from '../../ui';
import { primaryColor } from '../../asets/jss/material-dashboard-pro-react';
import { SaveAltIcon } from '../../asets/icons';

const styles = {
  cardRoot: {
    width: '75vw'
  },
  marginReset: {
    margin: '-70px'
  },
  label: {
    cursor: 'pointer',
    paddingLeft: '0',
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    display: 'inline-flex',
    transition: '0.3s ease all'
  },
  labelDisabled: {
    cursor: 'pointer',
    paddingLeft: '0',
    color: 'rgba(0, 0, 0, 0.26)',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    display: 'inline-flex',
    transition: '0.3s ease all'
  },
  labelHorizontal: {
    color: 'rgba(0, 0, 0, 0.7)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    paddingTop: '39px',
    marginRight: '0',
    '@media (min-width: 992px)': {
      float: 'right'
    }
  },
  labelHorizontalDisabled: {
    color: 'rgba(0, 0, 0, 0.26)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    paddingTop: '39px',
    marginRight: '0',
    '@media (min-width: 992px)': {
      float: 'right'
    }
  },
  labelHorizontalLessUpperSpace: {
    color: 'rgba(0, 0, 0, 0.26)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    paddingTop: '22px',
    marginRight: '0',
    '@media (min-width: 992px)': {
      float: 'right'
    }
  },
  checkboxAndRadio: {
    position: 'relative',
    display: 'block',
    marginTop: '10px',
    marginBottom: '10px'
  },
  checkboxAndRadioHorizontal: {
    position: 'relative',
    display: 'block',
    '&:first-child': {
      marginTop: '10px'
    },
    '&:not(:first-child)': {
      marginTop: '-14px'
    },
    marginTop: '0',
    marginBottom: '0'
  },
  checked: {
    color: primaryColor
  },
  checkedIcon: {
    width: '20px',
    height: '20px',
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '3px'
  },
  uncheckedIcon: {
    width: '0px',
    height: '0px',
    padding: '9px',
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '3px'
  },
  radio: {
    color: primaryColor
  },
  radioChecked: {
    width: '20px',
    height: '20px',
    border: `1px solid ${primaryColor}`,
    borderRadius: '50%'
  },
  radioUnchecked: {
    width: '0px',
    height: '0px',
    padding: '9px',
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '50%'
  },
  groupBox: {
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '30px',
    padding: '20px'
  },
  groupBoxDisabled: {
    border: '1px solid rgba(0, 0, 0, .25)',
    borderRadius: '30px',
    padding: '20px'
  },
  cardContentRight: {
    padding: '0',
    position: 'relative'
  },
  buttonGroupStyle: {
    marginTop: '-65px'
  },
  buttonGroup: {
    position: 'relative',
    margin: '10px 1px',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  lastButton: {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    margin: '0',
    '&:hover': {
      zIndex: '2'
    }
  }
};

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
  useDefault: boolean
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
      useDefault: false
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
                          <Button color="primary" customClass={classes.lastButton}>
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
                        <CustomInput
                          success={this.state.prefectureState === 'success'}
                          error={this.state.prefectureState === 'error'}
                          labelText="都道府県"
                          id="prefecture"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.inputFormField(event, 'prefecture'),
                            value: this.state.prefecture,
                            type: 'text',
                            disabled: !this.state.useDefault
                          }}
                        />
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
      </GridContainer>
    );
  }
}

export default withStyles(styles)(SettingsPage);
