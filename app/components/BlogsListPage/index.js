// @flow
import { ipcRenderer } from 'electron';
import React from 'react';
import Loadable from 'react-loading-overlay';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

// material-ui-icons
import AddAlert from '@material-ui/icons/AddAlert';
import Web from '@material-ui/icons/Web';

import BlogList from './blogList';
import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';
import Card from '../../ui/Card/Card';
import CardHeader from '../../ui/Card/CardHeader';
import CardIcon from '../../ui/Card/CardIcon';
import CardText from '../../ui/Card/CardText';
import CardBody from '../../ui/Card/CardBody';
import Snackbar from '../../ui/Snackbar/Snackbar';
import type BlogAccountType from '../../types/blogAccount';

import Button from '../../ui/CustomButtons/Button';
import { AddIcon, FolderDownloadIcon } from '../../assets/icons';

import accountListPageStyles from '../../assets/jss/material-dashboard-pro-react/views/accountListPageStyle';
import type MailAccountType from '../../types/mailAccount';

import FormBlogAdd from './formBlogAdd';

type State = {
  isLoading: boolean,
  isFailure: boolean,
  metaMessage: string,
  transAccounts: Array<MailAccountType>,
  openSuccessNotification: boolean,
  openErrorNotification: boolean,
  openModalSaveErrorAccounts: boolean,
  openFormBlogAdd: boolean,
  mode: string
};
type Props = {
  classes: Object,
  startGetBlogAccounts: () => void,
  startImportBlogAccounts: (blogAccounts: Array<BlogAccountType>) => void,
  startCreateBlogAccount: (blogAccount: BlogAccountType) => void,
  startUpdateBlogAccount: (blogAccount: BlogAccountType) => void,
  startDeleteBlogAccount: (blogAccount: BlogAccountType) => void,
  blogAccounts: Array<BlogAccountType>,
  isGetting: boolean,
  isCreating: boolean,
  isUpdating: boolean,
  isDeleting: boolean,
  isImporting: boolean,
  isFailure: boolean,
  metaMessage: string,
  transAccounts: Array<BlogAccountType>
};

const Transition = props => <Slide direction="down" {...props} />;

/**
 * ブログアカウント一覧ページ
 */
class BlogListPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      metaMessage: this.props.metaMessage,
      transAccounts: this.props.transAccounts,
      openSuccessNotification: false,
      openErrorNotification: false,
      openModalSaveErrorAccounts: false,
      openFormBlogAdd: false,
      mode: 'none'
    };
  }

  /**
   * コンポーネントがマウントされたときにリスナをセット
   */
  componentDidMount() {
    /**
     * main processから、「SEND_IMPORTED_BLOG_ACCOUNT」で呼ばれるリスナ
     * text(寄騎からエクスポートしたblog accounts json text)を受信
     */
    ipcRenderer.on('SEND_IMPORTED_BLOG_ACCOUNT', (_e, jsonFile) => {
      // エラー(ユーザーキャンセル含む)の場合、受信テキストに「error:-:」を含む
      console.log(`receive:${jsonFile}`);
      if (jsonFile.indexOf('error:-:') > -1) {
        const errorMsg = jsonFile.replace('error:-:', '');
        this.setState({
          openErrorNotification: true,
          errorMessage: errorMsg,
          isLoading: false
        });
        return;
      }

      // 受信したjsonデータをobjectへ変換
      const mAccounts = JSON.parse(jsonFile);

      // check data
      if (!this.checkBlogDataObject(mAccounts[0])) {
        this.setState({
          openErrorNotification: true,
          metaMessage: '寄騎V5用のブログデータファイルではありません。ファイルを確認してください。'
        });
        return;
      }

      this.setState({ isLoading: true });
      // インポート用BlogAccountType配列
      const blogAccounts: Array<BlogAccountType> = [];
      // 受信object[key, createDate]をBlogAccountTypeの型に変換
      mAccounts.forEach(ac => {
        const numberCreateDate: number = moment(ac.createDate).valueOf();
        // 作成日時をnumberへ
        const acNum = {
          ...ac,
          createDate: numberCreateDate
        };
        // keyプロパティを追加
        const ba = {
          key: '',
          ...acNum
        };
        // V5で使用するblogProviderNameに書換
        const providerName = this.convertProviderName(ac.provider);
        console.log(providerName);
        // V5用BlogObjectのプロパティを追加
        const blog: BlogAccountType = {
          ...ba,
          provider: providerName,
          apiId: '',
          apiPass: '',
          blogId: '',
          endPoint: '',
          groupTags: '',
          affiliateTags: []
        };
        // インポート用objectへ追加
        blogAccounts.push(blog);
      });
      // インポートアクションをdispatch
      this.props.startImportBlogAccounts(blogAccounts);
    });

    /**
     * main ProcessからerrorBlogAccountsのjson要求のリスナ
     */
    ipcRenderer.on('REQUEST_ERROR_BLOG_ACCOUNT_JSON', () => {
      let jsonFile: string = '';
      if (this.state.transAccounts.length > 0) {
        const blogAccounts = [];
        this.state.transAccounts.forEach(acc => {
          const createDate = moment(acc.createDate).format();
          const accTimeToString = {
            ...acc,
            createDate
          };
          delete accTimeToString.key;
          blogAccounts.push(accTimeToString);
        });
        jsonFile = JSON.stringify(blogAccounts, undefined, 4);
      }
      ipcRenderer.send('REPLY_ERROR_BLOG_ACCOUNT_JSON', jsonFile);

      this.setState({
        openModalSaveErrorAccounts: false,
        metaMessage: ''
      });
    });
  }

  /**
   * Propsが更新されたときに、stateへ反映させる
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    // notification表示用flagとmessage
    let isSuccess = false;
    let isFailure = false;
    let isSuccessButDup = false;
    let notificationMsg = '';

    console.log(
      `imp:${nextProps.isImporting}--cre:${nextProps.isCreating}--Get:${nextProps.isGetting}--up:${
        nextProps.isUpdating
      }--del:${nextProps.isDeleting}`
    );
    console.log(`my-mode:${this.state.mode}`);

    if (
      !nextProps.isImporting &&
      !nextProps.isCreating &&
      !nextProps.isGetting &&
      !nextProps.isUpdating &&
      !nextProps.isDeleting
    ) {
      // request完了後の処理済みの場合
      switch (this.state.mode) {
        case 'import':
          if (!nextProps.isFailure) {
            // import成功
            notificationMsg = nextProps.metaMessage;
            if (nextProps.transAccounts.length > 0) {
              // import成功 dupあり
              isSuccessButDup = true;
            } else {
              // import完全成功
              isSuccess = true;
            }
          } else {
            isFailure = true;
            notificationMsg = `インポートエラー：${nextProps.metaMessage}`;
          }
          // import操作完了時のstate更新
          this.setState({
            transAccounts: nextProps.transAccounts,
            openSuccessNotification: isSuccess,
            openErrorNotification: isFailure,
            metaMessage: notificationMsg,
            openModalSaveErrorAccounts: isSuccessButDup,
            mode: 'none'
          });
          break;
        case 'refresh':
          console.log('refreshed');

          this.setState({
            mode: 'import'
          });
          break;
        default:
      }
    } else {
      // Request時のprops更新
      if (nextProps.isImporting) {
        this.setState({ mode: 'import' });
        return;
      }
      if (nextProps.isCreating) {
        this.setState({ mode: 'create' });
        return;
      }
      if (nextProps.isGetting) {
        if (this.state.mode !== 'refresh') {
          this.setState({ mode: 'get' });
        }
        return;
      }
      if (nextProps.isUpdating) {
        this.setState({ mode: 'update' });
        return;
      }
      if (nextProps.isDeleting) {
        this.setState({ mode: 'delete' });
      }
    }
  };

  /**
   * コンポーネントが閉じられるときにリスナを解放
   */
  componentWillUnmount() {
    ipcRenderer.removeAllListeners('REQUEST_ERROR_BLOG_ACCOUNT_JSON');
  }

  checkBlogDataObject = account => {
    if (account.accountId === undefined) {
      return false;
    }
    if (account.password === undefined) {
      return false;
    }
    if (account.mailAddress === undefined) {
      return false;
    }
    if (account.provider === undefined) {
      return false;
    }
    if (account.title === undefined) {
      return false;
    }
    if (account.description === undefined) {
      return false;
    }
    if (account.url === undefined) {
      return false;
    }
    if (account.remark === undefined) {
      return false;
    }
    if (account.createDate === undefined) {
      return false;
    }
    return true;
  };

  // V4からV5での変更をインポート時に行う
  convertProviderName = providerNameV4 => {
    let providerNameV5 = '';

    switch (providerNameV4) {
      case 'FC2':
        providerNameV5 = 'fc2';
        break;
      case 'webnode':
        providerNameV5 = 'webnode';
        break;
      case 'Livedoor':
        providerNameV5 = 'livedoor';
        break;
      case 'SeeSaa':
        providerNameV5 = 'seesaa';
        break;
      case 'アメーバ':
        providerNameV5 = 'ameba';
        break;
      case '楽天':
        providerNameV5 = 'rakuten';
        break;
      case 'ココログ':
        providerNameV5 = 'kokolog';
        break;
      case 'Yaplog':
        providerNameV5 = 'yaplog';
        break;
      case 'Jugem':
        providerNameV5 = 'jugem';
        break;
      case '忍者':
        providerNameV5 = 'ninjya';
        break;
      case 'はてな':
        providerNameV5 = 'hatena';
        break;
      case 'ウェブリブログ':
        providerNameV5 = 'webryblog';
        break;
      case 'WordPress.com':
        providerNameV5 = 'wpcom';
        break;
      case 'gooブログ':
        providerNameV5 = 'goo';
        break;
      default:
        providerNameV5 = 'unknown';
    }

    return providerNameV5;
  };

  /**
   * ブログアカウントインポートボタン・クリック
   * main processの「request-importBlogAccount-action」を呼び出し
   * ファイル選択用ダイアログを表示させる
   */
  handleClickImportButton = () => {
    // import用ダイアログの要求
    ipcRenderer.send('request-importBlogAccount-action');
  };

  /**
   * error notification close
   */
  handleErrorNotificationClose = () => {
    this.setState({
      openErrorNotification: false,
      metaMessage: '',
      isLoading: false
    });
  };

  /**
   * success notification close
   */
  handleSuccessNotificationClose = () => {
    this.setState({
      openSuccessNotification: false,
      metaMessage: '',
      isLoading: false
    });
  };

  /**
   * ブログアカウントのインポート時にDupがある場合、
   * ファイル出力するかを問うダイアログ表示を閉じるメソッド
   * --
   * 保存を選択時には、main processへ
   * ファイル保存用ダイアログの表示を要求
   * @param req 保存時 needSave
   */
  handleCloseModal = req => {
    this.setState({
      openModalSaveErrorAccounts: false,
      metaMessage: '',
      isLoading: false
    });

    if (req === 'needSave') {
      // main processへファイル保存ダイアログ表示の要求
      ipcRenderer.send('request-errorBlogAccount-export-action');
    }
  };

  /**
   * ブログ追加フォームを開く
   */
  handleOpenFormBlogAdd = () => {
    this.setState({ openFormBlogAdd: true });
  };

  /**
   * ブログ追加フォームを閉じる
   */
  handleCloseFormBlogAdd = () => {
    this.setState({ openFormBlogAdd: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <Loadable active={this.state.isLoading} spinner text="サーバーと通信中・・・">
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Web />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>ブログ一覧</h4>
                <GridContainer justify="flex-end" className={classes.cardContentRight}>
                  <div className={classes.buttonGroupStyle}>
                    <Tooltip title="新規ブログを追加" placement="bottom">
                      <Button
                        color="primary"
                        onClick={this.handleOpenFormBlogAdd}
                        customClass={classes.firstButton}
                      >
                        <AddIcon />
                        追加
                      </Button>
                    </Tooltip>
                    <Tooltip title="寄騎形式のファイルからブログをインポート" placement="bottom">
                      <Button
                        color="primary"
                        customClass={classes.lastButton}
                        onClick={this.handleClickImportButton}
                      >
                        <FolderDownloadIcon />
                        インポート
                      </Button>
                    </Tooltip>
                  </div>
                </GridContainer>
              </CardHeader>
              <CardBody>
                <div>
                  <BlogList
                    mode={this.state.mode}
                    isFailure={this.props.isFailure}
                    errorMessage={this.props.metaMessage}
                    blogAccounts={this.props.blogAccounts}
                    deleteAccount={this.props.startDeleteBlogAccount}
                    editAccount={this.props.startUpdateBlogAccount}
                  />
                </div>
              </CardBody>
            </Card>
            <Snackbar
              color="warning"
              place="bc"
              icon={AddAlert}
              open={this.state.openErrorNotification}
              closeNotification={this.handleErrorNotificationClose}
              close
              message={<span id="login_error">{this.state.errorMessage}</span>}
            />
            <Snackbar
              color="success"
              place="bc"
              icon={AddAlert}
              open={this.state.openSuccessNotification}
              closeNotification={this.handleSuccessNotificationClose}
              close
              message={<span id="login_error">{this.state.errorMessage}</span>}
            />
            <Dialog
              classes={{
                root: classes.center,
                paper: `${classes.modal} ${classes.modalSmall}`
              }}
              open={this.state.openModalSaveErrorAccounts}
              transition={Transition}
              keepMounted
              onClose={() => this.handleClose('noticeModal')}
              aria-labelledby="small-modal-slide-title"
              aria-describedby="small-modal-slide-description"
            >
              <DialogTitle
                id="small-modal-slide-title"
                disableTypography
                className={classes.modalHeader}
              >
                {this.state.metaMessage}
              </DialogTitle>
              <DialogContent
                id="small-modal-slide-description"
                className={`${classes.modalBody} ${classes.modalSmallBody}`}
              >
                <h5>重複のためインポートされなかったブログアカウントをファイルに書出しますか？</h5>
              </DialogContent>
              <DialogActions className={`${classes.modalFooter} ${classes.modalFooterCenter}`}>
                <Button
                  onClick={() => this.handleCloseModal('doNotNeedSave')}
                  color="simple"
                  customClass={classes.modalSmallFooterFirstButton}
                >
                  いいえ
                </Button>
                <Button
                  onClick={() => this.handleCloseModal('needSave')}
                  color="successNoBackground"
                  customClass={`${classes.modalSmallFooterFirstButton} ${
                    classes.modalSmallFooterSecondButton
                  }`}
                >
                  はい
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              classes={{
                root: classes.formCenter,
                paper: `${classes.modal} ${classes.modalSmall}`
              }}
              open={this.state.openFormBlogAdd}
              transition={Transition}
              keepMounted
              onClose={() => this.handleCloseFormBlogAdd()}
            >
              <DialogContent
                id="formMailAddressAddBody"
                className={`${classes.modalBody} ${classes.modalSmallBody}`}
              >
                <FormBlogAdd
                  mode={this.state.mode}
                  formStatus={this.state.openFormBlogAdd}
                  isFailure={this.props.isFailure}
                  isLoading={this.props.isCreating}
                  metaMessage={this.props.metaMessage}
                  closeForm={this.handleCloseFormBlogAdd}
                  addBlogAccount={this.props.startCreateBlogAccount}
                />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      </Loadable>
    );
  }
}

export default withStyles(accountListPageStyles)(BlogListPage);
