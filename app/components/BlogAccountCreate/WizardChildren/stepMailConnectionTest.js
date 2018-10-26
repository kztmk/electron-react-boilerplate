// @flow
import React, { Component } from 'react';
import Loadable from "react-loading-overlay";
// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from "@material-ui/core/Avatar/Avatar";

import AddAlert from "@material-ui/icons/AddAlert";
import CheckCircle from "@material-ui/icons/CheckCircle";
import HighlightOff from "@material-ui/icons/HighlightOff";

import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import CustomInput from '../../../ui/CustomInput/CustomInput';
import Table from '../../../ui/Table/Table';

import Snackbar from "../../../ui/Snackbar/Snackbar";

import type MailAccountType from "../../../types/mailAccount";
import type PersonalInfoType from "../../../types/personalInfo";

import Yahoo from '../../../assets/img/providerImage/y64.png';
import Outlook from '../../../assets/img/providerImage/outlook64.png';
import gmail from '../../../assets/img/providerImage/gmail64.png';
import Yandex from '../../../assets/img/providerImage/yandex64.png';
import ownDomain from '../../../assets/img/providerImage/domain64.png';
import Button from "../../../ui/CustomButtons/Button";
import { MailTest } from "../../../assets/icons";

import { getProviderImage } from '../../MailAddressList/mailAddressList';

import formAddStyle from '../../../assets/jss/material-dashboard-pro-react/views/formAddStyle';
import type BlogAccountType from "../../../types/blogAccount";

import BlogProviders from '../../BlogsListPage/blogProviders';
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
import type BlogProviderType from "../../../types/blogProvider";

const providerImageStyle = {
  marginLeft: '-15px',
  paddingTop: '6px',
  width: '32px',
  height: '36px'
};


type Props = {
  classes: Object,
  randomPersonalInfo: PersonalInfoType,
  imapMessageLoading: boolean,
  imapIsError: boolean,
  imapErrorMessage: string,
  imapSelectMailBoxPath: string,
  imapMailCount: number,
  startTestImapConnection: MailAccountType => void,
  blogAccounts: Array<BlogAccountType>
};

type State = {
  errorMessage: string,
  successMessage: string,
  openErrorDialog: boolean,
  openSuccessDialog: boolean,
  isValidate?: boolean,
  providerImg: Object,
  buttonState: React.NODE
};

class StepMailConnectionTest extends Component<Props, State> {
  constructor(props) {
    super(props);
    const button = this.changeButtonState();
    this.state = {
      errorMessage: '',
      successMessage: '',
      openErrorDialog: false,
      openSuccessDialog: false,
      isValidate: null,
      providerImg: null,
      buttonState: button
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.imapMessageLoading && !nextProps.imapMessageLoading) {
      // imap connection test done
      if (!nextProps.imapIsError) {
        const button = this.changeButtonState(true);
        this.setState({
          isValidate: true,
          successMessage: `このメールアドレスへimapでの接続に成功しました。受信箱に${nextProps.imapMailCount}通のメールがあります。`,
          openSuccessDialog: true,
          buttonState: button
        })
      } else {
        const button = this.changeButtonState(false);
        this.setState({
          isValidate: false,
          errorMessage: `エラー：${nextProps.imapErrorMessage}`,
          openErrorDialog: true,
          buttonState: button
        })
      }
    }
    switch (nextProps.randomPersonalInfo.mailAccount.provider) {
      case 'Yahoo':
        this.setState({ providerImg: Yahoo });
        break;
      case 'Outlook':
        this.setState({ providerImg: Outlook });
        break;
      case 'Gmail':
        this.setState({ providerImg: gmail });
        break;
      case 'Yandex':
        this.setState({ providerImg: Yandex });
        break;
      default:
        this.setState({ providerImg: ownDomain });
    }
  };

  /**
   * 親フォームから呼ばれてstateを返す
   * @returns {*}
   */
  sendState = () => {
    const blogParams = {};
    blogParams.creatableBlogs = this.getCreatableBlogs();
    blogParams.mailAccount = this.props.randomPersonalInfo.mailAccount;

    return blogParams;
  }

  /**
   * stateを初期化する
   */
  initState = () => {
    const button = this.changeButtonState();
    this.setState({
      errorMessage: '',
      successMessage: '',
      openErrorDialog: false,
      openSuccessDialog: false,
      isValidate: null,
      providerImg: null,
      buttonState: button
    })
  }

  setFirstBlog = () => {
    // nothing to do
  }

  isValidated = () => {
    if (this.state.isValidate) {
      return true
    }
    if (this.state.isValidate === null) {
      this.setState({
        openErrorDialog: true,
        errorMessage: 'このメールアカウントで接続テストを行ってください。'
      });
      return false;
    }
    this.setState({
      openErrorDialog: true,
      errorMessage: 'このメールアカウントでは、imap接続ができません。\nアカウントが削除されていないか？\nパスワードがあっているか？\nを確認してください。'
    })
  }

  changeButtonState = result => {
    switch (result) {
      case true:
        return (
          <Button
            size="lg"
            color="success"
          >
            <CheckCircle />接続確認完了
          </Button>
        )
      case false:
        return (
          <Button
            size="lg"
            color="warning"
            onClick={this.handleImapConnectionTest}
          >
            <HighlightOff />接続できません。
          </Button>
        )
      default:
        return (
          <Button
            size="lg"
            color="primary"
            onClick={this.handleImapConnectionTest}
          >
            <MailTest />メール接続テスト
          </Button>
        )
    }
  }

  handleImapConnectionTest = () =>{
    this.props.startTestImapConnection(this.props.randomPersonalInfo.mailAccount);
  }

  closeErrorSnackbar = () => {
    this.setState({
      openErrorDialog: false,
      errorMessage: ''
    });
  }

  closeSuccessSnackbar = () => {
    this.setState({
      openSuccessDialog: false,
      successMessage: ''
    })
  }

  getImageSource = (provider) => {
    const blogProvider = BlogProviders.find(p => p.name === provider);
    if (blogProvider) {
      return blogProvider.image;
    }
    return null;
  }


  createdBlogAvatars = () => {
    const { classes } = this.props;
    const createdBlogs = this.props.blogAccounts.filter(blog => blog.mailAddress === this.props.randomPersonalInfo.mailAccount.mailAddress);
    console.log('------blogs under this mailaddress');
    console.log(createdBlogs);
    if (createdBlogs) {
      return (
        <div className={classes.avatars}>
          {
            createdBlogs.map((blog, key) =>
              <Tooltip title={`${blog.title}:${blog.createDate}`} key={key}>
                <Avatar src={this.getImageSource(blog.provider)} className={classes.avatar}/>
              </Tooltip>
            )}
        </div>
      );
    }
      return ["なし"];
  }

  getCreatableBlogs = () => {
    const createdBlogs = this.props.blogAccounts.filter(blog => blog.mailAddress === this.props.randomPersonalInfo.mailAccount.mailAddress);

    // TODO: mailaddressによって作成できないブログがある。
    // ここで作成可能なルールを定義する。
    // jugem
    let creatableBlogs = BlogProviders.filter(blog => blog.name !== 'jugem');

    // +(プラス入りのエイリアスは忍者はNG)
    if (this.props.randomPersonalInfo.mailAccount.mailAddress.indexOf('+') !== -1) {
      creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'ninjya');
      creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'webnode');
    }

    // goo
    creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'goo');
    // fc2
    if (createdBlogs.find(b => b.provider === 'fc2')) {
      creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'fc2');
    }
    // ameba
    if (createdBlogs.find(b => b.provider === 'ameba')) {
      creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'ameba');
    }
    // rakuten
    if (createdBlogs.find(b => b.provider === 'rakuten')) {
      creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'rakuten');
    }
    // kokolog
    if (createdBlogs.find(b => b.provider === 'kokolog')) {
      creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'kokolog');
    }
    // yaplog
    if (createdBlogs.find(b => b.provider === 'yaplog')) {
      creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'yaplog');
    }
    // weybry
    if (createdBlogs.find(b => b.provider === 'webryblog')) {
      creatableBlogs = creatableBlogs.filter(blog => blog.name !== 'webryblog');
    }

    return creatableBlogs;
  }

  creatableBlogAvatars = () => {
    const { classes } = this.props;

    const creatableBlogs = this.getCreatableBlogs();

    if (creatableBlogs) {
      return (
        <div className={classes.avatars}>
          {
            creatableBlogs.map((blog, key) =>
                <Tooltip title={blog.label} key={key} >
                  <Avatar src={blog.image} className={classes.avatar} />
                </Tooltip>
            )}
        </div>
      );
    }
      return ["なし"];
  }

  render() {
    const { classes } = this.props;
    return (
      <Loadable active={this.props.imapMessageLoading} spinner text="サーバーへ接続中・・・・">
      <GridContainer justify="center">
        <GridItem xs={12} sm={11} md={11}>
          <GridContainer>
            <GridItem xs={12} sm={2}>
              <FormLabel className={classes.labelHorizontal}>
                E-mail
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={9} md={9}>
              <CustomInput
                labelText="メールアドレス"
                id="mailAddress"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.props.randomPersonalInfo.mailAccount.mailAddress,
                  type: 'email',
                  disabled: true
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={1} md={1}>
              <img
                style={providerImageStyle}
                src={getProviderImage(this.props.randomPersonalInfo.mailAccount.provider)}
                alt={this.props.randomPersonalInfo.mailAccount.provider}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={2} md={2}>
              <FormLabel className={classes.labelHorizontal}>
                アカウントID:
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <CustomInput
                id="accountId"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.props.randomPersonalInfo.mailAccount.accountId,
                  type: 'text',
                  disabled: true
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={2} md={2}>
              <FormLabel className={classes.labelHorizontal}>
                パスワード:
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <CustomInput
                id="pass"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.props.randomPersonalInfo.mailAccount.password,
                  type: 'text',
                  disabled: true
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer justify ="center">
            <GridItem>
              <Table
                tableHead={[
                  '',
                  'メールアドレス使用状況：'
                ]}
                tableData={[
                  [
                    "作成済み",
                    this.createdBlogAvatars()
                  ],
                  [
                    "作成可能",
                    this.creatableBlogAvatars()
                  ],
                  []
                ]}
                customHeadCellClasses={[classes.center]}
                customHeadClassesForCells={[1]}
              />
            </GridItem>
          </GridContainer>
        <GridContainer justify="center">
          <GridItem>
            {this.state.buttonState}
          </GridItem>
        </GridContainer>
        </GridItem>
        <Snackbar
          place="bc"
          color="warning"
          icon={AddAlert}
          message={this.state.errorMessage}
          open={this.state.openErrorDialog}
          closeNotification={() =>
            this.closeErrorSnackbar()
          }
          close
        />
        <Snackbar
          place="bc"
          color="success"
          icon={AddAlert}
          autoHideDuration = {2000}
          onClose = {() => this.closeSuccessSnackbar()}
          message={this.state.successMessage}
          open={this.state.openSuccessDialog}
          closeNotification={() => this.closeSuccessSnackbar()}
          close
        />
      </GridContainer>
      </Loadable>
    );
  }
}

export default withStyles(formAddStyle)(StepMailConnectionTest);
