/* eslint-disable class-methods-use-this */
import BlogProvider from '../provider';
import BlogSession from '../../session';

import signup from './lib/signup';
import signin from './lib/signin';
import signout from './lib/signout';

/**
 * blog provider for [ameba](https://www.ameba.jp).
 *
 * @extends BlogProvider
 */
class BlogProviderAmeba extends BlogProvider {
  /**
   * Blog provider to automate.
   *
   * @member {BlogProvider}
   */
  get name() {
    return 'ameba';
  }

  /**
   * Creates a new blog account.
   *
   * Return an blog session with the authenticated puppeteer browser.
   * mailaddress
   * @param {object} blogInfo - User info for the account to create
   * @param {string} blogInfo.mailAddress - mailAddress for validation
   * @param {string} blogInfo.accountId - Username for Yahoo! Japan ID
   * @param {string} blogInfo.password - Password
   * @param {string} blogInfo.title - User's family name
   * @param {string} blogInfo.description - blog description
   *
   * @param {object} opts - Options
   * @param {object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<EmailSession}
   */
  async signup(blogInfo, opts) {
    if (!blogInfo) throw new Error('ブログ登録用情報は必須です。');
    if (!blogInfo.accountId) throw new Error('ログインIDは必須です。');
    if (!blogInfo.password) throw new Error('パスワードは必須です。');
    if (!blogInfo.mailAddress) throw new Error('確認用メールアドレスは必須です。');
    if (!blogInfo.title) throw new Error('タイトルは必須です。');
    if (!blogInfo.description) throw new Error('ブログの説明は必須です。');

    await signup(blogInfo, opts);

    return new BlogSession({
      blogInfo: {
        accountId: blogInfo.accountId,
        password: blogInfo.password
      },
      browser: opts.browser,
      provider: this
    });
  }

  /**
   * Signs into existing blog account.
   *
   * You must specify either `user.username` or 'user.email`.
   *
   * Return an blog session with the authenticated puppeteer browser.
   *
   * @param {object} blogInfo - User info for the account to sign into
   * @param {string} [blogInfo.username] - Username (implies email)
   * @param {string} [blogInfo.email] -Email (implies username)
   * @param {string} blogInfo.password - Password
   *
   * @param {*} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<BlogSession>}
   */
  async signin(blogInfo, opts) {
    if (!blogInfo) throw new Error('ログイン情報は必須です。');
    if (!blogInfo.accountId) throw new Error('ログインIDは必須です。');
    if (!blogInfo.password) throw new Error('パスワードは必須です。');
    if (!blogInfo.mailAddress) throw new Error('メールアドレスは必須です。');

    console.log('--signin to ameba');

    await signin(blogInfo, opts);

    return new BlogSession({
      blogInfo: {
        accountId: blogInfo.accountId,
        password: blogInfo.password,
        email: blogInfo.mailAddress
      },
      browser: opts.browser,
      provider: this
    });
  }

  /**
   * Sign out of an authenticated session
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
}

export default BlogProviderAmeba;
