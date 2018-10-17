/* eslint-disable prefer-destructuring */
// @flow
import React from 'react';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import Loadable from 'react-loading-overlay';
import moment from 'moment';
import TagsInput from 'react-tagsinput';
import matchSorter from 'match-sorter';
import generatePassword from 'password-generator';

import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

// material-ui-icons
import Edit from '@material-ui/icons/Edit';
import DeleteForever from '@material-ui/icons/DeleteForever';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import Close from '@material-ui/icons/Close';

import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';
import Button from '../../ui/CustomButtons/Button';
import type MailAccountType from '../../types/mailAccount';

import Yahoo from '../../assets/img/providerImage/y64.png';
import Excite from '../../assets/img/providerImage/excite64.png';
import Outlook from '../../assets/img/providerImage/outlook64.png';
import Gmail from '../../assets/img/providerImage/gmail64.png';
import Yandex from '../../assets/img/providerImage/yandex64.png';
import ownDomain from '../../assets/img/providerImage/domain64.png';

import { LoginIcon } from '../../assets/icons';
import FormMailAddressEdit from './formMailAddressEdit';
import accountListPageStyle from '../../assets/jss/material-dashboard-pro-react/views/accountListPageStyle';
import SweetAlertTitle from '../SweetAlertTitle';

import MailAccount from '../../containers/MailAccount';
import WizardViewBlog from '../BlogAccountCreate';
import type BlogAccountType from '../../types/blogAccount';
import type PersonalInfoType from '../../types/personalInfo';
import PuppeteerEmail from '../MailAccountCreate/puppeteerEmail';

import getValidationLink from '../../drivers/emails/imap';
import GavelPopup from '../Utils/gavel';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

type State = {
  data: Array<Object>,
  sweetAlert: ?Object,
  mode: string,
  targetAccount: ?MailAccountType,
  openEditForm: boolean,
  openMailAccount: boolean,
  openFormBlogAccountNew: boolean,
  isUpdated: boolean
};

type Props = {
  classes: Object,
  mailAccounts: Array<MailAccountType>,
  mode: string,
  isFailure: boolean,
  errorMessage: string,
  deleteAccount: () => void,
  editAccount: () => void,
  closeConnection: () => void,
  closeEditForm: () => void,
  createBlogAccount: (blogAccout: BlogAccountType) => void,
  savePersonalInfoForBlog: (personalInfo: PersonalInfoType) => void,
  updateLastLogin: (mailAccount: MailAccountType) => void
};

const initialMailAccount = {
  key: '',
  accountId: '',
  password: '',
  mailAddress: '',
  provider: '',
  createDate: 0,
  lastLogin: null,
  tags: '',
  detailInfo: []
};

export const getProviderImage = providerName => {
  switch (providerName) {
    case 'Yahoo':
      return Yahoo;
    case 'Excite':
      return Excite;
    case 'Outlook':
      return Outlook;
    case 'Gmail':
      return Gmail;
    case 'Yandex':
      return Yandex;
    case 'ownDomain':
      return ownDomain;
    default:
      return '';
  }
};

/*
const modalCloseButtonStyle = {
  color: '#999999',
  marginTop: '-12px',
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

class MailAddressList extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      data: this.convertTableData(this.props.mailAccounts),
      targetAccount: initialMailAccount,
      sweetAlert: null,
      mode: 'none',
      openEditForm: false,
      openMailAccount: false,
      openFormBlogAccountNew: false
    };
  }

  /**
   * Props更新
   * 処理モード
   *   - delete
   *    --- success
   *            成功ダイアログ表示
   *            mailAccount更新
   *    --- fail
   *            失敗ダイアログ表示
   *
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    // 処理 deleteで更新されたのか？ this.stae.modeが空欄の場合はrequest
    if (nextProps.mode === 'delete' && this.state.mode === 'delete') {
      if (!nextProps.isFailure) {
        // delete success
        const email = this.state.targetAccount.mailAddress;
        this.setState({
          data: this.convertTableData(nextProps.mailAccounts),
          sweetAlert: (
            <SweetAlert
              success
              style={{ display: 'block', marginTop: '-100px' }}
              title="削除完了"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
            >
              メールアドレス:
              {email}
              を削除しました。
            </SweetAlert>
          )
        });
      } else {
        // delete fail
        this.setState({
          sweetAlert: (
            <SweetAlert
              error
              style={{ display: 'block', marginTop: '-100px' }}
              title="削除失敗"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
            >
              削除エラー:
              {nextProps.errorMessage}
            </SweetAlert>
          )
        });
      }
    } else {
      // 削除以外
      this.setState({
        data: this.convertTableData(nextProps.mailAccounts)
      });
    }
  };

  /**
   * prospで受け取るmailAccountデータをテーブル表示用に変換
   * @param mailAccounts
   * @returns {*}
   */
  convertTableData = mailAccounts =>
    mailAccounts.map(prop => ({
      key: prop.key,
      accountId: prop.accountId,
      password: prop.password,
      provider: prop.provider,
      mailAddress: prop.mailAddress,
      createDate: moment(prop.createDate).format('YYYY/MM/DD HH:mm'),
      lastLogin: prop.lastLogin === 0 ? '' : moment(prop.lastLogin).format('YYYY/MM/DD HH:mm'),
      tags: prop.tags.split(','),
      detailInfo: prop.detailInfo,
      title: `${prop.mailAddress}/作成日：${moment(prop.createDate).format('YYYY/MM/DD HH:mm')}`,
      actions: (
        <div className="actions-right">
          <Tooltip title="ID、パスワードのコピーなど便利ツール" placement="top-end">
            <GavelPopup account={prop} mode="mail"/>
          </Tooltip>
          <Tooltip title="メールアカウントへログイン" placement="top-end">
            <Button
              justIcon
              onClick={() => {
                const account = this.state.data.find(o => o.key === prop.key);
                if (account) {
                  const restoredTags = account.tags.join(',');
                  const restoredLastLogin =
                    account.lastLogin.length > 0 ? moment(account.lastLogin).valueOf() : 0;
                  const target = {
                    ...account,
                    tags: restoredTags,
                    createDate: moment(account.createDate).valueOf(),
                    lastLogin: restoredLastLogin
                  };
                  // ログインするアカウントをセットして、showMailAccount
                  this.showMailAccount(target);
                } else {
                  alert('ログイン用アカウントの取得に失敗しました。');
                }
              }}
              size="sm"
              round
              color="success"
            >
              <LoginIcon />
            </Button>
          </Tooltip>
          <Tooltip title="メールアカウント情報を表示・編集" placement="top-end">
            <Button
              justIcon
              onClick={() => {
                const account = this.state.data.find(o => o.key === prop.key);
                if (account) {
                  const restoredTags = account.tags.join(',');
                  const restoredLastLogin =
                    account.lastLogin.length > 0 ? moment(account.lastLogin).valueOf() : 0;
                  const target = {
                    ...account,
                    tags: restoredTags,
                    createDate: moment(account.createDate).valueOf(),
                    lastLogin: restoredLastLogin
                  };
                  // 編集対象のアカウントをセットしてshowEditForm
                  this.showEditForm(target);
                } else {
                  alert('編集対象のメールアカウントの取得に失敗しました。');
                }
              }}
              size="sm"
              round
              color="warning"
            >
              <Edit />
            </Button>
          </Tooltip>
          <Tooltip title="メールアカウント情報を削除" placement="top-end">
            <Button
              justIcon
              onClick={() => {
                const account = this.state.data.find(o => o.key === prop.key);
                if (account) {
                  const target = {
                    ...account,
                    tags: '',
                    createDate: moment(account.createDate).valueOf(),
                    lastLogin: moment(account.lastLogin).valueOf()
                  };
                  // 削除処理
                   this.handleDeleteMailAccount(target);
                  // const mailacc = {};
                  // mailacc.accountId = account.accountId;
                  // mailacc.mailAddress = account.mailAddress;
                  // mailacc.password = account.password;
                  // mailacc.sender = 'noreply@id.fc2.com';
                  // mailacc.provider = account.provider;
                  // mailacc.blogProvider = 'fc2';
                  // console.log('---mail criteria---');
                  // console.log(mailacc);
                  // const result = getValidationLink(mailacc);
                } else {
                  alert('削除対象のメールアカウントの取得に失敗しました。');
                }
              }}
              size="sm"
              round
              color="danger"
            >
              <DeleteForever />
            </Button>
          </Tooltip>
          <Tooltip title="新規ブログを作成" placement="top-end">
            <Button
              justIcon
              onClick /* eslint-disable no-alert */={() => {
                const account = this.state.data.find(o => o.key === prop.key);
                if (account) {
                  const target = {
                    ...account,
                    tags: '',
                    createDate: 0,
                    lastLogin: 0
                  };
                  this.createBlogAccount(target);
                } else {
                  alert('ブログ作成用メールアカウントの取得に失敗しました。');
                }
              }}
              size="sm"
              round
              color="info"
            >
              <LibraryAdd />
            </Button>
          </Tooltip>
        </div>
      )
    }));

  restoreMailAccountFromTableRow = account => {
    if (account) {
      const restoredTags = account.tags.join(',');
      const restoredLastLogin =
        account.lastLogin.length > 0 ? moment(account.lastLogin).valueOf() : 0;
      const target = {
        ...account,
        tags: restoredTags,
        lastLogin: restoredLastLogin,
        createDate: moment(account.createDate).valueOf()
      };

      return target;
    }
  };

  /**
   * メールアカウント削除ダイアログからproceed処理を選択
   * ダイアログを非表示に
   * 処理モードを deleteに
   * メールアドレス削除アクションをdispatch
   * @param account
   */
  proceedDelete = account => {
    this.setState({
      sweetAlert: null,
      mode: 'delete'
    });
    this.props.deleteAccount(account);
  };

  /**
   *  メールアカウント削除ダイアログでキャンセルを選択した場合の処理
   */
  cancelDelete = () => {
    this.setState({
      mode: '',
      sweetAlert: (
        <SweetAlert
          danger
          style={{ display: 'block', marginTop: '-100px' }}
          title="キャンセル"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
        >
          メールアドレスの削除をキャンセルしました。
        </SweetAlert>
      )
    });
  };

  /**
   * ダウアログを閉じる
   */
  hideAlert = () => {
    this.setState({
      mode: '',
      sweetAlert: null
    });
  };

  /**
   * テーブル各行の削除ボタンに対応するメソッド =>
   *  --確認ダイアログ
   *  ----yes proceedDelete 削除処理
   *  ----cancel cancelDelete キャンセルダイアログ表示
   * @param account
   */
  handleDeleteMailAccount = (account: ?MailAccountType) => {
    this.setState({
      targetAccount: account,
      sweetAlert: (
        <SweetAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title={
            <SweetAlertTitle
              row1="メールアドレス:"
              elmWord={account.mailAddress}
              row2="を削除しますか？"
            />
          }
          onConfirm={() => this.proceedDelete(account)}
          onCancel={() => this.cancelDelete()}
          confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
          cancelBtnCssClass={`${this.props.classes.button} ${this.props.classes.danger}`}
          confirmBtnText="はい、削除します。"
          cancelBtnText="キャンセル"
          showCancel
        >
          削除したメールアドレスは戻せません。
        </SweetAlert>
      )
    });
  };

  /**
   * mailAccount情報編集フォームを開く
   * @param account
   */
  showEditForm = account => {
    this.setState({
      targetAccount: account,
      openEditForm: true
    });
  };

  /**
   * mailAccount情報編集フォームを閉じる
   */
  handleCloseEditForm = () => {
    this.setState({
      openEditForm: false
    });
    // 親フォームのmodeをリセット
    this.props.closeEditForm();
  };

  showMailAccount = account => {
    this.props.updateLastLogin({ ...account, lastLogin: moment().valueOf() });

    const user = {};
    user.username = account.accountId.replace(/\+.*$/, '');
    user.password = account.password;
    user.email = account.mailAddress;
    user.provider = account.provider.toLowerCase();

    console.log('---mail-login');
    console.log(user);

    const puppeteerEmail = new PuppeteerEmail(user);
    puppeteerEmail.signin(user);

    // imapでmailAccountを開く
    // this.setState({
    //  targetAccount: account,
    //  openMailAccount: true
    // });
  };

  handleCloseMailAccount = () => {
    this.setState({
      targetAccount: initialMailAccount,
      openMailAccount: false
    });
    this.props.closeConnection();
  };

  findPersonalInfoField = (personalDetails, rowContains) =>
    personalDetails.filter(row => row.indexOf(rowContains) !== -1);

  getUserName = row => {
    console.log('row');
    console.log(row);
    if (row.length > 0) {
      const userName = row[0].split(':');
      if (userName.length === 2) {
        return userName[1].split(' ');
      }
    }
    return ['', ''];
  };

  getUserDetail = row => {
    if (row.length > 0) {
      const userInfo = row[0].split(':');
      if (userInfo.length === 2) {
        return userInfo[1];
      }
    }
    return '';
  };

  /**
   * mailAccount行のcreateBlogボタンクリック
   *
   * @param account
   */
  createBlogAccount = account => {
    // mail account情報のdetailInfoから個人情報を作成
    const { detailInfo } = account;
    let userNameLast = '';
    let userNameFirst = '';
    let userNameKanaLast = '';
    let userNameKanaFirst = '';
    let userGender = 0;
    let userPostalCode = '';
    let userPrefecture = '';
    let userBirthDate = '';

    if (detailInfo.length > 1) {
      let userName = this.findPersonalInfoField(detailInfo, '氏名(漢字)');
      let uName = this.getUserName(userName);
      userNameLast = uName[0];
      userNameFirst = uName[1];

      userName = this.findPersonalInfoField(detailInfo, 'しめい(ふりがな)');
      uName = this.getUserName(userName);
      userNameKanaLast = uName[0];
      userNameKanaFirst = uName[1];

      const birthDate = this.findPersonalInfoField(detailInfo, '生年月日');
      userBirthDate = this.getUserDetail(birthDate);
      console.log(`せいねんがっぴ:${userBirthDate}`);
      userBirthDate = moment(userBirthDate, 'YYYY/M/D').format('YYYY/MM/DD');
      console.log(`生年月日:${userBirthDate}`);
      const gender = this.findPersonalInfoField(detailInfo, '性別');
      userGender = gender === '性別:男' ? 0 : 1;
      const postalCode = this.findPersonalInfoField(detailInfo, '郵便番号');
      userPostalCode = this.getUserDetail(postalCode);
      const prefecture = this.findPersonalInfoField(detailInfo, '都道府県');
      userPrefecture = this.getUserDetail(prefecture);
    }

    let accountId = account.accountId;
    if (!/^[a-z0-9]+$/.test(accountId)) {
      accountId = generatePassword(1, false, /[a-z]/) + generatePassword(7, false, /[a-z0-9]/);
    }

    const personalInfo = {
      lastName: userNameLast,
      firstName: userNameFirst,
      lastNameKana: userNameKanaLast,
      firstNameKana: userNameKanaFirst,
      lastNameKatakana: '',
      firstNameKatakana: '',
      lastNameHepburn: '',
      firstNameHepburn: '',
      gender: userGender,
      birthDate: userBirthDate,
      postalCode: userPostalCode,
      prefecture: userPrefecture,
      address1: `${accountId}:${account.password}:${account.mailAddress}`,
      useDefault: false,
      mailAccount: account
    };

    this.props.savePersonalInfoForBlog(personalInfo);
    this.setState({
      targetAccount: account,
      openFormBlogAccountNew: true
    });
  };

  handleCloseFormBlogNew = () => {
    this.setState({
      openFormBlogAccountNew: false
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Loadable active={this.state.mode === 'delete'} spinner text="サーバーと通信中・・・・">
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <ReactTable
              data={this.state.data}
              resizable
              columns={[
                {
                  Header: 'provider',
                  accessor: 'provider',
                  filterable: true,
                  sortable: true,
                  show: false,
                  filterAll: true
                },
                {
                  Header: () => <span style={{ fontSize: 12 }} />,
                  accessor: 'provider',
                  Cell: row => (
                    <Tooltip
                      id={row.original.id}
                      title={row.original.provider}
                      placement="right-start"
                    >
                      <div>
                        <img height={24} src={getProviderImage(row.original.provider)} alt="" />
                      </div>
                    </Tooltip>
                  ),
                  width: 54,
                  filterable: true,
                  sortable: true,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ['provider'] }),
                  Filter: ({ filter, onChange }) => (
                    <select
                      onChange={event => onChange(event.target.value)}
                      style={{ width: '100%', fontSize: '12px' }}
                      value={filter ? filter.value : ''}
                    >
                      <option value="">全て</option>
                      <option value="Yahoo">Yahoo!メール</option>
                      <option value="Outlook">Outlook</option>
                      <option value="Gmail">Gmail</option>
                      <option value="Yandex">Yandex</option>
                    </select>
                  ),
                  filterAll: true
                },
                {
                  Header: () => <span style={{ fontSize: 12 }}>メールアドレス</span>,
                  Cell: row => (
                    <Tooltip
                      id={row.original.id}
                      title={row.original.title}
                      placement="right-start"
                    >
                      <div>{row.original.accountId}</div>
                    </Tooltip>
                  ),
                  accessor: 'accountId',
                  width: 215,
                  maxWidth: 215,
                  filterable: true,
                  sortable: true,
                  Filter: ({ filter, onChange }) => (
                    <input
                      type="text"
                      placeholder="アカウントIDで絞込み"
                      value={filter ? filter.value : ''}
                      onChange={event => onChange(event.target.value)}
                    />
                  ),
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ['accountId'] }),
                  filterAll: true
                },
                {
                  Header: () => <span style={{ fontSize: 12 }}>タグ</span>,
                  accessor: 'tags',
                  Cell: row => (
                    <TagsInput
                      value={row.original.tags}
                      tagProps={{ className: 'react-tagsinput-tag info' }}
                      disabled
                      inputProps={{
                        placeholder: ''
                      }}
                    />
                  ),
                  filterable: true,
                  sortable: true,
                  Filter: ({ filter, onChange }) => (
                    <input
                      type="text"
                      placeholder="タグで絞込み"
                      value={filter ? filter.value : ''}
                      onChange={event => onChange(event.target.value)}
                      style={{ fontSize: 12 }}
                    />
                  ),
                  filterMethod: (filter, row) => {
                    if (row.tags.length > 0) {
                      let isMatch = false;
                      row.tags.forEach(r => {
                        if (r.indexOf(filter.value) > -1) {
                          isMatch = true;
                        }
                      });
                      return isMatch;
                    }
                  }
                },
                {
                  Header: () => <span style={{ fontSize: 12 }}>最終ログイン</span>,
                  accessor: 'lastLogin',
                  width: 120,
                  filterable: true,
                  sortable: true,
                  Filter: ({ filter, onChange }) => (
                    <input
                      type="text"
                      placeholder="YYYY/MM/DDより前"
                      value={filter ? filter.value : ''}
                      onChange={event => onChange(event.target.value)}
                      style={{ fontSize: 12 }}
                    />
                  ),
                  filterMethod: (filter, row) => {
                    if (row[filter.id].length === 0) {
                      return row[filter.id];
                    }
                    if (moment(row[filter.id]) < moment(filter.value)) return row[filter.id];
                  }
                },
                {
                  Header: () => <span style={{ fontSize: 12 }}>作成日</span>,
                  accessor: 'createDate',
                  width: 120,
                  filterable: true,
                  sortable: true,
                  Filter: ({ filter, onChange }) => (
                    <input
                      type="text"
                      placeholder="YYYY/MM/DDより前"
                      value={filter ? filter.value : ''}
                      onChange={event => onChange(event.target.value)}
                      style={{ fontSize: 12 }}
                    />
                  ),
                  filterMethod: (filter, row) => {
                    if (row[filter.id].length === 0) {
                      return row[filter.id];
                    }
                    if (moment(row[filter.id]) < moment(filter.value)) return row[filter.id];
                  }
                },
                {
                  width: 170,
                  Header: '',
                  accessor: 'actions',
                  sortable: false,
                  filterable: false
                }
              ]}
              defaultPageSize={10}
              showPaginationTop
              showPaginationBottom={false}
              className="-striped -highlight"
              previousText="< 前"
              nextText="次 >"
              loadingText="読込中..."
              noDataText="データがありません"
              pageText=""
              ofText="/"
              rowsText="行"
            />
            {this.state.sweetAlert}
            <Dialog
              classes={{
                root: classes.formCenter,
                paper: classes.modal
              }}
              maxWidth={false}
              open={this.state.openEditForm}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleCloseEditForm()}
              aria-labelledby="notice-modal-slide-title"
              aria-describedby="notice-modal-slide-description"
              disableBackdropClick
            >
              <DialogTitle
                id="notice-modal-mailAddress-edit"
                disableTypography
                className={classes.modalHeader}
              >
                <Button
                  justIcon
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="transparent"
                  onClick={() => this.handleCloseEditForm()}
                >
                  <Close className={classes.modalClose} />
                </Button>
              </DialogTitle>
              <DialogContent id="notice-modal-mailAddress-edit-form" className={classes.modalBody}>
                <FormMailAddressEdit
                  mode={this.props.mode}
                  formStatus={this.state.openEditForm}
                  errorMessage={this.props.errorMessage}
                  closeModal={this.handleCloseEditForm}
                  targetAccount={this.state.targetAccount}
                  updateAccount={this.props.editAccount}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              classes={{
                paper: classes.modal
              }}
              maxWidth={false}
              fullWidth
              open={this.state.openMailAccount}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleCloseMailAccount()}
              aria-labelledby="notice-modal-slide-title"
              aria-describedby="notice-modal-slide-description"
              disableBackdropClick
            >
              <DialogTitle
                id="notice-modal-mailAddress-login"
                disableTypography
                className={classes.modalHeader}
              >
                <Button
                  justIcon
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="transparent"
                  onClick={() => this.handleCloseMailAccount()}
                >
                  <Close className={classes.modalClose} />
                </Button>
              </DialogTitle>
              <DialogContent id="notice-modal-mailAddress-login" className={classes.modalBody}>
                <MailAccount
                  formStatus={this.state.openMailAccount}
                  targetAccount={this.state.targetAccount}
                  closeMailAccount={this.handleCloseMailAccount}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              classes={{
                root: classes.formCenter,
                paper: `${classes.modal} ${classes.modalSmall}`
              }}
              open={this.state.openFormBlogAccountNew}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleCloseFormBlogNew()}
            >
              <Button
                justIcon
                className={classes.modalCloseButton}
                key="close"
                aria-label="Close"
                color="transparent"
                onClick={() => this.handleCloseFormBlogNew()}
              >
                <Close className={classes.modalClose} />
              </Button>
              <DialogContent
                id="formMailAddressNewBody"
                className={`${classes.modalBody} ${classes.modalSmallBody}`}
              >
                <WizardViewBlog
                  mailAccount={this.state.targetAccount}
                  color="primary"
                  createBlogAccount={this.props.createBlogAccount}
                  cancelAccount={this.handleCloseFormBlogNew}
                />
              </DialogContent>
            </Dialog>
          </GridItem>
        </GridContainer>
      </Loadable>
    );
  }
}

export default withStyles(accountListPageStyle)(MailAddressList);
