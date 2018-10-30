// @flow
import React from 'react';
import { ipcRenderer } from "electron";
import moment from "moment";

import { withStyles } from '@material-ui/core/styles';
import footerStyle from '../../assets/jss/material-dashboard-pro-react/components/footerStyle';

import type MailAccountType from "../../types/mailAccount";
import type BlogAccountType from "../../types/blogAccount";

type Props = {
  classes: Object,
  mailAccounts: Array<MailAccountType>,
  blogAccounts: Array<BlogAccountType>
};

class Footer extends React.Component<Props, State>{

  componentDidMount() {
    ipcRenderer.on('REQUEST_EXPORT_MAIL_ACCOUNT_JSON', () => {
      let jsonFile: string = '';
      if (this.props.mailAccounts.length > 0) {
        const mailAccounts = [];
        this.props.mailAccounts.forEach(acc => {
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
      ipcRenderer.send('REPLY_EXPORT_MAIL_ACCOUNT_JSON', jsonFile);
    });

    ipcRenderer.on('REQUEST_EXPORT_BLOG_ACCOUNT_JSON', () => {
      let jsonFile: string = '';
      if (this.props.blogAccounts.length > 0) {
        const blogAccounts = [];
        this.props.blogAccounts.forEach(acc => {
          const createDate = moment(acc.createDate).format();
          const accTimeToString = {
            ...acc,
            createDate
          };
          delete accTimeToString.key;
          blogAccounts.push(accTimeToString);
        });
        jsonFile = JSON.stringify(blogAccounts, undefined, 4);
      }
      ipcRenderer.send('REPLY_EXPORT_BLOG_ACCOUNT_JSON', jsonFile);
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('REQUEST_EXPORT_MAIL_ACCOUNT_JSON');
    ipcRenderer.removeAllListeners('REQUEST_EXPORT_BLOG_ACCOUNT_JSON');
  }

  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}/>
    );
  }
}

export default withStyles(footerStyle)(Footer);
