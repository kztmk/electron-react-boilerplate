// @flow
import React, { Component } from 'react';
import Loadable from 'react-loading-overlay';
import Datetime from 'react-datetime';
import moment from 'moment';
import TagsInput from 'react-tagsinput';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Cancel from '@material-ui/icons/Cancel';
import AddAlert from '@material-ui/icons/AddAlert';

import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';
import Card from '../../ui/Card/Card';
import CardHeader from '../../ui/Card/CardHeader';
import CardText from '../../ui/Card/CardText';
import CardBody from '../../ui/Card/CardBody';
import CustomInput from '../../ui/CustomInput/CustomInput';
import Button from '../../ui/CustomButtons/Button';
import Snackbar from '../../ui/Snackbar/Snackbar';
import type MailAccountType from '../../types/mailAccount';

import { SaveAltIcon } from '../../assets/icons';
import fromAddStyle from '../../assets/jss/material-dashboard-pro-react/views/formAddStyle';

import Yahoo from '../../assets/img/providerImage/y64.png';
import Outlook from '../../assets/img/providerImage/outlook64.png';
// import gmail from '../../asets/img/providerImage/gmail64.png';
// import ownDomain from '../../asets/img/providerImage/domain64.png';

const iconStyle = {
  width: '18px',
  height: '18px'
};

const selectAvatarStyle = {
  display: 'flex',
  alignItems: 'center'
};

type Props = {
  classes: Object,
  mode: string,
  formStatus: boolean,
  isFailure: boolean,
  isLoading: boolean,
  metaMessage: string,
  addMailAddress: MailAccountType => void,
  closeForm: () => void
};

type State = {
  provider: string,
  mailAddressState: string,
  mailAddress: string,
  accountId: string,
  accountIdState: string,
  password: string,
  passwordState: string,
  createDate?: number,
  tags: Array<string>,
  errorMessage: string,
  openErrorDialog: boolean,
  openSuccessDialog: boolean,
  isLoading: boolean
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
      tags: [],
      errorMessage: '',
      openErrorDialog: false,
      openSuccessDialog: false,
      isLoading: false
    };
  }

  componentWillReceiveProps = nextProps => {
    // eslint-disable-next-line function-paren-newline
    console.log(
      `add formState- this:${this.props.formStatus}-next:${
        nextProps.formStatus
      }`
    );
    console.log(
      `add form issFailure-this:${this.props.isFailure}--next:${
        nextProps.isFailure
      }`
    );
    console.log(`this-mode:${this.props.mode}--nextMode::${nextProps.mode}`);
    console.log(`next errorMessage:${nextProps.metaMessage}`);
    // formを開くときに初期化
    if (!this.props.formStatus && nextProps.formStatus) {
      this.setState({
        provider: '',
        mailAddressState: '',
        mailAddress: '',
        accountId: '',
        accountIdState: '',
        password: '',
        passwordState: '',
        createDate: new Date(),
        tags: [],
        errorMessage: '',
        openErrorDialog: false,
        openSuccessDialog: false,
        isLoading: false
      });
      console.log('addForm init');
      return;
    }
    if (!this.props.isLoading) {
      this.setState({ isLoading: false });
    }

    if (!this.state.isLoading && nextProps.formStatus) {
      console.log('snackbar select');
      // createRequestの次
      if (nextProps.isFailure) {
        console.log('error message ');
        this.setState({
          errorMessage: nextProps.metaMessage,
          openErrorDialog: true
        });
      } else if (this.state.mailAddressState === 'success') {
        // create success
        console.log('success');
        this.setState({
          errorMessage: `${this.state.mailAddress}を追加しました。`,
          openSuccessDialog: true
        });
      }
    }
  };

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
      this.setState({
        errorMessage: 'メール提供元を選択してください。',
        openErrorDialog: true
      });
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

    const newAccount = {
      key: '',
      accountId: this.state.accountId,
      password: this.state.password,
      mailAddress: this.state.mailAddress,
      provider: this.state.provider,
      createDate: moment(this.state.createDate).valueOf(),
      lastLogin: 0,
      tags,
      detailInfo: []
    };
    console.log('fire add account');
    this.setState({ isLoading: true });

    this.props.addMailAddress(newAccount);
  };

  addAccountSuccess = () => {
    this.setState({ openSuccessDialog: false });
    this.props.closeForm();
  };

  render() {
    const { classes } = this.props;

    return (
      <Loadable
        active={this.state.isLoading}
        spinner
        text="サーバーと通信中・・・・"
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary" text>
                <CardText color="primary">
                  <h4 className={classes.cardTitle}>メールアドレス追加</h4>
                </CardText>
                <GridItem
                  xs={12}
                  sm={6}
                  className={classes.labelHorizontalLessUpperSpace}
                >
                  <div className={classes.buttonGroupStyle}>
                    <div className={classes.buttonGroup}>
                      <Button
                        color="primary"
                        className={classes.firstButton}
                        onClick={this.props.closeForm}
                      >
                        <Cancel style={iconStyle} />
                        キャンセル
                      </Button>
                      <Button
                        color="primary"
                        className={classes.lastButton}
                        onClick={this.addMailAccount}
                      >
                        <SaveAltIcon style={iconStyle} />
                        保存
                      </Button>
                    </div>
                  </div>
                </GridItem>
              </CardHeader>
              <CardBody>
                <div>
                  <form>
                    <GridContainer>
                      <GridItem xs={12} sm={2} />
                      <GridItem xs={12} sm={4}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="select-provider"
                            className={classes.selectLabel}
                          >
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
                              style={selectAvatarStyle}
                              value="Yahoo"
                            >
                              <div style={selectAvatarStyle}>
                                <Avatar
                                  alt="Yahoo"
                                  src={Yahoo}
                                  className={classes.avatar}
                                />
                                Yahoo!メール
                              </div>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="Outlook"
                            >
                              <div style={selectAvatarStyle}>
                                <Avatar
                                  alt="Yahoo"
                                  src={Outlook}
                                  className={classes.avatar}
                                />
                                Outlook
                              </div>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>
                          E-mail
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={10}>
                        <CustomInput
                          success={this.state.mailAddressState === 'success'}
                          error={this.state.mailAddressState === 'error'}
                          labelText="メールアドレス"
                          id="mailAddress"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            value: this.state.mailAddress,
                            onChange: event =>
                              this.inputFormChange(event, 'email'),
                            type: 'email'
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>
                          アカウントID:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={4}>
                        <CustomInput
                          success={this.state.accountIdState === 'success'}
                          error={this.state.accountIdState === 'error'}
                          id="accountId"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            value: this.state.accountId,
                            type: 'text',
                            placeholder: 'アカウントID',
                            onChange: event =>
                              this.inputFormChange(event, 'accountId')
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>
                          パスワード:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={4}>
                        <CustomInput
                          success={this.state.passwordState === 'success'}
                          error={this.state.passwordState === 'error'}
                          id="pass"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            value: this.state.password,
                            type: 'text',
                            placeholder: 'パスワード',
                            onChange: event =>
                              this.inputFormChange(event, 'password')
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>
                          作成日:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={4}>
                        <Datetime
                          className={classes.inputMyControl}
                          dateFormat="YYYY/MM/DD"
                          timeFormat={false}
                          // eslint-disable-next-line react/jsx-boolean-value
                          closeOnSelect={true}
                          inputProps={{ placeholder: '作成日' }}
                          direction="up"
                          locale="ja"
                          onChange={value =>
                            this.setState({ createDate: value })
                          }
                          value={this.state.createDate}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>
                          タグ:
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={4}>
                        <TagsInput
                          value={this.state.tags}
                          tagProps={{ className: 'react-tagsinput-tag info' }}
                          onChange={::this.handleTags}
                          inputProps={{
                            className: 'react-tagsinput-input-top-padding',
                            placeholder: 'ここへタグを追加'
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </form>
                </div>
              </CardBody>
            </Card>
            <Snackbar
              place="bc"
              color="warning"
              icon={AddAlert}
              message={this.state.errorMessage}
              open={this.state.openErrorDialog}
              closeNotification={() =>
                this.setState({ openErrorDialog: false })
              }
              close
            />
            <Snackbar
              place="bc"
              color="success"
              icon={AddAlert}
              message={this.state.errorMessage}
              open={this.state.openSuccessDialog}
              closeNotification={() => this.addAccountSuccess()}
              close
            />
          </GridItem>
        </GridContainer>
      </Loadable>
    );
  }
}

export default withStyles(fromAddStyle)(FormMailAddressAdd);
