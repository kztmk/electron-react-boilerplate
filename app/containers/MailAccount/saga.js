// @flow
import type Saga from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import ImapClient from 'emailjs-imap-client';
import { Actions } from './actionTypes';
import {
  closeConnectionFailure,
  closeConnectionSuccess,
  openConnectionFailure,
  openConnectionSuccess,
  selectMailBoxFailure,
  selectMailBoxSuccess
} from './actions';
import type { ImapManagerPropertyType, MailRowMessageType } from '../../types/mailMessageType';

let imapClient = null;

const imapProperty: ImapManagerPropertyType = {
  mailBoxes: [],
  messages: [],
  selectMailBoxPath: '',
  mailCount: 0,
  unseenCount: 0,
  seqFrom: 0
};

/**
 * 提供元により接続先imap server情報の作成
 * @param targetAccount
 * @returns {{host: string, port: number}|{host: string, port: number}|*}
 */
const getImapConfig = targetAccount => {
  console.log(`provider:${targetAccount.provider}`);
  let config = null;
  switch (targetAccount.provider) {
    case 'Yahoo':
      console.log('set imap config for Yahoo');
      config = {
        host: 'imap.mail.yahoo.co.jp',
        port: 993
      };
      break;
    case 'Outlook':
      config = {
        host: 'imap-mail.outlook.com',
        port: 993
      };
      break;
    default:
      throw new Error('提供元のIMAP情報の取得に失敗しました。');
  }
  return config;
};

/**
 * mailAccount内のメールフォルダの取得
 * @returns {IterableIterator<*>}
 */
function* getMailboxes() {
  return yield imapClient.listMailboxes();
}

/**
 * 指定したmailBoxの情報、mailMessage 指定位置から25通を取得
 * @param path
 * @param startSeq
 * @returns {IterableIterator<*>}
 */
function* getSelectMailboxInfoAndMessages(path = 'INBOX', startSeq = 0) {
  if (imapClient === null) {
    throw new Error({ errorMessage: '接続が切れています。開き直してください。' });
  }
  // mailbox情報の取得関数を作成
  const getMailboxInfo = (client, boxPath) =>
    client.selectMailbox(boxPath).then(mailbox => mailbox);
  // mailbox情報を取得
  const mailBoxInfo = yield call(getMailboxInfo, imapClient, path);
  // 返却用オブジェクトへ格納
  imapProperty.selectMailBoxPath = path;
  imapProperty.mailCount = mailBoxInfo.exists;

  // メール取得位置の作成
  // 最新メールから
  let sequence = mailBoxInfo.exists;
  if (startSeq !== 0) {
    sequence = startSeq;
  }
  const seq = generateSeq(sequence, mailBoxInfo.exists);

  console.log(`get mails:${seq}`);
  // mailMessage格納用
  const messages: Array<MailRowMessageType> = [];

  // 未読数の取得
  const unseen = yield imapClient.search(path, { unseen: true }).then(result => result);
  imapProperty.unseenCount = unseen.length;
  // 取得範囲が正常かをチェック
  if (seq.length > 0) {
    // mailbox内のmessageを取得
    const mailMessages = yield imapClient
      .listMessages(path, seq, ['uid', 'flags', 'envelope', 'body.peek[]'])
      .then(boxMessages => boxMessages);

    mailMessages.forEach(mailMessage => {
      messages.push({
        key: mailMessage['#'],
        uid: mailMessage.uid,
        flags: mailMessage.flags,
        subject: mailMessage.envelope.subject,
        date: mailMessage.envelope.date,
        from: mailMessage.envelope.from,
        body: mailMessage['body[]']
      });
    });
    messages.reverse();
  }
  // 返却用オブジェクトへ格納
  console.log(messages);
  imapProperty.messages = messages;
}

/**
 *  メール取得範囲を文字列で作成
 * @param startSeq
 * @param mailCount
 * @returns {string} sequence 'start:end'
 */
function generateSeq(startSeq, mailCount): string {
  // startSeqから25通
  let sequence = '';
  let seqFrom = startSeq;
  let seqTo;

  if (seqFrom > mailCount) {
    seqFrom = mailCount;
  }
  seqTo = seqFrom - 24;
  if (seqTo < 1) {
    seqTo = 1;
  }
  imapProperty.seqFrom = seqFrom;

  if (seqFrom >= seqTo) {
    sequence = `${seqTo}:${seqFrom}`;
  }
  return sequence;
}

/**
 * imap serverへ接続し、inbox内のメール25通を取得しidle
 * @param action
 * @returns {IterableIterator<*>}
 */
function* openImapConnection(action) {
  try {
    // 提供元からimap server情報を作成
    const config = getImapConfig(action.payload);
    imapClient = new ImapClient(config.host, config.port, {
      auth: {
        user: action.payload.accountId,
        pass: action.payload.password
      },
      useSecureTransport: true
    });

    imapClient.onerror = function(error) {
      console.log(`error occurred. close connection:${error}`);
      imapClient = null;
      throw new Error({ errorMessage: error.toString() });
    };

    // error発生
    imapClient.onerror = error => {
      throw new Error(error.toString());
    };

    // imap serverへ接続
    const imapConnect = client => client.connect();
    yield call(imapConnect, imapClient);

    // account内のメールフォルダを取得
    const maiBoxesRoot = yield call(getMailboxes);
    imapProperty.mailBoxes = maiBoxesRoot.children;

    // inboxのpathを検索
    const inbox = imapProperty.mailBoxes.filter(box => {
      if (box.path.toLowerCase().trim() === 'inbox') {
        return box;
      }
    });

    let inBoxPath = '';
    if (inbox.length > 0) {
      inBoxPath = inbox[0].path;
    }

    // Inbox内のメール取得
    if (inBoxPath.length > 0) {
      yield call(getSelectMailboxInfoAndMessages, inBoxPath);
    } else {
      yield call(getSelectMailboxInfoAndMessages);
    }

    // 成功
    yield put(openConnectionSuccess(imapProperty));
  } catch (error) {
    // error発生時にimap serverを切断
    imapClient.close();
    imapClient = null;
    yield put(openConnectionFailure({ errorMessage: error.toString() }));
  }
}

function* selectMailbox(action) {
  try {
    // pathを指定してmailBox内のメールを取得
    yield call(getSelectMailboxInfoAndMessages, action.payload.path, action.payload.seqFrom);

    yield put(selectMailBoxSuccess(imapProperty));
  } catch (error) {
    yield put(selectMailBoxFailure({ errorMessage: error.toString() }));
  }
}

/**
 * close imap connection
 * @returns {IterableIterator<*>}
 */
function* closeImapConnection() {
  if (imapClient !== null) {
    try {
      imapClient.close();
      imapClient = null;

      yield put(closeConnectionSuccess());
    } catch (error) {
      yield put(closeConnectionFailure({ errorMessage: error.toString() }));
    }
  } else {
    yield put(closeConnectionSuccess());
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.OPEN_CONNECTION_REQUEST, openImapConnection);
  yield takeEvery(Actions.SELECT_MAIL_BOX_REQUEST, selectMailbox);
  yield takeEvery(Actions.CLOSE_CONNECTION_REQUEST, closeImapConnection);
}

export default rootSaga;
