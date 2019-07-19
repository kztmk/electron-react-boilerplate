/* eslint-disable promise/catch-or-return,promise/always-return */
import ImapClient from 'emailjs-imap-client';
import parse from 'emailjs-mime-parser';
import { TextDecoder } from 'text-encoding';
import confirmMails from '../blogs/providers/providerConfirmInfo';

// eslint-disable-next-line prefer-destructuring
// const MailParser = require('mailparser-mit').MailParser;

let imapClient = null;

const mailSortBySequence = (a, b) => {
  let comparison = 0;
  if (a.uid < b.uid) {
    comparison = 1;
  } else if (a.uid > b.uid) {
    comparison = -1;
  }

  return comparison;
};

/**
 * get imap Server config from mailaddress
 * @param provider
 * @returns {{host: string, port: number}|{host: string, port: number}}
 */
const getImapConfig = provider => {
  let config;

  switch (provider) {
    case 'Yahoo':
      config = {
        host: 'imap.mail.yahoo.co.jp',
        port: 993
      };
      break;
    case 'Outlook':
      config = {
        host: 'outlook.office365.com',
        port: 993
      };
      break;
    case 'Gmail':
      config = {
        host: 'imap.gmail.com',
        port: 993
      };
      break;
    case 'Yandex':
      config = {
        host: 'imap.yandex.ru',
        port: 993
      };
      break;
    default:
      throw new Error('imap serverの設定取得に失敗しました。');
  }

  return config;
};

async function getPathToInbox() {
  return imapClient.listMailboxes().then(mailboxes => {
    console.log('--list mailboxes -----');
    console.log(mailboxes);
    const inbox = mailboxes.children.find(box => box.name.toLowerCase() === 'inbox');
    const junk = mailboxes.children.find(box => {
      if ((box.name.toLowerCase() === 'junk') ||
          (box.name.toLowerCase() === 'bulk mail') ||
          (box.name.toLowerCase() === 'spam')) {
              return box;
      }
    });

    const boxes = {};
    boxes.inbox = inbox.path;
    console.log(`inboxPath:${boxes.inbox}`);

    const GmailRoot = mailboxes.children.find(box => box.name === '[Gmail]');
    console.log('--Gmail');
    console.log(GmailRoot);
    if (GmailRoot) {
      const gmailJunk = GmailRoot.children.find(box => {
        return box.flags.find(f => {
          console.log(f);
          return f=== '\\Junk';
        })
      });
      boxes.junk = gmailJunk.path;
      console.log(`gmail-junkPath:${boxes.junk}`);
    } else {
      if (junk) {
        boxes.junk = junk.path;
      } else {
        boxes.junk = '';
      }
    }
    console.log(`junkPath:${boxes.junk}`);

    return boxes;
  });
}

async function searchMessages(path, sender) {
  console.log(`--search message by sender:${sender}`);
  return imapClient.search(path, { from: sender }, { byUid: true }).then(result => {
    console.log('---search result in searchMessage');
    console.log(result);
    return result;
  });
}

async function getMessages(path, seq) {
  return imapClient.listMessages(path, seq, ['uid', 'body.peek[]'], { byUid: true });
}

async function getValidationLink(mailCriteria) {
  try {
    console.log('--recieved criteria---');
    console.log(mailCriteria);
    // get imap server config from mailaddress
    const config = getImapConfig(mailCriteria.provider);

    console.log('---imap config---');
    console.log(config);
    let { accountId } = mailCriteria;
    if (mailCriteria.provider === 'Outlook') {
      accountId = mailCriteria.mailAddress;
    }

    if (mailCriteria.provider === 'Gmail') {
      accountId = mailCriteria.mailAddress.replace(/\+.*@/, '@');
    }

    if (mailCriteria.provider === 'Yandex') {
      accountId = mailCriteria.mailAddress.replace(/@.*$/, '');
      accountId = accountId.replace(/\+.*$/, '');
    }

    console.log(`accountId:${accountId}`);
    // connect to imap server use by accountId, password
    imapClient = new ImapClient(config.host, config.port, {
      auth: {
        user: accountId,
        pass: mailCriteria.password
      },
      useSecureTransport: true
    });

    let validationLink;
    await imapClient.connect();
    const boxes = await getPathToInbox(imapClient);

    // check boxex
    if (boxes.inbox) {
      let targetBox = boxes.inbox;
      console.log(`get messages from:${boxes.inbox}`);

      const confirmInfo = confirmMails.find(c => c.provider === mailCriteria.blogProvider);
      if (confirmInfo === undefined) {
        throw new Error('メール検索条件が見つかりません。');
      }

      const { sender } = confirmInfo;
      const mailLink = confirmInfo.link;

      console.log(`sender:${sender}`);
      console.log(`link:${mailLink}`);

      console.log(`===sender==${sender}`);
      let messageUids = await searchMessages(boxes.inbox, sender);
      console.log('--search result----');
      console.log(messageUids);
      console.log('--search result----');
      console.log('--get messages--');

      // message check
      if (!messageUids || messageUids.length === 0) {
        console.log('---search in junk---');
        messageUids = await searchMessages(boxes.junk, sender);
        console.log('---in junk');
        console.log(messageUids);
        if (messageUids.length === 0) {
          throw new Error('mail not found inbox/junk');
        }
        targetBox = boxes.junk;
      }

      const messages = await getMessages(targetBox, messageUids);
      console.log('---got messages--');
      console.log('---start sort---');
      if (!messages) {
        throw new Error('message not found.');
      }
      messages.sort(mailSortBySequence);
      console.log('---after sort');
      console.log(messages);
      console.log(`mailCount:${messages.length}`);

      // const bodies = [];
      // messages.forEach(m => {
      const message = messages[0];
      console.log('-----------body-----------');
      console.log(message['body[]']);

      let contentMsg = message['body[]'];
      if (
        mailCriteria.blogProvider === 'yaplog' ||
        mailCriteria.blogProvider === 'wpcom'
      ) {
        const myMimeNodes = parse(message['body[]']);
        console.log('-----------body parse-----------');
        console.log(myMimeNodes);

        const decodedMsg = new TextDecoder('iso-2022-jp').decode(myMimeNodes.content);
        console.log('-----decoded msg--------');
        console.log(decodedMsg);
        contentMsg = decodedMsg;
      }
      console.log('---confirmInfo regx----');
      console.log(confirmInfo.regx);
      const regxLink = new RegExp(confirmInfo.regx, 'gm');
      validationLink = contentMsg.match(regxLink);

      console.log('---done---');
      imapClient.close().then(() => {
        console.log('---------imap server disconnected.------');
      });

      return validationLink;
    } else {
      console.log('---done else---');
      imapClient.close().then(() => {
        console.log('---------imap server disconnected.------');
      });
      return [];
    }
  } catch (error) {
    imapClient.close().then(() => {
      console.log('---------error occurd imap server disconnected.------');
    });
    throw new Error(error.toString());
  }
}

export async function getYahooAuthCode(mailCriteria) {
  try {
    console.log('--recieved mail info---');
    console.log(mailCriteria);
    // get imap server config from mailaddress
    const config = getImapConfig(mailCriteria.provider);

    console.log('---imap config---');
    console.log(config);
    let { accountId } = mailCriteria;
    if (mailCriteria.provider === 'Outlook') {
      accountId = mailCriteria.mailAddress;
    }

    if (mailCriteria.provider === 'Gmail') {
      accountId = mailCriteria.mailAddress.replace(/\+.*@/, '@');
    }

    if (mailCriteria.provider === 'Yandex') {
      accountId = mailCriteria.mailAddress.replace(/@.*$/, '');
      accountId = accountId.replace(/\+.*$/, '');
    }

    console.log(`accountId:${accountId}`);
    // connect to imap server use by accountId, password
    imapClient = new ImapClient(config.host, config.port, {
      auth: {
        user: accountId,
        pass: mailCriteria.password
      },
      useSecureTransport: true
    });

    let yahooAuthCode;
    await imapClient.connect();
    const boxes = await getPathToInbox(imapClient);

    // check boxex
    if (boxes.inbox) {
      let targetBox = boxes.inbox;
      console.log(`get messages from:${boxes.inbox}`);

      // Yahoo!Japanからの確認メール
      const confirmInfo =   {
        provider: 'yahoo',
        sender: 'reg-master@mail.yahoo.co.jp',
        link: '6 digit number',
        regx: '\^\\d\{6\}\$'
      }

      const { sender } = confirmInfo;
      const mailLink = confirmInfo.link;

      console.log(`sender:${sender}`);
      console.log(`link:${mailLink}`);

      console.log(`===sender==${sender}`);
      let messageUids = await searchMessages(boxes.inbox, sender);
      console.log('--search result----');
      console.log(messageUids);
      console.log('--search result----');
      console.log('--get messages--');

      // message check
      if (!messageUids || messageUids.length === 0) {
        console.log('---search in junk---');
        messageUids = await searchMessages(boxes.junk, sender);
        console.log('---in junk');
        console.log(messageUids);
        if (messageUids.length === 0) {
          throw new Error('mail not found inbox/junk');
        }
        targetBox = boxes.junk;
      }

      const messages = await getMessages(targetBox, messageUids);
      console.log('---got messages--');
      console.log('---start sort---');
      if (!messages) {
        throw new Error('message not found.');
      }
      messages.sort(mailSortBySequence);
      console.log('---after sort');
      console.log(messages);
      console.log(`mailCount:${messages.length}`);

      // const bodies = [];
      // messages.forEach(m => {
      const message = messages[0];
      console.log('-----------body-----------');
      console.log(message['body[]']);

      const contentMsg = message['body[]'];

      console.log('---confirmInfo regx----');
      console.log(confirmInfo.regx);
      const regxLink = new RegExp(confirmInfo.regx, 'gm');
      yahooAuthCode = contentMsg.match(regxLink);

      console.log(`----yahoo auth code: ${yahooAuthCode}---`);
      console.log('---done---');
      imapClient.close().then(() => {
        console.log('---------imap server disconnected.------');
      });

      return yahooAuthCode;
    } else {
      console.log('---done else---');
      imapClient.close().then(() => {
        console.log('---------imap server disconnected.------');
      });
      return [];
    }
  } catch (error) {
    imapClient.close().then(() => {
      console.log('---------error occured imap server disconnected.------');
    });
    throw new Error(error.toString());
  }
}

export default getValidationLink;
