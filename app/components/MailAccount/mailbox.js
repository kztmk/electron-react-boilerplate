/* eslint-disable react/no-unused-state,react/no-unused-prop-types */
// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import FolderIcon from '@material-ui/icons/Folder';

import SweetAlert from 'react-bootstrap-sweetalert';

import type MailAccountType from '../../types/mailAccount';
import type { MailBoxesType, MailRowMessageType } from '../../types/mailMessageType';

import baseMailBoxes from './defaultMailboxes';
import {
  primaryColor,
  grayColor,
  warningColor
} from '../../assets/jss/material-dashboard-pro-react';

type Props = {
  classes: Object,
  selectImapMailBox: path => void,
  imapMessageLoading: boolean,
  imapIsError: boolean,
  imapErrorMessage: string,
  targetAccount: ?MailAccountType,
  imapMailBoxes: Array<MailBoxesType>,
  imapMessages: Array<MailRowMessageType>,
  imapSelectMailBoxPath: string,
  imapMailCount: number,
  imapMailUnseenCount: number,
  imapSeqFrom: number
};

type State = {
  imapMailBoxes: Array<MailBoxesType>,
  imapMessages: Array<MailRowMessageType>,
  imapSelectMailBoxPath: string,
  mailCount: number,
  mailUnseenCount: number,
  seqFrom: number,
  alert: string,
  defaultMailBoxes: React.Element,
  otherMailBoxes?: React.Element
};

const styles = theme => ({
  selectedList: {
    backgroundColor: '#CE93D8'
  },
  badge: {
    fontSize: '0.6em'
  },
  outerList: {
    minHeight: '260px'
  },
  margin: {
    margin: theme.spacing.unit * 2
  },
  colorError: {},
  padding: {
    color: '#fff',
    backgroundColor: primaryColor,
    borderRadius: '10%',
    padding: `0 ${theme.spacing.unit * 2}px`
  },
  button: {
    minWidth: 'auto',
    minHeight: 'auto',
    backgroundColor: grayColor,
    color: '#FFFFFF',
    boxShadow:
      '0 2px 2px 0 rgba(153, 153, 153, 0.14), 0 3px 1px -2px rgba(153, 153, 153, 0.2), 0 1px 5px 0 rgba(153, 153, 153, 0.12)',
    border: 'none',
    borderRadius: '3px',
    position: 'relative',
    padding: '12px 30px',
    margin: '10px 1px',
    fontSize: '12px',
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: '0',
    willChange: 'box-shadow, transform',
    transition:
      'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '1.3',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    touchAction: 'manipulation',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: grayColor,
      color: '#FFFFFF',
      boxShadow:
        '0 14px 26px -12px rgba(153, 153, 153, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(153, 153, 153, 0.2)'
    }
  },
  warning: {
    backgroundColor: warningColor,
    boxShadow:
      '0 2px 2px 0 rgba(255, 152, 0, 0.14), 0 3px 1px -2px rgba(255, 152, 0, 0.2), 0 1px 5px 0 rgba(255, 152, 0, 0.12)',
    '&:hover': {
      backgroundColor: warningColor,
      boxShadow:
        '0 14px 26px -12px rgba(255, 152, 0, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(255, 152, 0, 0.2)'
    }
  }
});

const listItemStyles = {
  paddingTop: '6px',
  paddingBottom: '6px'
};

const itemIconStyles = {
  marginRight: '6px'
};

const listItemTextStyle = {
  lineHeight: '1.1em',
  fontSize: '1.0em',
  padding: '0 8px'
};

class MailBox extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      imapMailBoxes: this.props.imapMailBoxes,
      imapSelectMailBoxPath: this.props.imapSelectMailBoxPath,
      mailCount: this.props.imapMailCount,
      mailUnseenCount: this.props.imapMailUnseenCount,
      seqFrom: this.props.imapSeqFrom,
      alert: '',
      defaultMailBoxes: baseMailBoxes,
      otherMailBoxes: null
    };
  }

  /**
   * propsが更新された場合に、更新部分により描画する部分を作成
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    // select mailbox pathが更新(別なメールフォルダを選択)
    if (this.state.imapSelectMailBoxPath !== nextProps.imapSelectMailBoxPath) {
      const selectedBox = nextProps.imapMailBoxes.find(
        box => box.path === nextProps.imapSelectMailBoxPath
      );
      if (selectedBox) {
        console.log(`selectedBox:${selectedBox.name}`);
      } else {
        console.log(`selectBox: undefined`);
      }
      const defMailBox = this.generateMailBoxList(
        nextProps.imapMailBoxes,
        nextProps.imapSelectMailBoxPath,
        nextProps.imapMailCount,
        nextProps.imapMailUnseenCount
      );
      const otherBoxes = this.otherBoxes(
        nextProps.imapMailBoxes,
        nextProps.imapSelectMailBoxPath,
        nextProps.imapMailCount,
        nextProps.imapMailUnseenCount
      );
      console.log('finish otherboxes in willMount');
      this.setState({
        imapSelectMailBoxPath: nextProps.imapSelectMailBoxPath,
        mailCount: nextProps.imapMailCount,
        mailUnseenCount: nextProps.imapMailUnseenCount,
        seqFrom: nextProps.imapSeqFrom,
        defaultMailBoxes: defMailBox,
        otherMailBoxes: otherBoxes
      });
      console.log('done set state');
    }
    // imapIsErrorが更新(error occurred)
    if (nextProps.imapIsError) {
      this.showAlert(nextProps.imapErrorMessage);
    }
    // paging imapSeqFromが更新(次ページ、前ページ)
    if (
      this.state.imapSelectMailBoxPath === nextProps.imapSelectMailBoxPath &&
      this.state.seqFrom !== nextProps.imapSeqFrom
    ) {
      const selectedBox = nextProps.imapMailBoxes.find(
        box => box.path === nextProps.imapSelectMailBoxPath
      );
      if (selectedBox) {
        console.log(`selectedBox:${selectedBox.name}`);
      } else {
        console.log(`selectBox: undefined`);
      }
      const defMailBox = this.generateMailBoxList(
        nextProps.imapMailBoxes,
        nextProps.imapSelectMailBoxPath,
        nextProps.imapMailCount,
        nextProps.imapMailUnseenCount
      );
      const otherBoxes = this.otherBoxes(
        nextProps.imapMailBoxes,
        nextProps.imapSelectMailBoxPath,
        nextProps.imapMailCount,
        nextProps.imapMailUnseenCount
      );
      this.setState({
        mailCount: nextProps.imapMailCount,
        mailUnseenCount: nextProps.imapMailUnseenCount,
        seqFrom: nextProps.imapSeqFrom,
        defaultMailBoxes: defMailBox,
        otherMailBoxes: otherBoxes
      });
    }
    // 未読数、総メール数が変わった場合,
    if (
      this.state.mailCount !== nextProps.imapMailCount ||
      this.state.unseenCount !== nextProps.imapMailUnseenCount
    ) {
      const selectedBox = nextProps.imapMailBoxes.find(
        box => box.path === nextProps.imapSelectMailBoxPath
      );
      if (selectedBox) {
        console.log(`selectedBox:${selectedBox.name}`);
      } else {
        console.log(`selectBox: undefined`);
      }
      const defMailBox = this.generateMailBoxList(
        nextProps.imapMailBoxes,
        nextProps.imapSelectMailBoxPath,
        nextProps.imapMailCount,
        nextProps.imapMailUnseenCount
      );
      const otherBoxes = this.otherBoxes(
        nextProps.imapMailBoxes,
        nextProps.imapSelectMailBoxPath,
        nextProps.imapMailCount,
        nextProps.imapMailUnseenCount
      );
      this.setState({
        mailCount: nextProps.imapMailCount,
        mailUnseenCount: nextProps.imapMailUnseenCount,
        seqFrom: nextProps.imapSeqFrom,
        defaultMailBoxes: defMailBox,
        otherMailBoxes: otherBoxes
      });
    }
  };

  /**
   * 選択中のメールボックスに、ボックス内総メール数・未読数を表示
   * @param myBox
   * @param selectedPath
   * @param mailCount
   * @param unseenCount
   * @returns {*}
   */
  unseenCountBadge = (myBox, selectedPath, mailCount, unseenCount) => {
    const { classes } = this.props;
    if (myBox) {
      if (selectedPath === myBox.path) {
        if (unseenCount > 0) {
          return (
            <Badge className={classes.padding} color="secondary" badgeContent={unseenCount}>
              ({mailCount})
            </Badge>
          );
        }
        return (
          <Typography className={classes.padding} color="default">
            ({mailCount})
          </Typography>
        );
      }
    }
  };

  /**
   * 別なメールボックスを選択し、そのメールボックスのメールを取得
   * @param boxPath
   */
  handleSelectBox = boxPath => {
    this.props.selectImapMailBox({ path: boxPath, seqFrom: 0 });
  };

  /**
   * メールボックスが選択状態かを判定
   *
   * メールボックス描画の際に、選択されたメールボックスに
   * 指定のスタイルを適用するため
   * @param box
   * @param selectedPath
   * @returns {boolean}
   */
  isSelected = (box, selectedPath) => box.path === selectedPath;

  /**
   * child mailboxを描画
   * TODO: test
   * @param mailBox
   * @param selectedPath
   * @param mailCount
   * @param unseenCount
   * @returns {*}
   */
  renderChild = (mailBox, selectedPath, mailCount, unseenCount) => {
    if (mailBox === null || undefined) return;
    let renderedChildren = null;
    if ('children' in mailBox) {
      const childBoxes = mailBox.children;
      if (childBoxes) {
        renderedChildren = childBoxes.map(childBox => {
          if ('children' in childBox) {
            return (
              <List key={childBox.path}>
                <ListItem
                  button
                  onClick={() => {
                    this.handleSelectBox(childBox.path);
                  }}
                  style={listItemStyles}
                >
                  <ListItemIcon style={itemIconStyles}>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={childBox.name} style={listItemTextStyle} />
                  {this.unseenCountBadge(childBox, selectedPath, mailCount, unseenCount)}
                </ListItem>
                {this.renderChild(childBox, selectedPath, mailCount, unseenCount)}
              </List>
            );
          }
          return (
            <ListItem
              button
              onClick={() => {
                this.handleSelectBox(childBox.path);
              }}
              style={listItemStyles}
            >
              <ListItemIcon style={itemIconStyles}>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={childBox.name} style={listItemTextStyle} />
              {this.unseenCountBadge(childBox, selectedPath, mailCount, unseenCount)}
            </ListItem>
          );
        });
      }
    }
    return renderedChildren;
  };

  /**
   * 既定メールボックス以外のメールボックスの描画
   *
   * @param boxes mailAccountが持つmailbox全て
   * @param selectedPath 現在、選択中のmailbox default inbox
   * @param mailCount mailAccountの総メール数
   * @param unseenCount 選択中のメールボックスの未読数
   * @returns {*}
   */
  otherBoxes = (boxes, selectedPath, mailCount, unseenCount) => {
    console.log('start other');
    if (boxes.length > 0) {
      // const otherboxes = [];
      let otherboxes = [];
      // eslint-disable-next-line array-callback-return
      otherboxes = boxes.filter(box => {
        if (
          box.name.toLowerCase() !== 'bulk mail' &&
          box.name.toLowerCase() !== 'draft' &&
          box.name.toLowerCase() !== 'inbox' &&
          box.name.toLowerCase() !== 'sent' &&
          box.name.toLowerCase() !== 'trash' &&
          box.name.toLowerCase() !== 'deleted' &&
          box.name.toLowerCase() !== 'drafts' &&
          box.name.toLowerCase() !== 'junk' &&
          box.name.toLowerCase() !== 'spam' &&
          box.name.toLowerCase() !== 'all' &&
          box.name !== 'すべてのメール' &&
          box.name !== 'ゴミ箱' &&
          box.name !== '下書き' &&
          box.name !== '迷惑メール' &&
          box.name !== '送信済みメール'
        ) {
          return box;
        }
      });
      console.log(`other boxes count:${otherboxes.length}`);

      if (otherboxes.length > 0) {
        console.log('start render other boxes');
        return otherboxes.map(box => (
          <div key={box.path}>
            <ListItem
              button
              onClick={() => {
                this.handleSelectBox(box.path);
              }}
              style={listItemStyles}
            >
              <ListItemIcon style={itemIconStyles}>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={box.name} style={listItemTextStyle} />
              {this.unseenCountBadge(box, selectedPath, mailCount, unseenCount)}
            </ListItem>
            {this.renderChild(box, selectedPath, mailCount, unseenCount)}
          </div>
        ));
      }
      return <ListItem />;
    }
  };

  /**
   * 既定のメールボックスの描画
   *
   * @param boxes mailAccountが持つmailbox全て
   * @param selectedPath 現在、選択中のmailbox default inbox
   * @param mailCount mailAccountの総メール数
   * @param unseenCount 選択中のメールボックスの未読数
   * @returns {*}
   */
  generateMailBoxList = (boxes, selectedPath, mailCount, unseenCount) => {
    const { classes } = this.props;
    if (boxes.length > 0) {
      // mailbox collectionをdefault以外で作成
      let bulkMail = null;
      let sent = null;
      let draft = null;
      let inbox = null;
      let trash = null;

      boxes.forEach(box => {
        const boxName = box.name.toLowerCase();
        switch (boxName) {
          case 'bulk mail':
          case 'junk':
          case 'spam':
          case '迷惑メール':
            bulkMail = box;
            break;
          case 'draft':
          case 'drafts':
          case '下書き':
            draft = box;
            break;
          case 'inbox':
          case 'all':
          case 'すべてのメール':
            inbox = box;
            break;
          case 'sent':
          case '送信済みメール':
            sent = box;
            break;
          case 'trash':
          case 'deleted':
          case 'ゴミ箱':
            trash = box;
            break;
          default:
        }
      });

      const defaultMailBoxes = (
        <div key="d-default">
          <ListItem
            button
            onClick={() => {
              this.handleSelectBox(inbox.path);
            }}
            // className={this.isSelected(inbox, selectedPath) ? classes.selectedList : ''}
            className={
              inbox.path.toLowerCase() === selectedPath.toLowerCase() ? classes.selectedList : ''
            }
            style={listItemStyles}
          >
            <ListItemIcon style={itemIconStyles}>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="受信箱" style={listItemTextStyle} />
            {this.unseenCountBadge(inbox, selectedPath, mailCount, unseenCount)}
          </ListItem>
          <List key={inbox.path}>
            {this.renderChild(inbox, selectedPath, mailCount, unseenCount)}
          </List>
          <ListItem
            button
            onClick={() => {
              this.handleSelectBox(sent.path);
            }}
            className={
              sent.path.toLowerCase() === selectedPath.toLowerCase() ? classes.selectedList : ''
            }
            style={listItemStyles}
          >
            <ListItemIcon style={itemIconStyles}>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="送信済" style={listItemTextStyle} />
            {this.unseenCountBadge(sent, selectedPath, mailCount, unseenCount)}
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.handleSelectBox(draft.path);
            }}
            className={
              draft.path.toLowerCase() === selectedPath.toLowerCase() ? classes.selectedList : ''
            }
            style={listItemStyles}
          >
            <ListItemIcon style={itemIconStyles}>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="下書き" style={listItemTextStyle} />
            {this.unseenCountBadge(draft, selectedPath, mailCount, unseenCount)}
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.handleSelectBox(trash.path);
            }}
            className={
              trash.path.toLowerCase() === selectedPath.toLowerCase() ? classes.selectedList : ''
            }
            style={listItemStyles}
          >
            <ListItemIcon style={itemIconStyles}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="ゴミ箱" style={listItemTextStyle} />
            {this.unseenCountBadge(trash, selectedPath, mailCount, unseenCount)}
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.handleSelectBox(bulkMail.path);
            }}
            className={
              bulkMail.path.toLowerCase() === selectedPath.toLowerCase() ? classes.selectedList : ''
            }
            style={listItemStyles}
          >
            <ListItemIcon style={itemIconStyles}>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="迷惑メール" style={listItemTextStyle} />
            {this.unseenCountBadge(bulkMail, selectedPath, mailCount, unseenCount)}
          </ListItem>
        </div>
      );

      return defaultMailBoxes;
    }
  };

  /**
   * エラーダイアログの表示
   * @param message
   */
  showAlert = message => {
    const { classes } = this.props;
    this.setState({
      alert: (
        <SweetAlert
          style={{ display: 'block', marginTop: '-100px' }}
          title="エラー発生"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={`${classes.button} ${classes.warning}`}
        >
          {message}
        </SweetAlert>
      )
    });
  };

  /**
   * エラーダイアログを非表示に
   */
  hideAlert = () => {
    this.setState({ alert: '' });
  };

  /**
   * 描画
   * @returns {*}
   */
  render() {
    const { classes } = this.props;
    return (
      <div>
        <List key="defaultBoxes" className={classes.outerList}>
          {this.state.defaultMailBoxes}
        </List>
        <Divider />
        <List key="personalBoxes">{this.state.otherMailBoxes}</List>
        {this.state.alert}
      </div>
    );
  }
}

export default withStyles(styles)(MailBox);
