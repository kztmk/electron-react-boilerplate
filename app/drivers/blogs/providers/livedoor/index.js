/* eslint-disable class-methods-use-this */
import BlogProvider from '../provider';
import BlogSession from '../../session';

import signup from './lib/signup';
import signin from './lib/signin';
import signout from './lib/signout';
import open from "./lib/open";

/**
 * blog provider for [Livedoor](https://http://blog.livedoor.com/).
 *
 * @extends BlogProvider
 */
class BlogProviderLivedoor extends BlogProvider {
  /**
   * Blog provider to automate.
   *
   * @member {BlogProvider}
   */
  get name() {
    return 'livedoor';
  }

  /**
   * Creates a new blog account.
   *
   * Return an blog session with the authenticated puppeteer browser.
   *
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
   * @return {Promise<BlogSession}
   */
  async signup(blogInfo, opts) {
    if (!blogInfo) throw new Error('ブログ登録用情報は必須です。');
    if (!blogInfo.accountId) throw new Error('ログインIDは必須です。');
    if (!blogInfo.password) throw new Error('パスワードは必須です。');
    if (!blogInfo.mailAddress) throw new Error('確認用メールアドレスは必須です。');
    if (!blogInfo.title) throw new Error('タイトルは必須です。');
    if (!blogInfo.description) throw new Error('ブログの説明は必須です。');

    console.log('---create livedoor----');
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
   * @param {object} blogInfo - User info for the account to create
   * @param {string} blogInfo.mailAddress - mailAddress for validation
   * @param {string} blogInfo.accountId - Username for Yahoo! Japan ID
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

    console.log('--signin to livedoor');

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
   * @param {BlogSession} session
   *
   * @return {Promise}
   */
  async signout(session) {
    if (!session) throw new Error('ログイン中のセッションは必須です。');

    return signout({
      browser: session.browser
    });
  }

  async openTopPage(blogInfo, opts) {
    if (!blogInfo) throw new Error('ブログ情報は必須です。');
    if (!blogInfo.url) throw new Error('URLは必須です。');

    console.log('--signin to fc2');

    await open(blogInfo, opts);

    return new BlogSession({
      blogInfo: {
        accountId: blogInfo.accountId,
        password: blogInfo.password,
        email: blogInfo.mailAddress,
        url: blogInfo.url
      },
      browser: opts.browser,
      provider: this
    });
  }
}

export default BlogProviderLivedoor;
