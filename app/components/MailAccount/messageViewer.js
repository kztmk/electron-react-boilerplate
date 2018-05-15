// @flow
import React, { Component } from 'react';
import ReactTable from 'react-table';

import moment from 'moment';
import { withStyles } from 'material-ui/styles';
import Checkbox from 'material-ui/Checkbox';
import Check from 'material-ui-icons/Check';
import matchSorter from 'match-sorter';

import ReactPaginate from 'react-paginate';
import { GridContainer, ItemGrid, Button, FullHeaderCard } from '../../ui';

import type { MailRowMessageType } from '../../types/mailMessageType';
import { primaryColor } from '../../asets/jss/material-dashboard-pro-react';

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
  deleteImapMessage: uid => void,
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
  data: Array<Object>
};

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
      decodedMessages: []
    };
  }

  componentWillReceiveProps = nextProps => {
    // page更新 or path更新
    console.log(`now-seq:${this.state.seqFrom}-path:${this.state.boxPath}`);
    console.log(`new-seq:${nextProps.imapSeqFrom}-path:${nextProps.imapSelectMailBoxPath}`);
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
        checkedAll: 0
      });
    }
  };

  getSender = senders => {
    let addressFormat = '';
    if (senders.length > 0) {
      const arraySenders = senders.map(sender => `${sender.name}<${sender.address}>`);
      addressFormat = arraySenders.join(',');
    }
    return addressFormat;
  };

  convertTableData = messages =>
    messages.map(msg => ({
      uid: msg.uid,
      flags: msg.flags.join(','),
      subject: msg.subject,
      date: moment(msg.date).format('YYYY/MM/DD HH:mm'),
      from: this.getSender(msg.from)
    }));

  handleToggleCheckBox(uid) {
    let check = { ...this.state.checked };
    check[uid] = !this.state.checked[uid];
    let allClearCheck = 2;

    console.log(`check.length:${check.length !== null}`);
    console.log(`check-length:${check.length}`);
    if (check.length !== null && check.length > 0) {
      let trueCount = 0;
      let falseCount = 0;
      if (check.length > 0) {
        check.forEach(value => {
          if (value) {
            trueCount += 1;
          } else {
            falseCount += 1;
          }
        });
      }
      console.log(`true:${trueCount}`);
      console.log(`false:${falseCount}`);

      if (trueCount === check.length) {
        allClearCheck = 1;
        check = [];
        console.log('all clear');
      }

      if (falseCount === check.length) {
        allClearCheck = 0;
        console.log('all checked');
      }
    }

    this.setState({
      checked: check,
      checkedAll: allClearCheck
    });
  }

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

  handlePageClick = data => {
    const selected = data.selected;
    alert(`you clicled ${selected}`);
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
              breakLabel={<a href="">...</a>}
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
                Header: x => (
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={this.state.checkedAll === 1}
                    ref={input => {
                      if (input) {
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
                Cell: row =>
                  this.isSeenMessage(row.original.uid) ? (
                    <span style={{ fontSize: 12 }}>{row.original.subject}</span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 'bold' }}>{row.original.subject}</span>
                  ),
                minWidth: 200,
                filterable: true,
                sortable: false,
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
            className="-striped-highlight"
            loadingText="読込中..."
            noDataText="このフォルダにはメールがありません。"
            style={{
              height: '200px', // This will force the table body to overflow and scroll, since there is not enough room
              fontSize: '12px',
              lineHeight: '1.1em'
            }}
            getTdProps={(state, rowInfo, column) => {
              return {
                onClick: (e, handleOriginal) => {
                  // this.showMessage(rowInfo.original.uid);
                  if (column.id !== 'checkbox') {
                    console.log(rowInfo.original.uid);
                  }
                  if (handleOriginal) {
                    handleOriginal();
                  }
                }
              };
            }}
          />
        </ItemGrid>
        <ItemGrid>
          <FullHeaderCard
            cardTitle={this.state.subject}
            headerColor="rose"
            cardSubTitle={`送信元:${this.state.from}    受信日時:${this.state.date}`}
            content={this.state.html}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(MessageViewer);
