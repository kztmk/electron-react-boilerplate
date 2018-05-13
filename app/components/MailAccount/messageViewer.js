// @flow
import React, { Component } from 'react';
import ReactTable from 'react-table';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { withStyles } from 'material-ui/styles';
import Checkbox from 'material-ui/Checkbox';
import Check from 'material-ui-icons/Check';
import matchSorter from 'match-sorter';

import { GridContainer, ItemGrid, Button } from '../../ui';

import type { MailRowMessageType } from '../../types/mailMessageType';
import { primaryColor } from '../../asets/jss/material-dashboard-pro-react';

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
    width: '20px',
    height: '20px',
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
      checkedAll: 0
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
    let clearCheck = false;
    let allClearCheck = 2;

    if (check.length > 0) {
      for (const key in check) {
        if (check[key]) {
          clearCheck = true;
        }
      }

      if (!clearCheck) {
        check = [];
        allClearCheck = 0;
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

  handlePageClick = data => {
    const selected = data.selected;
    alert(`you clicled ${selected}`);
  };
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <ItemGrid>
          {this.state.mailCount > 25 && (
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={<a href="">...</a>}
              breakClassName="break-me"
              pageCount={Math.ceil(this.state.mailCount / 25)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={this.handlePageClick}
              containerClassName="react-paginate"
              subContainerClassName="pages pagination"
              activeClassName="active"
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
                    onClick={() => this.handleToggleCheckBox(original.uid)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked
                    }}
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
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(MessageViewer);
