// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Datetime from 'react-datetime';
import FormLabel from 'material-ui/Form/FormLabel';
import FormControl from 'material-ui/Form/FormControl';
import TagsInput from 'react-tagsinput';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import MenuItem from 'material-ui/Menu/MenuItem';
import Select from 'material-ui/Select';

import { GridContainer, ItemGrid, HeaderCard, CustomInput } from '../../ui';
import type MailAccountType from '../../types/mailAccount';
import {
  card,
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

const styles = {
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none'
  },
  cardHeader: {
    ...cardHeader,
    ...defaultFont,
    display: 'inline-block'
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
      backgroundColor: primaryColor + '!important',
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
  }
};

type Props = {
  classes: Object,
  addMailAddress: MailAccountType => void
};

type State = {
  provider: string,
  mailAddressState: string,
  mailAddress: string,
  accountId: string,
  password: string,
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
      password: '',
      createDate: null,
      tags: []
    };
  }

  verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  inputFormChange = (event, type) => {
    switch (type) {
      case 'provider':
        this.setState({ provider: event.target.value });
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
        this.setState({ accountId: event.target.value });
        break;
      case 'password':
        this.setState({ passsword: event.target.value });
        break;
      case 'createDate':
        this.setState({ createDate: new Date(event.target.value).getTime() });
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

  render() {
    const { classes } = this.props;

    return (
      <GridContainer>
        <ItemGrid xs={12} sm={12} md={12}>
          <HeaderCard
            cardTitle="メールアドレス追加"
            headerColor="purple"
            content={
              <form>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>提供元:</FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
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
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>メールアドレス</FormLabel>
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
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      id="accountId"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'text',
                        placeholder: 'アカウントID',
                        onChange: event => this.inputFormChange(event, 'accountId')
                      }}
                      helpText="ログインに必要なIDを入力します。"
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>パスワード</FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'password',
                        placeholder: 'パスワード',
                        onChange: event => this.inputFormChange(event, 'password')
                      }}
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>作成日</FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <FormControl fullWidth>
                      <Datetime timeFormat={false} inputProps={{ placeholder: '作成日' }} />
                    </FormControl>
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>タグ</FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <TagsInput
                      value={this.state.tags}
                      tagProps={{ className: 'react-tagsinput-tag info' }}
                      onChange={::this.handleTags}
                      inputProps={{
                        className: 'react-tagsinput-input',
                        placeholder: 'ここへタグを追加'
                      }}
                    />
                  </ItemGrid>
                </GridContainer>
              </form>
            }
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(FormMailAddressAdd);
