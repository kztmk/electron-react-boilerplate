// @flow
import { ipcRenderer } from 'electron';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Slide from 'material-ui/transitions/Slide';
import Web from 'material-ui-icons/Web';

// import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';

import moment from 'moment';
// material-ui-icons
import AddAlert from 'material-ui-icons/AddAlert';
import BlogList from './blogList';
import { GridContainer, ItemGrid, IconCard, Snackbar } from '../../ui';
import type BlogAccountType from '../../types/blogAccount';

import Button from '../../ui/CustomButtons/Button';

import accountListPageStyles from '../../asets/jss/material-dashboard-pro-react/views/accountListPageStyle';

type State = {
  isFailure: boolean,
  errorMessage: string,
  msg: string,
  errorAccounts: Array<BlogAccountType>,
  openSuccessNotification: boolean,
  openErrorNotification: boolean,
  openModalSaveErrorAccounts: boolean,
  mode: string
};
type Props = {
  classes: Object,
  startImportBlogAccounts: (blogAccounts: Array<BlogAccountType>) => void,
  startCreateBlogAccount: (blogAccount: BlogAccountType) => void,
  startUpdateBlogAccount: (blogAccount: BlogAccountType) => void,
  startDeleteBlogAccount: (blogAccount: BlogAccountType) => void,
  blogAccounts: Array<BlogAccountType>,
  targetAccount: BlogAccountType,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  errorAccounts: Array<BlogAccountType>
};

const Transition = props => <Slide direction="down" {...props} />;

/**
 * ブログアカウント一覧ページ
 */
class BlogListPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: this.props.errorMessage,
      errorAccounts: this.props.errorAccounts,
      openSuccessNotification: false,
      openErrorNotification: false,
      openModalSaveErrorAccounts: false,
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
      if (jsonFile.indexOf('error:-:') > -1) {
        const errorMsg = jsonFile.replace('error:-:', '');
        this.setState({
          openErrorNotification: true,
          errorMessage: errorMsg
        });
        return;
      }

      // 受信したjsonデータをobjectへ変換
      const mAccounts = JSON.parse(jsonFile);
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
      if (this.state.errorAccounts.length > 0) {
        const blogAccounts = [];
        this.state.errorAccounts.forEach(acc => {
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
        errorMessage: ''
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

    if (!nextProps.isLoading) {
      if (this.state.mode === 'import') {
        if (!nextProps.isFailure) {
          notificationMsg = nextProps.errorMessage;
          if (nextProps.errorAccounts.length > 0) {
            isSuccessButDup = true;
          } else {
            isSuccess = true;
          }
        } else {
          isFailure = true;
          notificationMsg = `インポートエラー：${nextProps.errorMessage}`;
        }
        this.setState({
          errorAccounts: nextProps.errorAccounts,
          openSuccessNotification: isSuccess,
          openErrorNotification: isFailure,
          errorMessage: notificationMsg,
          openModalSaveErrorAccounts: isSuccessButDup,
          mode: 'none'
        });
      }
    } else {
      // loading
    }
  };

  /**
   * コンポーネントが閉じられるときにリスナを解放
   */
  componentWillUnmount() {
    ipcRenderer.removeAllListeners('REQUEST_ERROR_BLOG_ACCOUNT_JSON');
  }

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
  handleClickButton = () => {
    ipcRenderer.send('request-importBlogAccount-action');
    this.setState({
      mode: 'import'
    });
  };

  /**
   * error notification close
   */
  handleErrorNotificationClose = () => {
    this.setState({
      openErrorNotification: false,
      errorMessage: ''
    });
  };

  /**
   * success notification close
   */
  handleSuccessNotificationClose = () => {
    this.setState({
      openSuccessNotification: false,
      errorMessage: ''
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
    if (req === 'needSave') {
      // main processへファイル保存ダイアログ表示の要求
      ipcRenderer.send('request-errorBlogAccount-export-action');
    } else {
      // 保存しない場合には、ダイアログを閉じる
      this.setState({
        openModalSaveErrorAccounts: false,
        errorMessage: ''
      });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <GridContainer>
        <ItemGrid xs={12} sm={12} md={12}>
          <IconCard
            icon={Web}
            title="ブログ一覧"
            content={
              <div>
                <GridContainer justify="flex-end" className={classes.cardContentRight}>
                  <div className={classes.buttonGroupStyle}>
                    <Button color="primary" customClass={classes.firstButton}>
                      追加
                    </Button>
                    <Button
                      color="primary"
                      customClass={classes.lastButton}
                      onClick={this.handleClickButton}
                    >
                      ファイルからインポート
                    </Button>
                  </div>
                </GridContainer>
                <BlogList
                  isLoading={this.props.isLoading}
                  isFailure={this.props.isFailure}
                  errorMessage={this.props.errorMessage}
                  blogAccounts={this.props.blogAccounts}
                  deleteAccount={this.props.startDeleteBlogAccount}
                  editAccount={this.props.startUpdateBlogAccount}
                />
              </div>
            }
          />
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
              {this.state.errorMessage}
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
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(accountListPageStyles)(BlogListPage);
