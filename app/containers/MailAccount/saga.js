// @flow
import type Saga from 'redux-saga';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import ImapClient from 'emailjs-imap-client';
import parse from 'emailjs-mime-parser';
import { Actions } from './actionTypes';
import {
  closeConnectionFailure,
  closeConnectionSuccess,
  openConnectionFailure,
  openConnectionSuccess,
  selectMailBoxFailure,
  selectMailBoxSuccess,
  updateFlagsFailure,
  updateFlagsSuccess,
  moveMailsSuccess,
  moveMailsFailure, testConnectionFailure, testConnectionSuccess
} from "./actions";
import type { ImapManagerPropertyType, MailRowMessageType } from '../../types/mailMessageType';
import { firebaseDbUpdate } from '../../database/db';

let imapClient = null;
let imapProperty = null;
const initialImapProperty: ImapManagerPropertyType = {
  mailBoxes: [],
  messages: [],
  selectMailBoxPath: '',
  mailCount: 0,
  unseenCount: 0,
  seqFrom: 0
};

/**
 * alias addressからログイン用Idに変換
 * @param mailAccount
 * @returns {string}
 */
const convertToBaseAccountId = mailAccount => {
  let loginId = '';
  console.log(`--provider: ${mailAccount.provider}`);
  const mailIdWithDomain = mailAccount.mailAddress.split('@');
  const accountId = mailIdWithDomain[0];
  const domain = mailIdWithDomain[1];
  console.log(`accountId:${accountId}`);
  console.log(`domain:${domain}`);
  switch (mailAccount.provider) {
    case 'Outlook':
      loginId = mailAccount.mailAddress;
      break;
    case 'Gmail':
      console.log(`gmail: ${mailAccount.mailAddress}`);

      if (!accountId) {
        throw new Error('Gmailのアドレスを確認してください。')
      }
      loginId = accountId.replace(/\+.*$/, '');
      loginId = loginId.replace(/\./, '');
      loginId = `${loginId}@${domain}`;
      console.log(`gmail after convert: ${loginId}`);
      break;
    case 'Yandex':
      loginId = mailAccount.mailAddress.replace(/@.*$/g, '');
      console.log(`--delete after at: ${loginId}`);
      loginId = loginId.replace(/\+.*$/, '');
      console.log(`--delete after plus: ${loginId}`);
      break;
    case 'Yahoo':
      loginId = mailAccount.accountId;
      break;
    default:
  }

  if (loginId.length === 0 ) {
    throw new Error('メール提供元を特定出来ません。: convert alias id to login Id');
  }
  return loginId;
}

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
      throw new Error('提供元のIMAP情報の取得に失敗しました。');
  }
  return config;
};

const mailSortBySequence = (a, b) => {
  let comparison = 0;
  if (a.key < b.key) {
    comparison = 1;
  } else if (a.key > b.key) {
    comparison = -1;
  }

  return comparison;
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
    imapProperty = null;
    throw new Error({
      errorMessage: '接続が切れています。開き直してください。'
    });
  }
  console.log(imapProperty.mailCount);
  // mailbox情報の取得関数を作成
  // let mailBoxInfo = new Object();
  // const getMailboxInfo = (client, boxPath) =>
  // client.selectMailbox(boxPath).then(mailbox => mailbox);
  // mailbox情報を取得
  // mailBoxInfo = yield call(getMailboxInfo, imapClient, path);
  const mailBoxInfo = yield imapClient.selectMailbox(path).then(mailbox => mailbox);
  console.log('-----------------------------------');
  console.log(`now mailCount:${imapProperty.mailCount}`);
  console.log(`now unseen:${imapProperty.selectMailBoxPath}`);
  // 返却用オブジェクトへ格納
  imapProperty.selectMailBoxPath = path;
  console.log(`property:${imapProperty.mailCount}`);
  console.log(`boxInfo:${mailBoxInfo.exists}`);
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
      let recieveDate = mailMessage.envelope.date;
      if (!recieveDate) {
        recieveDate = '';
      }
      messages.push({
        key: mailMessage['#'],
        uid: mailMessage.uid,
        flags: mailMessage.flags,
        subject: mailMessage.envelope.subject,
        date: recieveDate,
        from: mailMessage.envelope.from,
        mime: parse(mailMessage['body[]'])
      });
    });
    messages.sort(mailSortBySequence);
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

function* testImapConnection(action) {
  try {
    // 提供元からimap server情報を作成
    imapProperty = initialImapProperty;
    const loginId = convertToBaseAccountId(action.payload);
    const config = getImapConfig(action.payload);
    imapClient = new ImapClient(config.host, config.port, {
      auth: {
        user: loginId,
        pass: action.payload.password
      },
      useSecureTransport: true
    });

    // error発生
    imapClient.onerror = function(error) {
      console.log(`error:${error}`);
      imapClient.close();
      imapClient = null;
      imapProperty = null;
    };

    // imap serverへ接続
    const imapConnect = client => client.connect();
    yield call(imapConnect, imapClient);

    // account内のメールフォルダを取得
    imapProperty.mailBoxes = [];
    const mailBoxesRoot = yield call(getMailboxes);
    if (action.payload.provider === 'Gmail') {
      console.log(mailBoxesRoot.children);
      const gmailRoot = mailBoxesRoot.children.find(grandChild => grandChild.name === '[Gmail]');
      console.log('--[Gmail]');
      console.log(gmailRoot);

      if (gmailRoot) {
        gmailRoot.children.forEach(box => {
          console.log(`boxName:${box.name}`);
          imapProperty.mailBoxes.push(box);
        });
      } else {
        throw new Error('[Gmail not found.]');
      }
    } else {
      mailBoxesRoot.children.forEach(box => {
        if (!box.subscribed) {
          // eslint-disable-next-line no-param-reassign
          box.subscribed = false;
        }
        imapProperty.mailBoxes.push(box);
      });
    }
    // imapProperty.mailBoxes = mailBoxesRoot.children;

    console.log(imapProperty.mailBoxes);

    // inboxのpathを検索
    // eslint-disable-next-line array-callback-return
    const inbox = imapProperty.mailBoxes.filter(box => {
      if (box.path.toLowerCase().trim() === 'inbox') {
        return box;
      }
    });

    let inBoxPath = '';
    if (inbox.length > 0) {
      inBoxPath = inbox[0].path;
    }

    if (action.payload.provider === 'Gmail') {
      const gInbox = imapProperty.mailBoxes.find(box => {
        console.log('g-specialUse');
        console.log(box.specialUse);
        return box.specialUse === '\\All';
      });
      console.log('g-inbox');
      console.log(gInbox);
      inBoxPath = gInbox.path;
    }

    console.log(`Inbox --path --${inBoxPath}`);

    // Inbox内のメール取得
    if (inBoxPath.length > 0) {
      yield call(getSelectMailboxInfoAndMessages, inBoxPath);
    } else {
      yield call(getSelectMailboxInfoAndMessages);
    }

    // connection Close
    imapClient.close();
    imapClient = null;
    yield put(testConnectionSuccess(imapProperty))
  } catch (error) {
    // imapClient.close();
    imapClient = null;
    yield put(testConnectionFailure({ errorMessage: error.toString() }));
  }
}

/**
 * imap serverへ接続し、inbox内のメール25通を取得しidle
 * @param action
 * @returns {IterableIterator<*>}
 */
function* openImapConnection(action) {
  try {
    // 提供元からimap server情報を作成
    imapProperty = initialImapProperty;
    const loginId = convertToBaseAccountId(action.payload);

    const config = getImapConfig(action.payload);
    imapClient = new ImapClient(config.host, config.port, {
      auth: {
        user: loginId,
        pass: action.payload.password
      },
      useSecureTransport: true
    });

    // error発生
    imapClient.onerror = function(error) {
      console.log(`error:${error}`);
      imapClient.close();
      imapClient = null;
      imapProperty = null;
    };

    // imap serverへ接続
    const imapConnect = client => client.connect();
    yield call(imapConnect, imapClient);

    // 最終ログイン時刻を更新
    const userAuth = yield select(state => state.Login);
    if (action.payload.key.length > 0) {
      try {
        // firebaseをアップデート
        yield call(
          firebaseDbUpdate,
          `/users/${userAuth.userId}/mailAccount/${action.payload.key}`,
          {
            lastLogin: Date.now()
          }
        );
      } catch (error) {
        throw new Error({ errorMessage: error.toString() });
      }
    }

    // account内のメールフォルダを取得
    imapProperty.mailBoxes = [];
    const mailBoxesRoot = yield call(getMailboxes);
    if (action.payload.provider === 'Gmail') {
      console.log(mailBoxesRoot.children);
      const gmailRoot = mailBoxesRoot.children.find(grandChild => grandChild.name === '[Gmail]');
      console.log('--[Gmail]');
      console.log(gmailRoot);

      if (gmailRoot) {
        gmailRoot.children.forEach(box => {
          console.log(`boxName:${box.name}`);
          imapProperty.mailBoxes.push(box);
        });
      } else {
        throw new Error('[Gmail not found.]');
      }
    } else {
      mailBoxesRoot.children.forEach(box => {
        if (!box.subscribed) {
          // eslint-disable-next-line no-param-reassign
          box.subscribed = false;
        }
        imapProperty.mailBoxes.push(box);
      });
    }
    // imapProperty.mailBoxes = mailBoxesRoot.children;

    console.log(imapProperty.mailBoxes);

    // inboxのpathを検索
    // eslint-disable-next-line array-callback-return
    const inbox = imapProperty.mailBoxes.filter(box => {
      if (box.path.toLowerCase().trim() === 'inbox') {
        return box;
      }
    });

    let inBoxPath = '';
    if (inbox.length > 0) {
      inBoxPath = inbox[0].path;
    }

    if (action.payload.provider === 'Gmail') {
      const gInbox = imapProperty.mailBoxes.find(box => {
        console.log('g-specialUse');
        console.log(box.specialUse);
        return box.specialUse === '\\All';
      });
      console.log('g-inbox');
      console.log(gInbox);
      inBoxPath = gInbox.path;
    }

    console.log(`Inbox --path --${inBoxPath}`);

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
      imapProperty = null;
      imapClient = null;

      yield put(closeConnectionSuccess());
    } catch (error) {
      yield put(closeConnectionFailure({ errorMessage: error.toString() }));
    }
  } else {
    yield put(closeConnectionSuccess());
  }
}

function* updateFlags(action) {
  if (imapClient !== null) {
    // update定義
    const updateFlagsToServer = (client, path, seq, flagsObject) => {
      client.setFlags(path, seq, flagsObject, { byUid: true, silent: true });
    };

    // sequenceの文字列を作成
    const sequences = action.payload.sequences.join(',');

    try {
      // imap serverへupdate
      yield call(
        updateFlagsToServer,
        imapClient,
        action.payload.path,
        sequences,
        action.payload.flagUpdateObject
      );

      // 現在のImapServerPropertyを取得
      const currentImapManagerProperty = yield select(state => state.MailAccount);
      // messagesを取得
      const workingMessages = { ...currentImapManagerProperty.messages };
      let workingUnseenCount = currentImapManagerProperty.unseenCount;
      const workingSequences = action.payload.sequences;

      // flagUpdateObject
      const update = Object.keys(action.payload.flagUpdateObject);
      const newFlags = action.payload.flagUpdateObject[update];

      console.log('update');
      console.log(update);
      console.log(newFlags);
      const updateMessages = [];
      update.forEach(u => {
        if (u === 'add') {
          Object.keys(workingMessages).forEach(k => {
            workingSequences.forEach(s => {
              if (workingMessages[k].uid === s) {
                const flagSeen = workingMessages[k].flags.find(f => f === '\\Seen');
                if (flagSeen === undefined) {
                  workingMessages[k].flags.push('\\Seen');
                  updateMessages.push(workingMessages[k]);
                  workingUnseenCount -= 1;
                }
              }
            });
          });
          console.log('updated messages');
          console.log(updateMessages);
        }

        if (u === 'remove') {
          Object.keys(workingMessages).forEach(k => {
            console.log(`message key:${workingMessages[k].key}`);
            workingSequences.forEach(s => {
              console.log(`sequence: ${s}`);
              if (workingMessages[k].uid === s) {
                console.log('before remove');
                console.log(workingMessages[k].flags);
                const flagSeen = workingMessages[k].flags.find(f => f === '\\Seen');
                if (flagSeen !== undefined) {
                  const updatedFlags = workingMessages[k].flags.filter(f => f !== '\\Seen');
                  workingMessages[k].flags = updatedFlags;
                  updateMessages.push(workingMessages[k]);
                  workingUnseenCount += 1;
                }
              }
            });
          });
          console.log('updated messages');
          console.log(updateMessages);
        }
      });

      const originalMessages = [];
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in currentImapManagerProperty.messages) {
        originalMessages.push(currentImapManagerProperty.messages[key]);
      }
      console.log('orig');
      console.log(originalMessages);

      const updateImapManagerProperty = {
        ...currentImapManagerProperty,
        unseenCount: workingUnseenCount
      };
      // pathを指定してmailBox内のメールを取得
      // yield call(getSelectMailboxInfoAndMessages, action.payload.path, action.payload.seqFrom);

      yield put(updateFlagsSuccess(updateImapManagerProperty));
    } catch (error) {
      yield put(updateFlagsFailure({ errorMessage: error.toString() }));
    }
  } else {
    yield put(
      updateFlagsFailure({
        errorMessage: 'サーバーから切断されています。再度開き直してください。'
      })
    );
  }
}

function* moveMails(action) {
  if (imapClient !== null) {
    // move mails to another mailbox定義
    const moveMessages = (client, pathFrom, seq, pathTo) => {
      client.moveMessages(pathFrom, seq, pathTo, { byUid: true });
    };

    console.log('boxPath');
    console.log(action.payload.moveDestination);
    // sequenceの文字列を作成
    const sequences = action.payload.sequences.join(',');

    try {
      // imap serverへupdate
      yield call(
        moveMessages,
        imapClient,
        action.payload.path,
        sequences,
        action.payload.moveDestination
      );

      // pathを指定してmailBox内のメールを取得
      let boxPath = action.payload.moveDestination;

      if (boxPath.toLowerCase() === 'trash' || boxPath.toLowerCase() === 'deleted') {
        yield call(getSelectMailboxInfoAndMessages, boxPath, 0, true);
        boxPath = 'INBOX';
      }
      yield call(getSelectMailboxInfoAndMessages, boxPath, 0);

      yield put(moveMailsSuccess(imapProperty));
    } catch (error) {
      yield put(moveMailsFailure({ errorMessage: error.toString() }));
    }
  } else {
    yield put(
      moveMailsFailure({
        errorMessage: 'サーバーから切断されています。再度開き直してください。'
      })
    );
  }
}

function* rootSaga(): Saga {
  yield takeEvery(Actions.OPEN_CONNECTION_REQUEST, openImapConnection);
  yield takeEvery(Actions.SELECT_MAIL_BOX_REQUEST, selectMailbox);
  yield takeEvery(Actions.CLOSE_CONNECTION_REQUEST, closeImapConnection);
  yield takeEvery(Actions.UPDATE_FLAGS_REQUEST, updateFlags);
  yield takeEvery(Actions.MOVE_MAILS_REQUEST, moveMails);
  yield takeEvery(Actions.TEST_CONNECTION_REQUEST, testImapConnection);
}

export default rootSaga;
