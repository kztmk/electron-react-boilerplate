/* eslint-disable class-methods-use-this */
import EmailProvider from '../provider';
import EmailSession from '../../session';

import signup from './lib/signup';
import signin from './lib/signin';
// import signout from './lib/signout';
// import sendEmail from './lib/send-email';
// import getEmails from './lib/get-emails';

/**
 * email provider for [Yahoo! Japan](https://www.yahoo.co.jp).
 *
 * @extends EmailProvider
 */
class EmailProviderYandex extends EmailProvider {
  /**
   * Email provider to automate.
   *
   * @member {EmailProvider}
   */
  get name() {
    return 'yahoo';
  }

  /**
   * Creates a new email account.
   *
   * Return an email session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to create
   * @param {string} user.username - Username for Yahoo! Japan ID
   * @param {string} user.password - Password
   * @param {string} user.firstName - User's given name
   * @param {string} user.lastName - User's family name
   * @param {number} user.gender - gender male:0 female:1
   * @param {string} user.postalCode - japanese postal code 7 digits
   * @param {object} user.birthday - User's birthday
   * @param {string} user.birthday.month - User's birthday month
   * @param {string} user.birthday.day - User's birthday day
   * @param {string} user.birthday.year -User's birthday year
   * @param {string} user.secret - User's password recovery Q&A
   * @param {string} user.secret.question - User's selected secret question
   * @param {string} user.secret.answer - User's password recovery answer
   *
   * @param {object} opts - Options
   * @param {object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<EmailSession}
   */
  async signup(user, opts) {
    if (!user) throw new Error('登録用個人情報は必須です。');
    if (!user.username) throw new Error('ログインIDは必須です。');
    if (!user.password) throw new Error('パスワードは必須です。');
    if (!user.firstName) throw new Error('姓は必須です。');
    if (!user.lastName) throw new Error('名は必須です。');
    if (!user.secret) throw new Error('秘密の質問・答えは必須です。');
    if (!user.secret.question) throw new Error('秘密の質問は必須です。');
    if (!user.secret.answer) throw new Error('秘密の答えは必須です。');

    await signup(user, opts);

    return new EmailSession({
      user: {
        username: user.username,
        email: `${user.username}@yandex.com`
      },
      browser: opts.browser,
      provider: this
    });
  }

  /**
   * Signs into existing email account.
   *
   * You must specify either `user.username` or 'user.email`.
   *
   * Return an email session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to sign into
   * @param {string} [user.username] - Username (implies email)
   * @param {string} [user.email] -Email (implies username)
   * @param {string} user.password - Password
   *
   * @param {*} opts - Options
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
}

export default EmailProviderYandex;
