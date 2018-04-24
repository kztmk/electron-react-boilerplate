// @flow
import React from 'react';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withStyles } from 'material-ui/styles';
import Slide from 'material-ui/transitions/Slide';
import Tooltip from 'material-ui/Tooltip';
import Dialog from 'material-ui/Dialog';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';

import moment from 'moment';
import TagsInput from 'react-tagsinput';
import matchSorter from 'match-sorter';
// material-ui-icons
import Edit from 'material-ui-icons/Edit';
import DeleteForever from 'material-ui-icons/DeleteForever';
import LibraryAdd from 'material-ui-icons/LibraryAdd';
import Close from 'material-ui-icons/Close';

import { GridContainer, ItemGrid, IconButton } from '../../ui';
import type MailAccountType from '../../types/mailAccount';

import Yahoo from '../../asets/img/providerImage/y64.png';
import Excite from '../../asets/img/providerImage/excite64.png';
import Outlook from '../../asets/img/providerImage/outlook64.png';
import gmail from '../../asets/img/providerImage/gmail64.png';
import ownDomain from '../../asets/img/providerImage/domain64.png';

import { LoginIcon } from '../../asets/icons';
import FormMailAddressEdit from './formMailAddressEdit';
import accountListPageStyle from '../../asets/jss/material-dashboard-pro-react/views/accountListPageStyle';
import SweetAlertTitle from '../SweetAlertTitle';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

type State = {
  data: Array<Object>,
  sweetAlert: ?Object,
  mode: string,
  targetAccount: ?MailAccountType,
  openEditForm: boolean
};

type Props = {
  classes: Object,
  mailAccounts: Array<MailAccountType>,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  deleteAccount: () => void,
  editAccount: () => void
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
    case 'gmail':
      return gmail;
    case 'ownDomain':
      return ownDomain;
    default:
      return '';
  }
};

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
  float: 'right'
};

class MailAddressList extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      data: this.convertTableData(this.props.mailAccounts),
      targetAccount: initialMailAccount,
      sweetAlert: null,
      mode: 'none',
      openEditForm: false
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
    // 処理 deleteで更新されたのか？
    if (this.state.mode === 'delete') {
      if (!nextProps.isFailure) {
        // delete success
        this.setState({
          data: this.convertTableData(nextProps.mailAccounts),
          mode: 'none',
          sweetAlert: (
            <SweetAlert
              success
              style={{ display: 'block', marginTop: '-100px' }}
              title="削除完了"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
            >
              メールアドレス:{this.state.targetAccount.mailAddress}を削除しました。
            </SweetAlert>
          )
        });
      } else {
        // delete fail
        this.setState({
          mode: 'none',
          sweetAlert: (
            <SweetAlert
              error
              style={{ display: 'block', marginTop: '-100px' }}
              title="削除失敗"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnCssClass={`${this.props.classes.button} ${this.props.classes.success}`}
            >
              削除エラー:{nextProps.errorMessage}
            </SweetAlert>
          )
        });
      }
    } else {
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
          <Tooltip title="メールアカウントへログイン" placement="top-end">
            <IconButton
              onClick={() => {
                const obj = this.state.data.find(o => o.key === prop.key);
                alert(`you click:${obj.mailAddress}`);
              }}
              color="success"
            >
              <LoginIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="メールアカウント情報を表示・編集" placement="top-end">
            <IconButton
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
                  this.showEditForm(target);
                } else {
                  alert('編集対象のメールアカウントの取得に失敗しました。');
                }
              }}
              color="warning"
              customClass="actionButton actionButtonRound"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="メールアカウント情報を削除" placement="top-end">
            <IconButton
              onClick={() => {
                const account = this.state.data.find(o => o.key === prop.key);
                if (account) {
                  const target = {
                    ...account,
                    tags: '',
                    createDate: moment(account.createDate).valueOf(),
                    lastLogin: moment(account.lastLogin).valueOf()
                  };
                  this.handleDeleteMailAccount(target);
                } else {
                  alert('削除対象のメールアカウントの取得に失敗しました。');
                }
              }}
              color="danger"
              customClass="actionButton actionButtonRound"
            >
              <DeleteForever />
            </IconButton>
          </Tooltip>
          <Tooltip title="新規ブログを作成" placement="top-end">
            <IconButton
              onClick={() => {
                // const obj = this.state.data.find(o => o.key === prop.key);
              }}
              color="info"
              customClass="actionButton actionButtonRound"
            >
              <LibraryAdd />
            </IconButton>
          </Tooltip>
        </div>
      )
    }));

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

  showEditForm = account => {
    this.setState({
      targetAccount: account,
      openEditForm: true
    });
  };

  handleCloseModal = () => {
    this.setState({
      openEditForm: false
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <GridContainer>
        <ItemGrid xs={12} sm={12} md={12}>
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
                  <div>
                    <img height={24} src={getProviderImage(row.original.provider)} alt="" />
                  </div>
                ),
                width: 60,
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
                    <option value="Excite">Exciteメール</option>
                    <option value="Outlook">Outlook</option>
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
                    className={classes.toolTip}
                  >
                    <div>{row.original.accountId}</div>
                  </Tooltip>
                ),
                accessor: 'accountId',
                minWidth: 100,
                maxWidth: 140,
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
                width: 150,
                filterable: true,
                sortable: true,
                Filter: ({ filter, onChange }) => (
                  <input
                    type="text"
                    placeholder="YYYY/MM/DDより以前"
                    value={filter ? filter.value : ''}
                    onChange={event => onChange(event.target.value)}
                    style={{ fontSize: 12 }}
                  />
                ),
                filterMethod: (filter, row) => {
                  if (row[filter.id].length === 0) {
                    return row[filter.id];
                  } else if (moment(row[filter.id]) < moment(filter.value)) return row[filter.id];
                }
              },
              {
                Header: '',
                accessor: 'actions',
                sortable: false,
                filterable: false
              }
            ]}
            defaultPageSize={10}
            showPaginationTop
            showPaginationBotoom={false}
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
              paper: classes.modal
            }}
            maxWidth={false}
            open={this.state.openEditForm}
            transition={Transition}
            keepMounted
            onClose={() => this.handleCloseModal()}
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
            disableBackdropClick
          >
            <DialogTitle
              id="notice-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <IconButton
                style={modalCloseButtonStyle}
                key="close"
                aria-label="Close"
                color="defaultNoBackground"
                onClick={() => this.handleCloseModal()}
              >
                <Close className={classes.modalClose} />
              </IconButton>
            </DialogTitle>
            <DialogContent id="notice-modal-slide-description" className={classes.modalBody}>
              <FormMailAddressEdit
                isLoading={this.props.isLoading}
                errorMessage={this.props.errorMessage}
                closeModal={this.handleCloseModal}
                targetAccount={this.state.targetAccount}
                updateAccount={this.props.editAccount}
              />
            </DialogContent>
          </Dialog>
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(accountListPageStyle)(MailAddressList);
