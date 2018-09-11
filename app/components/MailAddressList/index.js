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
import Close from '@material-ui/icons/Close';
import AddAlert from '@material-ui/icons/AddAlert';
import OpenInNew from '@material-ui/icons/OpenInNew';
import MailOutline from '@material-ui/icons/MailOutline';
import { AddIcon, FolderDownloadIcon } from '../../assets/icons';

import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';
import Card from '../../ui/Card/Card';
import CardIcon from '../../ui/Card/CardIcon';
import CardHeader from '../../ui/Card/CardHeader';
import CardBody from '../../ui/Card/CardBody';
import Button from '../../ui/CustomButtons/Button';
import Snackbar from '../../ui/Snackbar/Snackbar';
import type MailAccountType from '../../types/mailAccount';
import MailAddressList from './mailAddressList';
import FormMailAddressAdd from './formMailAddressAdd';

import accountListPageStyles from '../../assets/jss/material-dashboard-pro-react/views/accountListPageStyle';
import WizardViewMail from '../MailAccountCreate';
import type BlogAccountType from '../../types/blogAccount';

type State = {
  isLoading: boolean,
  isFailure: boolean,
  metaMessage: string,
  transAccounts: Array<MailAccountType>,
  openSuccessNotification: boolean,
  openErrorNotification: boolean,
  openModalSaveErrorAccounts: boolean,
  openFormMailAddressAdd: boolean,
  openFormMailAddressNew: boolean,
  mode: string,
  importSourceFile: boolean
};
type Props = {
  classes: Object,
  // startGetMailAccounts: () => void,
  startImportMailAccounts: (mailAccounts: Array<MailAccountType>) => void,
  startCreateMailAccount: (mailAccount: MailAccountType) => void,
  startUpdateMailAccount: (mailAccount: MailAccountType) => void,
  startDeleteMailAccount: (mailAccount: MailAccountType) => void,
  startCloseConnection: () => void,
  startGetRandomPersonalInfo: () => void,
  startSavePersonalInfoForBlog: () => void,
  startCreateBlogAccount: (blogAccount: BlogAccountType) => void,
  startUpdateLastLogin: (mailAccount: MailAccountType) => void,
  mailAccounts: Array<MailAccountType>,
  isGetting: boolean,
  isCreating: boolean,
  isUpdating: boolean,
  isDeleting: boolean,
  isImporting: boolean,
  isFailure: boolean,
  metaMessage: string,
  transAccounts: Array<MailAccountType>
};

const convertProviderName = provider => {
  let providerMailV5 = '';
  switch (provider) {
    case 'Yahoo':
      providerMailV5 = 'Yahoo';
      break;
    case 'Excite':
      providerMailV5 = 'unknown';
      break;
    case 'Outlook':
      providerMailV5 = 'Outlook';
      break;
    case 'Yandex':
      providerMailV5 = 'Yandex';
      break;
    default:
      providerMailV5 = 'unknown';
      break;
  }
  return providerMailV5;
};

const Transition = props => <Slide direction="down" {...props} />;

/*
const modalCloseButtonStyle = {
  color: '#999999',
  marginTop: '0',
  marginRight: '12px',
  WebkitAppearance: 'none',
  padding: '0',
  cursor: 'pointer',
  background: '0 0',
  border: '0',
  fontSize: 'inherit',
  opacity: '.9',
  textShadow: 'none',
  fontWeight: '700',
  lineHeight: '1',
  float: 'right',
  height: '32px'
};
*/

/**
 * メールアカウント一覧ページ
 *    mailAddressList
 *       --formMailAddressEdit
 *
 *       --MailAccount( login via imap)
 *          --mailBox(left)
 *          --messageView(right)
 *
 */
class MailAddressListPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      metaMessage: this.props.metaMessage,
      transAccounts: this.props.transAccounts,
      openSuccessNotification: false,
      openErrorNotification: false,
      openModalSaveErrorAccounts: false,
      openFormMailAddressAdd: false,
      openFormMailAddressNew: false,
      mode: 'none',
      importSourceFile: false
    };
  }

  /**
   * コンポーネントがマウントされたときにリスナをセット
   */
  componentDidMount() {
    /**
     * main processから、「SEND_IMPORTED_MAIL_ACCOUNT」で呼ばれるリスナ
     * text(寄騎からエクスポートしたmail accounts json text)を受信
     */
    ipcRenderer.on('SEND_IMPORTED_MAIL_ACCOUNT', (_e, jsonFile) => {
      // エラー(ユーザーキャンセル含む)の場合、受信テキストに「error:-:」を含む
      if (jsonFile.indexOf('error:-:') > -1) {
        const errorMsg = jsonFile.replace('error:-:', '');
        this.setState({
          openErrorNotification: true,
          metaMessage: errorMsg
        });
        return;
      }

      // 受信したjsonデータをobjectへ変換
      const mAccounts = JSON.parse(jsonFile);

      // mailAccountのjsonかをチェック
      if (!this.checkMailAccountObject(mAccounts[0])) {
        this.setState({
          metaMessage: '寄騎メールアドレスデータではありません。ファイルを確認してください。',
          openErrorNotification: true
        });
        return;
      }

      this.setState({ isLoading: true, importSourceFile: true });
      // インポート用MainAccountType配列
      const mailAccounts: Array<MailAccountType> = [];
      // 受信object[key, createDate, lastLogin]をMailAccountTypeの型に変換
      mAccounts.forEach(ac => {
        const numberCreateDate: number = moment(ac.createDate).valueOf();
        let numberLastLogin: ?number =
          ac.lastLogin === undefined || ac.length === null ? 0 : moment(ac.lastLogin).valueOf();
        if (Number.isNaN(numberLastLogin)) {
          numberLastLogin = 0;
        }
        const checkedProviderName = convertProviderName(ac.provider);
        const acNum = {
          ...ac,
          createDate: numberCreateDate,
          lastLogin: numberLastLogin,
          provider: checkedProviderName
        };
        const ma: MailAccountType = {
          key: '',
          ...acNum
        };
        // インポート用objectへ追加
        mailAccounts.push(ma);
      });
      // インポートアクションをdispatch
      this.props.startImportMailAccounts(mailAccounts);
    });

    /**
     * main ProcessからerrorMailAccountsのjson要求のリスナ
     */
    ipcRenderer.on('REQUEST_ERROR_MAIL_ACCOUNT_JSON', () => {
      let jsonFile: string = '';
      if (this.state.transAccounts.length > 0) {
        const mailAccounts = [];
        this.state.transAccounts.forEach(acc => {
          const createDate = moment(acc.createDate).format();
          const lastLogin = acc.lastLogin ? moment(acc.lastLogin).format() : '';
          const accTimeToString = {
            ...acc,
            createDate,
            lastLogin
          };
          delete accTimeToString.key;
          mailAccounts.push(accTimeToString);
        });
        jsonFile = JSON.stringify(mailAccounts, undefined, 4);
      }
      ipcRenderer.send('REPLY_ERROR_MAIL_ACCOUNT_JSON', jsonFile);

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
    console.log(
      `imp:${nextProps.isImporting}--cre:${nextProps.isCreating}--Get:${nextProps.isGetting}--up:${
        nextProps.isUpdating
      }--del:${nextProps.isDeleting}`
    );
    // notification表示用flagとmessage
    let isSuccess = false;
    let isFailure = false;
    let isSuccessButDup = false;
    let notificationMsg = '';

    if (
      !nextProps.isImporting &&
      !nextProps.isCreating &&
      !nextProps.isGetting &&
      !nextProps.isUpdating &&
      !nextProps.isDeleting
    ) {
      // request完了後に処理済みでのprops更新
      switch (this.state.mode) {
        case 'import':
          if (!nextProps.isFailure) {
            // import成功
            notificationMsg = nextProps.metaMessage;
            if (nextProps.transAccounts.length > 0) {
              // import成功 dupあり
              if (this.state.importSourceFile) {
                isSuccessButDup = true;
              }
            } else if (this.state.importSourceFile) {
              // import成功 dupなし
              isSuccess = true;
            }
          } else {
            // import失敗
            isFailure = true;
            notificationMsg = `インポートエラー：${nextProps.metaMessage}`;
          }

          this.setState({
            transAccounts: nextProps.transAccounts,
            openSuccessNotification: isSuccess,
            openErrorNotification: isFailure,
            metaMessage: notificationMsg,
            openModalSaveErrorAccounts: isSuccessButDup,
            mode: 'none',
            importSourceFile: false
          });
          break;
        default:
          console.log(`default:${this.state.mode}`);
          break;
      }
    } else {
      // Request時のpropsが更新で、modeに処理名を設定
      console.log(`isCreating:${nextProps.isCreating}`);
      if (nextProps.isImporting) {
        this.setState({ mode: 'import' });
        return;
      }
      if (nextProps.isCreating) {
        console.log('create request');
        this.setState({ mode: 'create' });
        return;
      }
      if (nextProps.isGetting) {
        this.setState({ mode: 'get' });
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
    ipcRenderer.removeAllListeners('REQUEST_ERROR_ACCOUNT_JSON');
  }

  checkMailAccountObject = account => {
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

    if (account.createDate === undefined) {
      return false;
    }

    if (account.lastLogin === undefined) {
      return false;
    }

    return account.tags !== undefined;
  };

  /**
   * メールアカウントインポートボタン・クリック
   * main processの「request-importMailAccount-action」を呼び出し
   * ファイル選択用ダイアログを表示させる
   */
  handleClickImportButton = () => {
    // import用のダイアログ要求
    ipcRenderer.send('request-importMailAccount-action');
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
   * メールアカウントのインポート時にDupがある場合、
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
      ipcRenderer.send('request-errorMailAccount-export-action');
    }
  };

  /**
   * 編集フォームを閉じる
   */
  handleCloseEditForm = () => {
    this.setState({
      mode: ''
    });
  };

  /**
   * 追加フォームを開く
   */
  handleOpenFormMailAddressAdd = () => {
    this.setState({ openFormMailAddressAdd: true });
  };

  /**
   * 追加フォームを閉じる
   */
  handleCloseFormMailAddressAdd = () => {
    this.setState({ openFormMailAddressAdd: false });
  };

  /**
   * 新規メールアドレス取得のため、formMailAddressNewを表示
   */
  handleOpenFormMailAddressNew = () => {
    this.props.startGetRandomPersonalInfo();
    this.setState({ openFormMailAddressNew: true });
  };

  /**
   * formMailAddressNewを閉じる
   */
  handleCloseFormMailAddressNew = () => {
    this.setState({ openFormMailAddressNew: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <Loadable active={this.state.isLoading} spinner text="サーバーと通信中・・・・">
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <MailOutline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>メールアドレス一覧</h4>
                <GridContainer justify="flex-end" className={classes.cardContentRight}>
                  <div className={classes.buttonGroupStyle}>
                    <Tooltip title="新規メールアドレスを作成" placement="bottom">
                      <Button
                        color="primary"
                        className={classes.firstButton}
                        onClick={() => this.handleOpenFormMailAddressNew()}
                      >
                        <OpenInNew />
                        新規作成
                      </Button>
                    </Tooltip>
                    <Tooltip title="メールアドレスを手入力で追加" placement="bottom">
                      <Button
                        color="primary"
                        className={classes.middleButton}
                        onClick={this.handleOpenFormMailAddressAdd}
                      >
                        <AddIcon />
                        追加
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title="寄騎形式のファイルからメールアドレスをインポート"
                      placement="bottom"
                    >
                      <Button
                        color="primary"
                        className={classes.lastButton}
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
                <MailAddressList
                  mode={this.state.mode}
                  isFailure={this.props.isFailure}
                  errorMessage={this.props.metaMessage}
                  mailAccounts={this.props.mailAccounts}
                  deleteAccount={this.props.startDeleteMailAccount}
                  editAccount={this.props.startUpdateMailAccount}
                  closeEditForm={this.handleCloseEditForm}
                  closeConnection={this.props.startCloseConnection}
                  createBlogAccount={this.props.startCreateBlogAccount}
                  savePersonalInfoForBlog={this.props.startSavePersonalInfoForBlog}
                  updateLastLogin={this.props.startUpdateLastLogin}
                />
              </CardBody>
            </Card>
            <Snackbar
              color="warning"
              place="bc"
              icon={AddAlert}
              open={this.state.openErrorNotification}
              closeNotification={this.handleErrorNotificationClose}
              close
              message={<span id="login_error">{this.state.metaMessage}</span>}
            />
            <Snackbar
              color="success"
              place="bc"
              icon={AddAlert}
              open={this.state.openSuccessNotification}
              closeNotification={this.handleSuccessNotificationClose}
              close
              message={<span id="login_error">{this.state.metaMessage}</span>}
            />
            <Dialog
              classes={{
                root: classes.center,
                paper: `${classes.modalNarrow} ${classes.modalSmall}`
              }}
              open={this.state.openModalSaveErrorAccounts}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleClose('noticeModal')}
            >
              <DialogTitle id="has-dup" disableTypography className={classes.modalHeader}>
                {this.state.metaMessage}
              </DialogTitle>
              <DialogContent
                id="dup-description"
                className={`${classes.modalBody} ${classes.modalSmallBody}`}
              >
                <h5>重複のためインポートされなかったメールアカウントをファイルに書出しますか？</h5>
              </DialogContent>
              <DialogActions className={`${classes.modalFooter} ${classes.modalFooterCenter}`}>
                <Button
                  onClick={() => this.handleCloseModal('doNotNeedSave')}
                  color="danger"
                  className={classes.modalSmallFooterFirstButton}
                >
                  いいえ
                </Button>
                <Button
                  onClick={() => this.handleCloseModal('needSave')}
                  color="success"
                  className={`${classes.modalSmallFooterFirstButton} ${
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
              open={this.state.openFormMailAddressAdd}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleCloseFormMailAddressAdd()}
            >
              <DialogContent
                id="formMailAddressAddBody"
                className={`${classes.modalBody} ${classes.modalSmallBody}`}
              >
                <FormMailAddressAdd
                  mode={this.state.mode}
                  formStatus={this.state.openFormMailAddressAdd}
                  isFailure={this.props.isFailure}
                  isLoading={this.props.isCreating}
                  metaMessage={this.props.metaMessage}
                  closeForm={this.handleCloseFormMailAddressAdd}
                  addMailAddress={this.props.startCreateMailAccount}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              classes={{
                root: classes.formCenter,
                paper: `${classes.modal} ${classes.modalSmall}`
              }}
              open={this.state.openFormMailAddressNew}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleCloseFormMailAddressNew()}
            >
              <Button
                justIcon
                className={classes.modalCloseButton}
                key="close"
                aria-label="Close"
                color="transparent"
                onClick={() => this.handleCloseFormMailAddressNew()}
              >
                <Close className={classes.modalClose} />
              </Button>
              <DialogContent
                id="formMailAddressNewBody"
                className={`${classes.modalBody} ${classes.modalSmallBody}`}
              >
                <WizardViewMail
                  mode={this.state.mode}
                  color="primary"
                  createMailAccount={this.props.startCreateMailAccount}
                  cancelAccount={this.handleCloseFormMailAddressNew}
                  mailAccounts={this.props.mailAccounts}
                />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      </Loadable>
    );
  }
}

export default withStyles(accountListPageStyles)(MailAddressListPage);
