// @flow
import React, { Component } from 'react';
import Loadable from 'react-loading-overlay';
import Datetime from 'react-datetime';
import moment from 'moment';
import isUrl from 'is-url';
import TagsInput from 'react-tagsinput';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// material-ui/coins
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

import { SaveAltIcon } from '../../assets/icons';
import fromAddStyle from '../../assets/jss/material-dashboard-pro-react/views/formAddStyle';

import Fc2 from '../../assets/img/blogs/fc2.png';
import Webnode from '../../assets/img/blogs/webnode.png';
import Livedoor from '../../assets/img/blogs/livedoor.png';
import Seesaa from '../../assets/img/blogs/seesaa.png';
import Ameba from '../../assets/img/blogs/ameba.png';
import Rakuten from '../../assets/img/blogs/rakuten.png';
import Kokolog from '../../assets/img/blogs/kokolog.png';
import Yaplog from '../../assets/img/blogs/yaplog.png';
import Jugem from '../../assets/img/blogs/jugem.png';
import Ninjya from '../../assets/img/blogs/ninja.png';
import Hatena from '../../assets/img/blogs/hatena.png';
import Webryblog from '../../assets/img/blogs/webryblog.png';
import Wpcom from '../../assets/img/blogs/wpcom.png';
import Goo from '../../assets/img/blogs/goo.png';

const selectAvatarStyle = {
  display: 'flex',
  alignItems: 'center'
};

const iconStyle = {
  width: '18px',
  height: '18px'
};

const zeroPadding = {
  paddingTop: '0'
};

type Props = {
  classes: Object,
  mode: string,
  formStatus: boolean,
  isFailure: boolean,
  isLoading: boolean,
  metaMessage: string,
  addBlogAccount: BlogAccountType => void,
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
  title: string,
  titleState: string,
  url: string,
  urlState: string,
  description: string,
  remark: string,
  createDate?: number,
  tags: Array<string>,
  errorMessage: string,
  openErrorDialog: boolean,
  openSuccessDialog: boolean,
  isLoading: boolean
};

class FormBlogAdd extends Component<Props, State> {
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
      title: '',
      titleState: '',
      url: '',
      urlState: '',
      description: '',
      remark: '',
      createDate: new Date(),
      tags: [],
      errorMessage: '',
      openErrorDialog: false,
      openSuccessDialog: false,
      isLoading: false
    };
  }

  componentWillReceiveProps = nextProps => {
    /*    console.log(
      `add form props formState- this:${this.props.formStatus}--next:${nextProps.formStatus}`
    );
    console.log(`add form issFailure-this:${this.props.isFailure}--next:${nextProps.isFailure}`);
    console.log(`this-mode:${this.props.mode}--nextMode::${nextProps.mode}`);
    console.log(`next errorMessage:${nextProps.metaMessage}`);  */
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
        title: '',
        titleState: '',
        url: '',
        urlState: '',
        description: '',
        remark: '',
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
      } else if (this.state.titleState === 'success') {
        console.log('success');
        this.setState({
          errorMessage: `${this.state.title}を追加しました。`,
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
      case 'title':
        if (this.requiredField(event.target.value)) {
          this.setState({
            title: event.target.value,
            titleState: 'success'
          });
        } else {
          this.setState({
            title: event.target.value,
            titleState: 'eroor'
          });
        }
        break;
      case 'url':
        if (isUrl(event.target.value)) {
          this.setState({
            url: event.target.value,
            urlState: 'success'
          });
        } else {
          this.setState({
            url: event.target.value,
            urlState: 'error'
          });
        }
        break;
      case 'description':
        this.setState({ description: event.target.value });
        break;
      case 'remark':
        this.setState({ remark: event.target.value });
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
    if (this.state.title === '') {
      this.setState({ titleState: 'error' });
    }
    if (this.state.url === '') {
      this.setState({ urlState: 'error' });
    }
    if (
      this.state.mailAddressState !== 'success' ||
      this.state.accountIdState !== 'success' ||
      this.state.passwordState !== 'success' ||
      this.state.titleState !== 'success' ||
      this.state.urlState !== 'success'
    ) {
      this.setState({
        errorMessage: '入力エラーを修正してください。',
        openErrorDialog: true
      });
      return;
    }

    const blogProvider = [
      'fc2',
      'webnode',
      'livedoor',
      'seesaa',
      'ameba',
      'rakuten',
      'kokolog',
      'yaplog',
      'jugem',
      'ninjya',
      'hatena',
      'webryblog',
      'wpcom',
      'goo',
      'domain'
    ];
    const providerCheck = blogProvider.find(provider => provider === this.state.provider);
    if (providerCheck === undefined) {
      this.setState({ errorMessage: 'ブログ提供元を選択してください。', openErrorDialog: true });
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
      title: this.state.title,
      description: this.state.description,
      url: this.state.url,
      remark: this.state.remark,
      createDate: moment(this.state.createDate).valueOf(),
      apiId: '',
      apiPass: '',
      blogId: '',
      endPoint: '',
      groupTags: tags,
      affiliateTags: '',
      detailInfo: []
    };
    console.log('fire add account');
    this.setState({ isLoading: true });

    this.props.addBlogAccount(newAccount);
  };

  addAccountSuccess = () => {
    this.setState({ openSuccessDialog: false });
    this.props.closeForm();
  };

  render() {
    const { classes } = this.props;

    return (
      <Loadable active={this.state.isLoading} spinner text="サーバーと通信中・・・・">
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary" text>
                <CardText color="primary">
                  <h4 className={classes.cardTitle}>ブログ追加</h4>
                </CardText>
                <GridItem xs={12} sm={6} className={classes.labelHorizontalLessUpperSpace}>
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
                        onClick={this.addMailAccount}
                      >
                        <SaveAltIcon style={iconStyle} />
                        保存
                      </Button>
                    </div>
                  </div>
                </GridItem>
              </CardHeader>
              <CardBody style={zeroPadding}>
                <div>
                  <form>
                    <GridContainer>
                      <GridItem xs={12} sm={2} />
                      <GridItem xs={12} sm={3}>
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
                              value="jugem"
                            >
                              <div style={selectAvatarStyle}>
                                <Avatar alt="Jugem" src={Jugem} className={classes.avatar} />
                                Jugem
                              </div>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="ninja"
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
                                <Avatar
                                  alt="ウェブリブログ"
                                  src={Webryblog}
                                  className={classes.avatar}
                                />
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
                                <Avatar
                                  alt="WordPress.com"
                                  src={Wpcom}
                                  className={classes.avatar}
                                />
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
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>E-mail</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
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
                            onChange: event => this.inputFormChange(event, 'email'),
                            type: 'email'
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>アカウントID:</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={3}>
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
                            onChange: event => this.inputFormChange(event, 'accountId')
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>パスワード:</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={3}>
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
                            onChange: event => this.inputFormChange(event, 'password')
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>タイトル:</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
                        <CustomInput
                          success={this.state.titleState === 'success'}
                          error={this.state.titleState === 'error'}
                          id="title"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            value: this.state.title,
                            type: 'text',
                            placeholder: 'タイトル',
                            onChange: event => this.inputFormChange(event, 'title')
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>URL:</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
                        <CustomInput
                          success={this.state.urlState === 'success'}
                          error={this.state.urlState === 'error'}
                          id="url"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            value: this.state.url,
                            type: 'text',
                            placeholder: 'URL',
                            onChange: event => this.inputFormChange(event, 'url')
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>ブログの説明:</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
                        <CustomInput
                          id="description"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            value: this.state.description,
                            type: 'text',
                            placeholder: 'ブログの説明',
                            onChange: event => this.inputFormChange(event, 'description')
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>備考:</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
                        <CustomInput
                          id="remark"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            value: this.state.remark,
                            type: 'text',
                            placeholder: '備考',
                            onChange: event => this.inputFormChange(event, 'remark')
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>作成日:</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={3}>
                        <Datetime
                          className={classes.inputMyControl}
                          dateFormat="YYYY/MM/DD"
                          timeFormat={false}
                          inputProps={{ placeholder: '作成日' }}
                          direction="up"
                          locale="ja"
                          onChange={value => this.setState({ createDate: value })}
                          value={this.state.createDate}
                          closeOnSelect={true}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>タグ:</FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={3}>
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
              action={() => this.setState({ openErrorDialog: false })}
              close
            />
            <Snackbar
              place="bc"
              color="success"
              icon={AddAlert}
              message={this.state.errorMessage}
              open={this.state.openSuccessDialog}
              action={() => this.addAccountSuccess()}
              close
            />
          </GridItem>
        </GridContainer>
      </Loadable>
    );
  }
}

export default withStyles(fromAddStyle)(FormBlogAdd);
