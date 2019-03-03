// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import Person from '@material-ui/icons/Person';
import Close from '@material-ui/icons/Close';
import CloudCircle from '@material-ui/icons/CloudCircle';

import PreferencesPage from '../../containers/PersonalInfo';
import GmailBaseSettings from '../../containers/AliasMailInfo/gmailBase';
import YandexBaseSettings from '../../containers/AliasMailInfo/yandexBase';
import CustomTabs from '../../ui/CustomTabs/CustomTabs';
import Button from '../../ui/CustomButtons/Button';
import { GmailIcon, YandexIcon } from '../../assets/icons';
import type AliasMailType from '../../types/aliasMailInfo';
import { initialAliasBase } from '../../containers/AliasMailInfo/reducer';

import MailAccount from '../../containers/MailAccount';
import type MailAccountType from '../../types/mailAccount';
import { initialMailAccount } from '../../containers/PersonalInfo/reducer';

import accountListPageStyle from '../../assets/jss/material-dashboard-pro-react/views/accountListPageStyle';

import Cpanels from "../../containers/Cpanel";

const adjTopMarginStyle = {
  marginTop: '-90px'
};

type Props = {
  classes: Object,
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  aliasMailInfo: Array<AliasMailType>,
  closeImapConnection: () => void
};

type State = {
  gmailBase: AliasMailType,
  yandexBase: AliasMailType,
  openImapMail: boolean,
  openImapAccount: MailAccountType
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class SettingsPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      gmailBase: initialAliasBase,
      yandexBase: initialAliasBase,
      openImapMail: false,
      openImapAccount: initialMailAccount
    };
  }

  componentDidMount() {
    let gmailBase = this.props.aliasMailInfo.find(alias => alias.provider === 'gmail');
    if (!gmailBase) {
      gmailBase = { ...initialAliasBase, provider: 'gmail' };
    }

    let yandexBase = this.props.aliasMailInfo.find(alias => alias.provider === 'yandex');
    if (!yandexBase) {
      yandexBase = { ...initialAliasBase, provider: 'yandex' };
    }
    this.setState({
      gmailBase,
      yandexBase
    });
  }

  componentWillReceiveProps = nextProps => {
    let gmailBase = nextProps.aliasMailInfo.find(alias => alias.provider === 'gmail');
    if (!gmailBase) {
      gmailBase = { ...initialAliasBase, provider: 'gmail' };
    }

    let yandexBase = nextProps.aliasMailInfo.find(alias => alias.provider === 'yandex');
    if (!yandexBase) {
      yandexBase = { ...initialAliasBase, provider: 'yandex', domain: '@yandex.com' };
    }
    this.setState({
      gmailBase,
      yandexBase
    });
  };

  handleOpenImapMailAccount = (targetAccount: MailAccountType) => {
    this.setState({
      openImapAccount: targetAccount,
      openImapMail: true
    });
  };

  handleCloseImapMailAccount = () => {
    this.setState({
      openImapAccount: initialMailAccount,
      openImapMail: false
    });
    this.props.closeImapConnection();
  };

  render() {
    const { classes } = this.props;

    return (
      <div style={adjTopMarginStyle}>
        <CustomTabs
          title="設定:"
          headerColor="primary"
          tabs={[
            {
              tabName: '既定の個人情報',
              tabIcon: Person,
              tabContent: <PreferencesPage />
            },
            {
              tabName: 'Gmail',
              tabIcon: GmailIcon,
              tabContent: (
                <GmailBaseSettings
                  isAliasLoading={this.props.isLoading}
                  isAliasFailure={this.props.isFailure}
                  errorMessageAlias={this.props.errorMessage}
                  gmailBase={this.state.gmailBase}
                  openImapMail={this.handleOpenImapMailAccount}
                />
              )
            },
            {
              tabName: 'Yandex',
              tabIcon: YandexIcon,
              tabContent: (
                <YandexBaseSettings
                  isAliasLoading={this.props.isLoading}
                  isAliasFailure={this.props.isFailure}
                  errorMessageAlias={this.props.errorMessage}
                  yandexBase={this.state.yandexBase}
                  openImapMail={this.handleOpenImapMailAccount}
                />
              )
            },
            {
              tabName: 'メール用ドメイン',
              tabIcon: CloudCircle,
              tabContent: (
                <Cpanels />
              )
            }
          ]}
        />
        <Dialog
          classes={{
            root: `${classes.center} ${classes.modalRoot}`,
            paper: classes.modal
          }}
          open={this.state.openImapMail}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="imapMail"
          aria-describedby="connect-imap-server"
        >
          <DialogTitle id="imapMailtitle" disableTypography className={classes.modalHeader}>
            <Button
              justIcon
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="transparent"
              onClick={() => this.handleCloseImapMailAccount()}
            >
              <Close className={classes.modalClose} />
            </Button>
          </DialogTitle>
          <DialogContent id="imapMailBody" className={classes.modalBody}>
            <MailAccount
              formStatus={this.state.openImapMail}
              targetAccount={this.state.openImapAccount}
              closeMailAccount={this.handleCloseImapMailAccount}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(accountListPageStyle)(SettingsPage);
