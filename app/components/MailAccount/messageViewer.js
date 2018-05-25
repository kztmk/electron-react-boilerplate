/* eslint-disable no-prototype-builtins,function-paren-newline */
// @flow
import React, { Component } from 'react';
import ReactTable from 'react-table';

import moment from 'moment';
import { withStyles } from 'material-ui/styles';
import Checkbox from 'material-ui/Checkbox';
import Check from 'material-ui-icons/Check';
import matchSorter from 'match-sorter';

import ReactPaginate from 'react-paginate';
import { GridContainer, ItemGrid, FullHeaderCard } from '../../ui';
import text2Html from '../../utils/text2html';

import type { ImapFlagsArgsType, MailRowMessageType } from '../../types/mailMessageType';
import { primaryColor } from '../../asets/jss/material-dashboard-pro-react';

// eslint-disable-next-line prefer-destructuring
const MailParser = require('mailparser-mit').MailParser;

const checkBoxStyle = {
  root: {
    height: '24px'
  }
};

const styles = {
  icon: {
    verticalAlign: 'middle',
    width: '17px',
    height: '17px',
    top: '-1px',
    position: 'relative'
  },
  checked: {
    color: primaryColor
  },
  checkedIcon: {
    width: '14px',
    height: '14px',
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '3px'
  },
  uncheckedIcon: {
    width: '0px',
    height: '0px',
    padding: '9px',
    border: '1px solid rgba(0, 0, 0, .54)',
    borderRadius: '3px'
  }
};

type Props = {
  classes: Object,
  selectImapMailBoxPage: () => void,
  //  deleteImapMessage: ImapFlagsArgsType => void,
  updateFlags: ImapFlagsArgsType => void,
  startUpdateFlags: string,
  startMoveMails: string,
  handleUpdateFlags: () => void,
  handleMoveTo: () => void,
  imapMessages: Array<MailRowMessageType>,
  imapSelectMailBoxPath: string,
  imapMailCount: number,
  imapSeqFrom: number
};

type State = {
  boxPath: string,
  seqFrom: number,
  mailCount: number,
  messages: Array<MailRowMessageType>,
  checked: Array<number>,
  checkedAll: number,
  data: Array<Object>,
  displaySubject: string,
  displaySubtitle: string,
  displayMessage: string,
  currentPage: number
};

/**
 * mailbox内のmail一覧、選択したmail内容を表示するcomponent
 *
 */
class MessageViewer extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      boxPath: this.props.imapSelectMailBoxPath,
      data: this.convertTableData(this.props.imapMessages),
      messages: this.props.imapMessages,
      seqFrom: this.props.imapSeqFrom,
      mailCount: this.props.imapMailCount,
      checked: [],
      checkedAll: 0,
      displaySubject: '',
      displaySubtitle: '',
      displayMessage: ''
    };
  }

  /**
   * propsが更新された場合の処理
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    // page更新 or path更新
    console.log(`now-seq:${this.state.seqFrom}-path:${this.state.boxPath}`);
    console.log(`new-seq:${nextProps.imapSeqFrom}-path:${nextProps.imapSelectMailBoxPath}`);
    // select mailbox path or paging change
    if (
      this.state.seqFrom !== nextProps.imapSeqFrom ||
      this.state.boxPath !== nextProps.imapSelectMailBoxPath
    ) {
      console.log('write - table');
      this.setState({
        checked: [],
        data: this.convertTableData(nextProps.imapMessages),
        messages: nextProps.imapMessages,
        seqFrom: nextProps.imapSeqFrom,
        mailCount: nextProps.imapMailCount,
        boxPath: nextProps.imapSelectMailBoxPath,
        checkedAll: 0,
        displaySubject: '',
        displaySubtitle: '',
        displayMessage: ''
      });
    }

    // flagのみ変更
    if (
      this.state.messages !== nextProps.imapMessages &&
      this.state.mailCount === nextProps.imapMailCount
    ) {
      this.setState({
        checked: [],
        checkedAll: 0,
        data: this.convertTableData(nextProps.imapMessages),
        messages: nextProps.imapMessages
      });
    }

    // 親コンポーネントからflag更新指示
    if (nextProps.startUpdateFlags !== '') {
      // check内のuidがtrueのもののflagを更新
      const updateUids = [];
      Object.keys(this.state.checked).forEach(m => {
        if (this.state.checked[m]) {
          updateUids.push(parseInt(m, 10));
        }
      });

      this.props.handleUpdateFlags(updateUids);
    }

    // 親コンポーネントからmailBox移動の指示
    if (nextProps.startMoveMails !== '') {
      const moveUids = [];
      Object.keys(this.state.checked).forEach(m => {
        if (this.state.checked[m]) {
          moveUids.push(parseInt(m, 10));
        }
      });

      this.props.handleMoveTo(moveUids);
    }
  };

  /**
   * mail送信元オブジェクトを文字列化する
   * @param senders
   * @returns {string}
   */
  getSender = senders => {
    let addressFormat = '';
    if (senders.length > 0) {
      const arraySenders = senders.map(sender => `${sender.name}<${sender.address}>`);
      addressFormat = arraySenders.join(',');
    }
    return addressFormat;
  };

  /**
   * mailbox内のmailを一覧表示するために、変換
   * @param messages
   * @returns {*}
   */
  convertTableData = messages =>
    messages.map(msg => ({
      uid: msg.uid,
      flags: msg.flags.join(','),
      subject: msg.subject,
      date: moment(msg.date).format('YYYY/MM/DD HH:mm'),
      from: this.getSender(msg.from)
    }));

  /**
   * チェックボックスのClickにて、チェック状態を変化させる
   * @param uid
   */
  handleToggleCheckBox(uid) {
    // 現在のstateをコピー
    let check = { ...this.state.checked };
    // clickされたuidをkeyにし、チェック状態を
    // ----> keyがない場合には、新規にtrueで作成
    // ----> keyがある場合、falseに
    check[uid] = !this.state.checked[uid];
    // 全選択checkboxを中に
    let allClearCheck = 2;

    // 全選択checkboxと連動するために
    // 現在のcheck内が全てtrue且つmessage数と同じ->全選択状態
    // 現在のcheck内が全てfalseの場合->選択状態ナシ
    let trueCount = 0;
    let falseCount = 0;
    if (Object.keys(check).length > 0) {
      Object.keys(check).forEach(m => {
        if (check[m]) {
          trueCount += 1;
        } else {
          falseCount += 1;
        }
      });
    }

    // 全選択状態
    if (trueCount === Object.keys(this.state.messages).length) {
      allClearCheck = 1;
    }

    // 全非選択状態
    if (falseCount === Object.keys(check).length) {
      allClearCheck = 0;
      check = [];
    }

    this.setState({
      checked: check,
      checkedAll: allClearCheck
    });
  }

  /**
   * 全選択・全解除ボタンClick
   *
   */
  handleToggleCheckBoxAll() {
    const checkAll = {};

    if (this.state.checkedAll === 0) {
      this.state.messages.forEach(x => {
        checkAll[x.uid] = true;
      });
    }

    this.setState({
      checked: checkAll,
      checkedAll: this.state.checkedAll === 0 ? 1 : 0
    });
  }

  /**
   * メッセージの未読・既読の判断
   * @param uid
   * @returns {boolean}
   */
  isSeenMessage = uid => {
    let result = false;
    const message = this.state.messages.find(m => m.uid === uid);

    if (message !== undefined) {
      const seen = message.flags.find(f => f.toLowerCase() === '\\seen');
      if (seen !== undefined) {
        result = true;
      }
    }

    return result;
  };

  /**
   * paginationをclickしたときに、該当ページのmailを取得
   * @param data
   */
  handlePageClick = data => {
    const selectedPage = data.selected;
    let newPageTopSeq = 1;
    if (selectedPage > 0) {
      newPageTopSeq = 25 * selectedPage;
    }
    const newSeqFrom = this.state.mailCount - newPageTopSeq;
    this.props.selectImapMailBoxPage({ path: this.state.boxPath, seqFrom: newSeqFrom });
  };

  /**
   * メール一覧グリッドのsubjectのclickで、メール内容を表示する
   *
   * @param messageUid
   */
  showMessage = messageUid => {
    // find message in messages
    const message = this.state.messages.find(m => m.uid === messageUid);

    if (message !== undefined) {
      const mailparser = new MailParser();
      mailparser.end(message.mime.raw);
      mailparser.on('end', mail => {
        let mailBody = '';
        if (!mail.hasOwnProperty('html')) {
          if (mail.hasOwnProperty('text')) {
            mailBody = text2Html(mail.text);
          }
        } else {
          mailBody = mail.html;
          // inlineでのcontentIdをhtml内から取得する。
          const reg = /src="cid:(.*?)"/gi;
          let result;

          const inlineFiles = [];
          // 上記正規表現でnullが返るまで繰り返し
          // eslint-disable-next-line no-cond-assign
          while ((result = reg.exec(mailBody)) !== null) {
            // 取得したcid
            let fileName = result[0];
            // contentId名に整形
            if (fileName.endsWith('"')) {
              fileName = fileName.slice(0, -1);
              fileName = fileName.replace('src="cid:', '');
            }

            // attachment.contentId名で、該当コンテンツを取得
            const attachment = mail.attachments.find(attach => attach.contentId === fileName);
            // コンテンツが見つかった場合
            if (attachment) {
              // コンテンツの位置がinline
              if (attachment.contentDisposition === 'inline') {
                // base64で復号化
                const base64 = attachment.content.toString('base64');
                const type = attachment.contentType;
                // 正規表現キャプチャで元htmlが消えているため、key: contentID, value: 置き換えコンテンツを作成
                inlineFiles[`src="cid:${fileName}"`] = `src="data:${type};base64,${base64}" `;
              }
            }
          }
          // 置換用オブジェクトで元htmlのsrc="cid:xxx"を置換
          // eslint-disable-next-line guard-for-in,no-restricted-syntax
          for (const key in inlineFiles) {
            console.log(`replace:${key}`);
            mailBody = mailBody.replace(key, inlineFiles[key]);
          }
        }

        this.setState({
          displaySubject: message.subject,
          displaySubtitle: `送信元:${this.getSender(message.from)}    受信日時:${moment(
            message.date
          ).format('YYYY/MM/DD HH:mm')}`,
          displayMessage: mailBody
        });

        // flagsに[\\seen]がない場合には、[\\seen]を追加
        if (!message.flags.some(f => f.toLowerCase() === '\\seen')) {
          const sequences = [];
          sequences.push(message.uid);
          this.props.updateFlags({
            path: this.state.boxPath,
            sequences,
            seqFrom: this.state.seqFrom,
            flagUpdateObject: { add: ['\\Seen'] },
            moveDestination: ''
          });
        }
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <ItemGrid xs={12} sm={12} md={12}>
          {this.state.mailCount > 25 && (
            <ReactPaginate
              previousLabel="前25件"
              nextLabel="次25件"
              breakLabel="..."
              breakClassName="Pagination-paginationLink"
              pageCount={Math.ceil(this.state.mailCount / 25)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={this.handlePageClick}
              containerClassName="Pagination-pagination"
              pageClassName="Pagination-paginationItem"
              pageLinkClassName="Pagination-paginationLink"
              activeClassName="Pagination-primary"
              disabledClassName="Pagination-disabled"
              nextClassName="Pagination-paginationItem"
              nextLinkClassName="Pagination-paginationLink"
              previousClassName="Pagination-paginationItem"
              previousLinkClassName="Pagination-paginationLink"
            />
          )}
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={12}>
          <ReactTable
            data={this.state.data}
            showPagination={false}
            resizable
            filterable
            columns={[
              {
                id: 'checkbox',
                accessor: '',
                Cell: ({ original }) => (
                  <Checkbox
                    tabIndex={-1}
                    checked={this.state.checked[original.uid] === true}
                    onClick={() => this.handleToggleCheckBox(original.uid)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked
                    }}
                    style={checkBoxStyle.root}
                  />
                ),
                Header: () => (
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={this.state.checkedAll === 1}
                    ref={input => {
                      if (input) {
                        // eslint-disable-next-line no-param-reassign
                        input.indeterminate = this.state.checkedAll === 2;
                      }
                    }}
                    onChange={() => this.handleToggleCheckBoxAll()}
                  />
                ),
                sortable: false,
                width: 45
              },
              {
                Header: () => <span style={{ fontSize: 12 }}>件名</span>,
                accessor: 'subject',
                // eslint-disable-next-line no-confusing-arrow
                Cell: row =>
                  this.isSeenMessage(row.original.uid) ? (
                    <span style={{ fontSize: 12 }}>{row.original.subject}</span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 'bold' }}>{row.original.subject}</span>
                  ),
                minWidth: 200,
                filterable: true,
                sortable: false,
                className: 'rtMailSubject',
                Filter: ({ filter, onChange }) => (
                  <input
                    type="text"
                    placeholder="件名で絞込み"
                    value={filter ? filter.value : ''}
                    onChange={event => onChange(event.target.value)}
                    style={{ fontSize: 12 }}
                  />
                ),
                filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ['subject'] }),
                filterAll: true
              },
              {
                Header: () => <span style={{ fontSize: 12 }}>送信元</span>,
                accessor: 'from',
                sortable: true,
                filterable: true,
                Filter: ({ filter, onChange }) => (
                  <input
                    type="text"
                    placeholder="送信元で絞込み"
                    value={filter ? filter.value : ''}
                    onChange={event => onChange(event.target.value)}
                    style={{ fontSize: 12 }}
                  />
                ),
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['from'] }),
                filterAll: true
              },
              {
                Header: () => <span style={{ fontSize: 12 }}>受信日時</span>,
                accessor: 'date',
                sortable: true,
                filterable: true,
                Filter: ({ filter, onChange }) => (
                  <input
                    type="text"
                    placeholder="受信日時で絞込み"
                    value={filter ? filter.value : ''}
                    onChange={event => onChange(event.target.value)}
                    style={{ fontSize: 12 }}
                  />
                ),
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['date'] }),
                filterAll: true
              },
              {
                Header: 'uid',
                accessor: 'uid',
                filterable: false,
                sortable: false,
                show: false
              }
            ]}
            className="-striped -highlight"
            loadingText="読込中..."
            noDataText="このフォルダにはメールがありません。"
            style={{
              height: '200px', // This will force the table body to overflow and scroll, since there is not enough room
              fontSize: '12px',
              lineHeight: '1.1em'
            }}
            getTdProps={(state, rowInfo, column) => ({
              onClick: (e, handleOriginal) => {
                // this.showMessage(rowInfo.original.uid);
                if (column.id !== 'checkbox') {
                  this.showMessage(rowInfo.original.uid);
                }
                if (handleOriginal) {
                  handleOriginal();
                }
              }
            })}
          />
        </ItemGrid>
        <ItemGrid>
          <FullHeaderCard
            cardTitle={this.state.displaySubject}
            headerColor="rose"
            cardSubtitle={this.state.displaySubtitle}
            content={<div dangerouslySetInnerHTML={{ __html: this.state.displayMessage }} />}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(MessageViewer);
