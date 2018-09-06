import ImapClient from 'emailjs-imap-client';
import text2Html from '../../utils/text2html';
import confirmMails from '../blogs/providers/providerConfirmInfo';

// eslint-disable-next-line prefer-destructuring
const MailParser = require('mailparser-mit').MailParser;

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
    default:
      throw new Error('imap serverの設定取得に失敗しました。');
  }

  return config;
};

async function getPathToInbox() {
  return imapClient.listMailboxes().then(mailboxes => {
    console.log('--list mailboxes -----');
    const inbox = mailboxes.children.find(box => box.name.toLowerCase() === 'inbox');
    const junk = mailboxes.children.find(box => box.name.toLowerCase() === 'junk' || 'bulk mail');

    const boxes = {};
    boxes.inbox = inbox.path;
    console.log(`inboxPath:${boxes.inbox}`);
    boxes.junk = junk.path;
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
  return imapClient.listMessages(path, seq, ['uid', 'body.peek[]']);
}

async function getValidationLink(mailCriteria) {
  try {
    console.log('--recieved criteria---');
    console.log(mailCriteria);
    // get imap server config from mailaddress
    const config = getImapConfig(mailCriteria.provider);

    let { accountId } = mailCriteria;
    if (mailCriteria.provider === 'Outlook') {
      accountId = mailCriteria.mailAddress;
    }

    if (mailCriteria.provider === 'Gmail') {
      accountId = mailCriteria.mailAddress.replace(/\+.*@/, '@');
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
      console.log(`get messages from:${boxes.inbox}`);

      const confirmInfo = confirmMails.find(c => {
        return c.provider === mailCriteria.blogProvider;
      });

      const { sender } = confirmInfo;
      const mailLink = confirmInfo.link;

      console.log(`sender:${sender}`);
      console.log(`link:${mailLink}`);

      console.log(`===sender==${sender}`);
      let messageUids = await searchMessages(boxes.inbox, sender);
      console.log('--search result----');
      console.log(messageUids);
      console.log('--search result----');
      let messages = await getMessages(boxes.inbox, messageUids);
      messages.sort(mailSortBySequence);
      console.log('---after sort');
      console.log(messages);
      console.log(`mailCount:${messages.length}`);
      if (!messages) {
        messageUids = await searchMessages(boxes.junk, sender);
        if (!messageUids) {
          throw new Error('mail not found inbox/junk');
        }
        messages = await getMessages(boxes.junk, messageUids);
      }
      // const bodies = [];
      // messages.forEach(m => {
      let mailBody = '';
      const message = messages[0];
      console.log('-----------body-----------');
      console.log(message['body[]']);

      validationLink = message['body[]'].match(confirmInfo.regx);

      /*
      if (message !== undefined) {
        const mailparser = new MailParser();
        await mailparser.end(message['body[]']);
        await mailparser.on('end', mail => {
          if (!mail.hasOwnProperty('html')) {
            if (mail.hasOwnProperty('text')) {
              console.log('----mail text');
              mailBody = text2Html(mail.text);
            }
          } else {
            mailBody = mail.html;
            console.log('----mail html');
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
          console.log('=body=');
          console.log(mailBody);
          const domParser = new DOMParser();
          const doc = domParser.parseFromString(mailBody, 'text/html');
          const aTags = doc.getElementsByTagName('a');
          console.log('---aTags---');
          console.log(aTags);

          for (const elm of aTags) {
            if (elm.href.indexOf('https://secure.id.fc2.com/signup.php') > -1) {
              validationLink.push(elm.href);
            }
          }

          if (validationLink) {
            console.log('vlink-------');
            console.log(validationLink);
          } else {
            console.log('can not find link');
          }
          console.log('---done---');
          imapClient.close().then(() => {
            console.log('---------imap server disconnected.------');
          });
        });
      }
      */
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

export default getValidationLink;
