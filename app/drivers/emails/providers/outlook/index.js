/* eslint-disable class-methods-use-this */
import EmailProvider from '../provider';
import EmailSession from '../../session';

import signup from './lib/signup';
import signin from './lib/signin';
import signout from './lib/signout';
import sendEmail from './lib/send-email';
import getEmails from './lib/get-emails';

/**
 * Kugutsu email provider for [Outlook](https://outlook.live.com).
 *
 * @extends EmailProvider
 */
class EmailProviderOutlook extends EmailProvider {
  /**
   * Email provider to automate.
   *
   * @member {EmailProvider}
   */
  get name() {
    return 'outlook';
  }

  /**
   * Creates a new email account.
   *
   * Returns an email session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to create
   * @param {string} user.username - Username
   * @param {string} user.password - Password
   * @param {string} user.firstName - User's given name
   * @param {string} user.lastName - User's family name
   * @param {object} user.birthday - User's birthday
   * @param {string} user.birthday.month - User's birthday month
   * @param {string} user.birthday.day - User's birthday day
   * @param {string} user.birthday.year - User's birthday year
   * @param {string} user.domain - user selects from outlook.jp | outlook.com | hotmail.com
   *
   * @param {object} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<EmailSession>}
   */
  async signup(user, opts) {
    if (!user) throw new Error('登録用個人情報は必須です。');
    if (!user.username) throw new Error('ログインIDは必須です。');
    if (!user.password) throw new Error('パスワードは必須です。');
    if (!user.firstName) throw new Error('姓は必須です。');
    if (!user.lastName) throw new Error('名は必須です。');
    if (!user.birthday) throw new Error('生年月日は必須です。');
    if (!user.birthday.year) throw new Error('生年月日の年がありません。');
    if (!user.birthday.month) throw new Error('生年月日の月がありません。');
    if (!user.birthday.day) throw new Error('生年月日の日がありません。');
    if (!user.domain) throw new Error('ドメインが選択されていません。');

    await signup(user, opts);

    return new EmailSession({
      user: {
        username: user.username,
        email: `${user.username}@${user.domain}`
      },
      browser: opts.browser,
      provider: this
    });
  }

  /**
   * Signs into an existing email account.
   *
   * You must specify either `user.username` for singin.
   *
   * Returns an email session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to sign into
   * @param {string} [user.username] - Username (implies email)
   * @param {string} [user.email] - Email (implies username)
   * @param {string} user.password - Password
   *
   * @param {object} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<EmailSession>}
   */
  async signin(user, opts) {
    if (!user) throw new Error('ログイン情報は必須です。');
    if (!user.username) throw new Error('ログインIDは必須です。');
    if (!user.password) throw new Error('パスワードは必須です。');
    if (!user.email) throw new Error('メールアドレスは必須です。');

    await signin(user, opts);

    return new EmailSession({
      user: {
        username: user.username,
        email: user.email
      },
      browser: opts.browser,
      provider: this
    });
  }

  /**
   * Signs out of an authenticated session.
   *
   * @param {EmailSession} session
   *
   * @return {Promise}
   */
  async signout(session) {
    if (!session) throw new Error('ログイン中のセッションは必須です。');

    return signout({
      browser: session.browser
    });
  }

  /**
   * Sends an email from an authenticated session.
   *
   * @param {EmailSession} session
   * @param {object} email - TODO
   * @param {object} [opts] - Options
   *
   * @return {Promise}
   */
  async sendEmail(session, email, opts = {}) {
    if (!session) throw new Error('ログイン中のセッションは必須です。');
    if (!email) throw new Error('送信用メールは必須です。');

    return sendEmail(email, {
      browser: session.browser,
      ...opts
    });
  }

  /**
   * Fetches emails from the inbox of an authenticated session.
   *
   * @param {EmailSession} session
   * @param {object} [opts] - Options
   * @param {object} [opts.query] - Search query to narrow down results
   *
   * @return {Promise<Array<Object>>}
   */
  async getEmails(session, opts = {}) {
    if (!session) throw new Error('ログイン中のセッションは必須です。');

    return getEmails({
      browser: session.browser,
      ...opts
    });
  }
}

export default EmailProviderOutlook;
