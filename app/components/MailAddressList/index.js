// @flow
import { ipcRenderer } from 'electron';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Slide from 'material-ui/transitions/Slide';
import MailOutline from 'material-ui-icons/MailOutline';
import Loadable from 'react-loading-overlay';

// import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';

import moment from 'moment';
// material-ui-icons
import AddAlert from 'material-ui-icons/AddAlert';

import { GridContainer, ItemGrid, IconCard, Snackbar } from '../../ui';
import type MailAccountType from '../../types/mailAccount';
import MailAddressList from './mailAddressList';

import Button from '../../ui/CustomButtons/Button';

import accountListPageStyles from '../../asets/jss/material-dashboard-pro-react/views/accountListPageStyle';

type State = {
  isFailure: boolean,
  isLoading: boolean,
  errorMessage: string,
  msg: string,
  errorAccounts: Array<MailAccountType>,
  openSuccessNotification: boolean,
  openErrorNotification: boolean,
  openModalSaveErrorAccounts: boolean,
  mode: string
};
type Props = {
  classes: Object,
  startGetMailAccounts: () => void,
  startImportMailAccounts: (mailAccounts: Array<MailAccountType>) => void,
  startCreateMailAccount: (mailAccount: MailAccountType) => void,
  startUpdateMailAccount: (mailAccount: MailAccountType) => void,
  startDeleteMailAccount: (mailAccount: MailAccountType) => void,
  mailAccounts: Array<MailAccountType>,
  isLoading: boolean,
  isFailure: boolean,
  isRefreshDone: boolean,
  errorMessage: string,
  errorAccounts: Array<MailAccountType>
};

const convertProviderName = provider => {
  let providerMailV5 = '';
  switch (provider) {
    case 'Yahoo':
      providerMailV5 = 'Yahoo';
      break;
    case 'Excite':
      providerMailV5 = 'Excite';
      break;
    case 'Outlook':
      providerMailV5 = 'Outlook';
      break;
    default:
      providerMailV5 = 'unknown';
      break;
  }
  return providerMailV5;
};

const Transition = props => <Slide direction="down" {...props} />;

/**
 * メールアカウント一覧ページ
 */
class MailAddressListPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: this.props.errorMessage,
      errorAccounts: this.props.errorAccounts,
      openSuccessNotification: false,
      openErrorNotification: false,
      openModalSaveErrorAccounts: false,
      mode: 'none',
      isLoading: false
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
          errorMessage: errorMsg,
          isLoading: false
        });
        return;
      }

      // 受信したjsonデータをobjectへ変換
      const mAccounts = JSON.parse(jsonFile);

      // mailAccountのjsonかをチェック
      if (!this.checkMailAccountObject(mAccounts[0])) {
        this.setState({
          errorMessage: '寄騎メールアドレスデータではありません。ファイルを確認してください。',
          openErrorNotification: true,
          isLoading: false
        });
        return;
      }

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
      this.setState({ isLoading: true });
      this.props.startImportMailAccounts(mailAccounts);
    });

    /**
     * main ProcessからerrorMailAccountsのjson要求のリスナ
     */
    ipcRenderer.on('REQUEST_ERROR_MAIL_ACCOUNT_JSON', () => {
      let jsonFile: string = '';
      if (this.state.errorAccounts.length > 0) {
        const mailAccounts = [];
        this.state.errorAccounts.forEach(acc => {
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
      switch (this.state.mode) {
        case 'import':
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
            mode: 'none',
            isLoading: nextProps.isLoading
          });
          break;
        case 'refresh':
          if (nextProps.isRefreshDone && !nextProps.isFailure) {
            // refresh完了後にファイルダイアログのリクエスト
            ipcRenderer.send('request-importMailAccount-action');
            this.setState({
              mode: 'import'
            });
          }
          break;
        default:
          break;
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

    if (account.tags === undefined) {
      return false;
    }

    return true;
  };

  /**
   * メールアカウントインポートボタン・クリック
   * main processの「request-importMailAccount-action」を呼び出し
   * ファイル選択用ダイアログを表示させる
   */
  handleClickButton = () => {
    // import前に最新のmailAccounts情報を取得
    this.setState({
      mode: 'refresh',
      isLoading: true
    });

    this.props.startGetMailAccounts();
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
   * メールアカウントのインポート時にDupがある場合、
   * ファイル出力するかを問うダイアログ表示を閉じるメソッド
   * --
   * 保存を選択時には、main processへ
   * ファイル保存用ダイアログの表示を要求
   * @param req 保存時 needSave
   */
  handleCloseModal = req => {
    if (req === 'needSave') {
      // main processへファイル保存ダイアログ表示の要求
      ipcRenderer.send('request-errorMailAccount-export-action');
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
      <Loadable active={this.state.isLoading} spinner text="サーバーと通信中・・・・">
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={12}>
            <IconCard
              icon={MailOutline}
              title="メールアドレス一覧"
              content={
                <div>
                  <GridContainer justify="flex-end" className={classes.cardContentRight}>
                    <div className={classes.buttonGroupStyle}>
                      <Button color="primary" customClass={classes.firstButton}>
                        新規作成
                      </Button>
                      <Button color="primary" customClass={classes.middleButton}>
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
                  <MailAddressList
                    isLoading={this.props.isLoading}
                    isFailure={this.props.isFailure}
                    errorMessage={this.props.errorMessage}
                    mailAccounts={this.props.mailAccounts}
                    deleteAccount={this.props.startDeleteMailAccount}
                    editAccount={this.props.startUpdateMailAccount}
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
                <h5>重複のためインポートされなかったメールアカウントをファイルに書出しますか？</h5>
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
      </Loadable>
    );
  }
}

export default withStyles(accountListPageStyles)(MailAddressListPage);
