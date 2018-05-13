import ImapClient from 'emailjs-imap-client';
import type { MailBoxType } from '../../types/mailMessageType';

const { MailParser } = require('mailparser-iconv-full').MailParser;

class ImapManager {
  constructor(serverConfig) {
    this.imapClient = new ImapClient(serverConfig);

    console.log(`imapServer:${serverConfig[0]}`);
    console.log(`imapPort:${serverConfig[0]}`);
    // this.mailParser = new MailParser();

    this.mailBox = {
      mailBoxes: null,
      messages: [],
      selectedMailBox: null,
      selectedMailBoxPath: '',
      mailCount: 0,
      seqFrom: 1
    };
  }

  connect = () => {
    this.imapClient.connect().then(() => {
      this.imapClient.listMailboxes().then(mailboxes => {
        this.mailBox.mailBoxes = mailboxes.children;
        this.selectMailbox('INBOX');
      });
    });
  };

  selectMailbox = (selectedMailbox: MailBoxType) => {
    this.mailBox.selectedMailBox = selectedMailbox;
    this.mailBox.selectedMailBoxPath = selectedMailbox.path;

    this.imapClient.listMailboxes(selectedMailbox.path).then(mailbox => {
      this.mailBox.mailCount = mailbox.exists;
      this.mailBox.messages = [];

      if (!selectedMailbox.messages.length) {
        this.pullMessages();
      }
    });
  };

  pullMessages = () => {
    const seqFrom = this.mailBox.selectedMailBox.messages.length + 1;
    let seqTo = seqFrom + 24;

    seqTo =
      seqTo <= this.mailBox.selectedMailBox.exists ? seqTo : this.mailBox.selectedMailBox.exists;

    if (seqFrom > seqTo) {
      return;
    }

    let mailParser = new MailParser();

    this.mailBox.seqFrom = seqFrom;
    this.imapClient
      .listMessages(this.mailBox.selectedMailBox.path, `${seqFrom}:${seqTo}`, [
        'uid',
        'envelope',
        'body[]'
      ])
      .then(messages => {
        messages.forEach(message => {
          const body = message['body[]'];
          mailParser(body).then(mail => {
            this.mailBox.messages.push(mail);
          });
        });
      });
  };

  close = () => {
    this.imapClient.close();
  };
}

export default ImapManager;
