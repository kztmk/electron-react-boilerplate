// @flow
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';

import MailBox from './mailbox';
import MessageViewer from './messageViewer';
import type MailAccountType from '../../types/mailAccount';
import type { MailRowMessageType, MailBoxesType } from '../../types/mailMessageType';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '80vh',
    zIndex: 1,
    overflow: 'auto',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0 // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar
});

type Props = {
  classes: Object,
  targetAccount: ?MailAccountType,
  startOpenConnection: account => void,
  startSelectImapMailBox: path => void,
  startDeleteImapMessage: uid => void,
  imapMessageLoading: boolean,
  imapIsError: boolean,
  imapErrorMessage: string,
  imapMailBoxes: Array<MailBoxesType>,
  imapMessages: Array<MailRowMessageType>,
  imapSelectMailBoxPath: string,
  imapMailCount: number,
  imapMailUnseenCount: number,
  imapSeqFrom: number
};

type State = {
  isLoading: boolean,
  selectMailBoxPath: string,
  targetAccount: MailAccountType
};

class MailAccount extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: this.props.errorMessage,
      mailBoxes: this.props.mailBoxes,
      selectMailBox: this.props.selectMailBox,
      messages: this.props.messages
    };
  }

  componentWillReceiveProps = nextProps => {
    console.log(`mailAccount-isLoading:${nextProps.imapMessageLoading}`);
    // 新たなmailAddressが指定され、モードが無指定の場合、openConnection
    if (this.props.targetAccount.mailAddress !== nextProps.targetAccount.mailAddress) {
      // targetAccountのmailAddressが更新され、且つ、長さがある場合
      if (nextProps.targetAccount.mailAddress.length > 0) {
        console.log('call imap connection ...');
        console.log(`targetAccout:${this.props.targetAccount.provider}`);
        this.props.startOpenConnection(nextProps.targetAccount);
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              メールアドレス: {this.props.targetAccount.mailAddress}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <MailBox
              imapMessageLoading={this.props.imapMessageLoading}
              imapIsError={this.props.imapIsError}
              imapErrorMessage={this.props.imapErrorMessage}
              targetAccount={this.props.targetAccount}
              imapMailBoxes={this.props.imapMailBoxes}
              imapMessages={this.props.imapMessages}
              imapSelectMailBoxPath={this.props.imapSelectMailBoxPath}
              imapMailCount={this.props.imapMailCount}
              imapMailUnseenCount={this.props.imapMailUnseenCount}
              imapSeqFrom={this.props.imapSeqFrom}
              selectImapMailBox={this.props.startSelectImapMailBox}
            />
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <MessageViewer
            imapMessages={this.props.imapMessages}
            imapSelectMailBoxPath={this.props.imapSelectMailBoxPath}
            imapSeqFrom={this.props.imapSeqFrom}
            imapMailCount={this.props.imapMailCount}
            deleteImapMessage={this.props.startDeleteImapMessage}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(MailAccount);
