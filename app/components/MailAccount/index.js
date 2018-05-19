// @flow
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';

import { Button } from '../../ui';
import MailBox from './mailbox';
import MessageViewer from './messageViewer';
import type MailAccountType from '../../types/mailAccount';
import type { MailRowMessageType, MailBoxesType } from '../../types/mailMessageType';

/**
 * TODO:
 * 1. when open mailbox success, update last login date
 * 2. small list fond and narrow
 * 3. delete mails button
 * @type {number}
 */
const drawerWidth = 240;

const toolBarStyles = {
  minHeight: '48px',
  display: 'flex',
  justifyContent: 'space-between'
};
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '95vh',
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
    padding: '0 24px 24px',
    minWidth: 0 // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
  cardContentRight: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  buttonGroup: {
    position: 'relative',
    margin: '10px 1px',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  firstButton: {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    margin: '0',
    position: 'relative',
    float: 'left',
    '&:hover': {
      zIndex: '2'
    }
  },
  middleButton: {
    borderRadius: '0',
    margin: '0',
    position: 'relative',
    float: 'left',
    '&:hover': {
      zIndex: '2'
    }
  },
  lastButton: {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    margin: '0',
    '&:hover': {
      zIndex: '2'
    }
  }
});

type Props = {
  classes: Object,
  targetAccount: ?MailAccountType,
  startOpenConnection: account => void,
  startSelectImapMailBox: path => void,
  startDeleteImapMessage: uid => void,
  startUpdateFlags: flagUpdateArgs => void,
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
          <Toolbar style={toolBarStyles}>
            <Typography variant="title" color="inherit" noWrap>
              メールアドレス: {this.props.targetAccount.mailAddress}
            </Typography>
            <div className={classes.cardContentRight}>
              <div className={classes.buttonGroup}>
                <Button color="primarySub" customClass={classes.firstButton}>
                  既読に
                </Button>
                <Button color="primarySub" customClass={classes.middleButton}>
                  未読に
                </Button>
                <Button color="primarySub" customClass={classes.lastButton}>
                  ゴミ箱
                </Button>
              </div>
            </div>
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
            selectImapMailBoxPage={this.props.startSelectImapMailBox}
            deleteImapMessage={this.props.startDeleteImapMessage}
            updateFlags={this.props.startUpdateFlags}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(MailAccount);
