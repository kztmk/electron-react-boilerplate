// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Datetime from 'react-datetime';
import moment from 'moment';
import FormLabel from 'material-ui/Form/FormLabel';
import FormControl from 'material-ui/Form/FormControl';
import TagsInput from 'react-tagsinput';
import InputLabel from 'material-ui/Input/InputLabel';
import MenuItem from 'material-ui/Menu/MenuItem';
import Select from 'material-ui/Select';
import Cancel from 'material-ui-icons/Cancel';
import AddAlert from 'material-ui-icons/AddAlert';

import { GridContainer, ItemGrid, HeaderCard, CustomInput, Button, Snackbar } from '../../ui';
import type MailAccountType from '../../types/mailAccount';
import {
  cardHeader,
  defaultFont,
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  roseCardHeader,
  primaryColor,
  primaryBoxShadow
} from '../../asets/jss/material-dashboard-pro-react';
import { SaveAltIcon } from '../../asets/icons';

const styles = {
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none'
  },
  cardHeader: {
    ...cardHeader,
    ...defaultFont,
    display: 'inline-block',
    textAlign: 'left'
  },
  cardPlainHeader: {
    marginLeft: 0,
    marginRight: 0
  },
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  roseCardHeader,
  cardTitle: {
    color: '#FFFFFF',
    marginTop: '0',
    marginBottom: '3px',
    ...defaultFont,
    fontSize: '1.3em'
  },
  cardSubtitle: {
    marginBottom: '0',
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: '14px'
  },
  cardActions: {
    padding: '14px',
    display: 'block',
    height: 'auto'
  },
  cardContent: {
    padding: '15px 20px',
    position: 'relative'
  },
  left: {
    textAlign: 'left'
  },
  right: {
    textAlign: 'right'
  },
  center: {
    textAlign: 'center'
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
    },
    labelHorizontalDateTags: {
      color: 'rgba(0, 0, 0, 0.7)',
      cursor: 'pointer',
      display: 'inline-flex',
      fontSize: '14px',
      lineHeight: '1.428571429',
      fontWeight: '400',
      paddingTop: '24px',
      marginRight: '0',
      '@media (min-width: 992px)': {
        float: 'right'
      }
    },
    select: {
      padding: '12px 0 7px',
      '&:focus': {
        backgroundColor: 'transparent'
      },
      '&[aria-owns] + input + svg': {
        transform: 'rotate(180deg)'
      },
      '& + input + svg': {
        transition: 'all 300ms linear'
      }
    },
    selectFormControl: {
      '& > div': {
        '&:before': {
          backgroundColor: '#D2D2D2 !important',
          height: '1px !important'
        },
        '&:after': {
          backgroundColor: primaryColor
        }
      }
    },
    selectLabel: {
      fontSize: '12px',
      textTransform: 'uppercase',
      color: '#3C4858 !important',
      top: '8px'
    },
    selectMenu: {
      '& > div': {
        boxSizing: 'borderBox',
        borderRadius: '4px',
        padding: '0',
        minWidth: '100%',
        display: 'block',
        border: '0',
        boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
        backgroundClip: 'padding-box',
        margin: '2px 0 0',
        fontSize: '14px',
        textAlign: 'left',
        listStyle: 'none',
        backgroundColor: 'transparent'
      },
      '& > div > ul': {
        border: '0',
        padding: '5px 0',
        margin: '0',
        boxShadow: 'none',
        minWidth: '100%',
        borderRadius: '4px',
        boxSizing: 'border-box',
        display: 'block',
        fontSize: '14px',
        textAlign: 'left',
        listStyle: 'none',
        backgroundColor: '#fff',
        backgroundClip: 'padding-box'
      }
    },
    selectMenuItem: {
      fontSize: '13px',
      padding: '10px 20px',
      margin: '0 5px',
      borderRadius: '2px',
      transition: 'all 150ms linear',
      display: 'block',
      clear: 'both',
      fontWeight: '400',
      lineHeight: '2',
      whiteSpace: 'nowrap',
      color: '#333',
      '&:hover': {
        backgroundColor: primaryColor,
        color: '#FFFFFF',
        ...primaryBoxShadow
      }
    },
    selectMenuItemSelected: {
      backgroundColor: `${primaryColor} '!important'`,
      color: '#FFFFFF'
    }
  },
  staticFormGroup: {
    marginLeft: '0',
    marginRight: '0',
    paddingBottom: '10px',
    margin: '8px 0 0 0',
    position: 'relative',
    '&:before,&:after': {
      display: 'table',
      content: '" "'
    },
    '&:after': {
      clear: 'both'
    }
  },
  staticFormControl: {
    marginBottom: '0',
    paddingTop: '8px',
    paddingBottom: '8px',
    minHeight: '34px'
  },
  inputMyControl: {
    padding: '24px 0 0',
    fontWeight: '400',
    height: '36px',
    fontSize: '14px',
    lineHeight: '1.428571429',
    color: '#555',
    '&[rows]': {
      height: 'auto'
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
  buttonGroupStyle: {
    marginTop: '-65px'
  },
  buttonGroup: {
    position: 'relative',
    margin: '10px 1px',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  firstButton: {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    margin: '0',
    position: 'relative',
    float: 'left',
    '&:hover': {
      zIndex: '2'
    }
  },
  middleButton: {
    borderRadius: '0',
    margin: '0',
    position: 'relative',
    float: 'left',
    '&:hover': {
      zIndex: '2'
    }
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
  classes: Object,
  addMailAddress: MailAccountType => void,
  closeForm: () => void
};

type State = {
  provider: string,
  mailAddressState: string,
  mailAddress: string,
  accountId: string,
  accoutIdState: string,
  password: string,
  passwordState: string,
  createDate?: number,
  tags: Array<string>
};

class FormMailAddressAdd extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      provider: '',
      mailAddressState: '',
      mailAddress: '',
      accountId: '',
      accountIdState: '',
      password: '',
      passwordState: '',
      createDate: new Date(),
      tags: []
    };
  }

  verifyEmail = value => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRex.test(value);
  };

  requiredField = value => value.length > 3;

  inputFormChange = (event, type) => {
    switch (type) {
      case 'provider':
        this.setState({ provider: event.target.value });
        break;
      case 'email':
        if (this.verifyEmail(event.target.value)) {
          this.setState({
            mailAddress: event.target.value,
            mailAddressState: 'success'
          });
        } else {
          this.setState({
            mailAddress: event.target.value,
            mailAddressState: 'error'
          });
        }
        break;
      case 'accountId':
        if (this.requiredField(event.target.value)) {
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
        if (this.requiredField(event.target.value)) {
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
      case 'createDate':
        this.setState({ createDate: event.target.value });
        break;
      default:
    }
  };

  handleSelectProvider = event => {
    this.setState({
      provider: event.target.value
    });
  };

  handleTags = currentTags => {
    this.setState({
      tags: currentTags
    });
  };

  addMailAccount = () => {
    if (this.state.mailAddress === '') {
      this.setState({ mailAddressState: 'error' });
    }
    if (this.state.accountId === '') {
      this.setState({ accountIdState: 'error' });
    }
    if (this.state.password === '') {
      this.setState({ passwordState: 'error' });
    }
    if (
      this.state.mailAddressState !== 'success' ||
      this.state.accountIdState !== 'success' ||
      this.state.passwordState !== 'success'
    ) {
      this.setState({
        errorMessage: '入力エラーを修正してください。',
        openErrorDialog: true
      });
      return;
    }

    if (this.state.provider !== 'Yahoo' && this.state.provider !== 'Outlook') {
      this.setState({ errorMessage: 'メール提供元を選択してください。', openErrorDialog: true });
      return;
    }

    if (!moment(this.state.createDate).isValid()) {
      this.setState({
        errorMessage: '作成日が日付として認識できません。',
        openErrorDialog: true
      });
      return;
    }

    const tags = this.state.tags.join(',');

    const newAccount: MailAccountType = {
      key: '',
      accountId: this.state.accountId,
      password: this.state.password,
      mailAddress: this.state.mailAddress,
      provider: this.state.provider,
      createDate: moment(this.state.createDate).valueOf(),
      lastLogin: null,
      tags,
      detailInfo: []
    };

    this.props.addMailAddress(newAccount);
  };

  render() {
    const { classes } = this.props;

    return (
      <GridContainer>
        <ItemGrid xs={12} sm={12} md={12}>
          <HeaderCard
            cardTitle="メールアドレス追加"
            headerColor="purple"
            content={
              <div>
                <ItemGrid xs={12} sm={6} className={classes.labelHorizontalLessUpperSpace}>
                  <div className={classes.buttonGroupStyle}>
                    <div className={classes.buttonGroup}>
                      <Button
                        color="primary"
                        customClass={classes.firstButton}
                        onClick={this.props.closeForm}
                      >
                        <Cancel style={iconStyle} />
                        キャンセル
                      </Button>
                      <Button
                        color="primary"
                        customClass={classes.lastButton}
                        onClick={() => this.addMailAccount()}
                      >
                        <SaveAltIcon style={iconStyle} />
                        保存
                      </Button>
                    </div>
                  </div>
                </ItemGrid>
                <form>
                  <GridContainer>
                    <ItemGrid xs={12} sm={2} />
                    <ItemGrid xs={12} sm={3}>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel htmlFor="select-provider" className={classes.selectLabel}>
                          提供元：
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
                            name: 'selectProvider',
                            id: 'select-provider'
                          }}
                        >
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
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>E-mail</FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={10}>
                      <CustomInput
                        success={this.state.mailAddressState === 'success'}
                        error={this.state.mailAddressState === 'error'}
                        labelText="メールアドレス"
                        id="mailAddress"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => this.inputFormChange(event, 'email'),
                          type: 'email'
                        }}
                      />
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>アカウントID:</FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4}>
                      <CustomInput
                        success={this.state.accountIdState === 'success'}
                        error={this.state.accountIdState === 'error'}
                        id="accountId"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: 'text',
                          placeholder: 'アカウントID',
                          onChange: event => this.inputFormChange(event, 'accountId')
                        }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>パスワード:</FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4}>
                      <CustomInput
                        success={this.state.passwordState === 'success'}
                        error={this.state.passwordState === 'error'}
                        id="pass"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: 'text',
                          placeholder: 'パスワード',
                          onChange: event => this.inputFormChange(event, 'password')
                        }}
                      />
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>作成日:</FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4}>
                      <Datetime
                        className={classes.inputMyControl}
                        dateFormat="YYYY/MM/DD"
                        timeFormat={false}
                        inputProps={{ placeholder: '作成日' }}
                        direction="up"
                        locale="ja"
                        onChange={value => this.setState({ createDate: value })}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>タグ:</FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4}>
                      <TagsInput
                        value={this.state.tags}
                        tagProps={{ className: 'react-tagsinput-tag info' }}
                        onChange={::this.handleTags}
                        inputProps={{
                          className: 'react-tagsinput-input-top-padding',
                          placeholder: 'ここへタグを追加'
                        }}
                      />
                    </ItemGrid>
                  </GridContainer>
                </form>
              </div>
            }
          />
          <Snackbar
            place="bc"
            color="warning"
            icon={AddAlert}
            message={this.state.errorMessage}
            open={this.state.openErrorDialog}
            closeNotification={() => this.setState({ openErrorDialog: false })}
            close
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(FormMailAddressAdd);
