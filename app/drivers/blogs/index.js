import puppeteer from 'puppeteer';

import BlogProvider from './providers/provider';
import BlogProviderManager from './providers/providerManager';

/**
 * Main entry point for authenticating and automating a given blog provider.
 *
 * @param {string| BlogProvider} provider - Name of built-in blog provider.
 * May also be an instance of a custom BlogProvider.
 *
 * @example
 * const client = new BlogDriver('fc2')
 * const session = await client.signin({ username: 'xxx', password: 'xxx' })
 * await session.close()
 *
 */
class BlogDriver {
  constructor(provider) {
    const providerManager = new BlogProviderManager();
    const p = providerManager.getProviderByName(provider);

    if (!(p instanceof BlogProvider)) {
      throw new Error('ブログ提供元のインスタンスが作成できません。');
    }
    this.blogProvider = p;
  }

  get provider() {
    return this.blogProvider;
  }

  /**
   * Creates a new blog account using the set blog provider.
   *
   * Returns an blog session with the authenticated puppeteer browser.
   *
   * @param {object} [blogInfo] - User info for the account to create
   * @param {string} [blogInfo.accountId] - accountId for signin
   * @param {string} [blogInfo.password] - Password
   * @param {string} [blogInfo.mailAddress] - mailaddress for user validation
   * @param {string} [blogInfo.title] - blog title
   * @param {object} [blogInfo.description] - blog description
   * @param {string} [blogInfo.details] - information for the account create
   *
   * depends on kugutsu provider require additional information.
   * ex) postal code, secret question and answer for recovery forgotten password
   *
   * @param {object} [opts] - Options
   * @param {Object} [opts.browser] - Puppeteer browser instance to use
   * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
   *
   * @return {Promise<BlogSession>}
   */
  async signup(blogInfo, opts = {}) {
    if (!blogInfo) {
      throw new Error('ブログを作成するための情報は必須です。');
    }

    let exePath = await puppeteer.executablePath();
    if (process.env.NODE_ENV === 'production') {
      exePath = exePath.replace('app.asar', 'app.asar.unpacked');
    }

    const width = 1024;
    const height = 748;

    const browser =
      opts.browser ||
      (await puppeteer.launch({
        executablePath: exePath,
        headless: false,
        slowMo: 20,
        args: [`--window-size=${width},${height}`]
      }));

    return this.blogProvider.signup(blogInfo, {
      browser,
      ...opts
    });
  }

  /**
   * Signs into an existing blog account using the set blog provider.
   *
   * You must specify either `user.username` or `user.email` and password.
   *
   * Returns an blog session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to sign into
   * @param {string} [user.username] - Username (usual accountID, emailAddress)
   * @param {string} user.password - Password
   *
   * @param {object} [opts] - Options
   * @param {Object} [opts.browser] - Puppeteer browser instance to use
   * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
   *
   * @return {Promise<BlogSession>}
   */
  async signin(user, opts = {}) {
    const browser = opts.browser || (await puppeteer.launch(opts.puppeteer));

    if (!user) {
      throw new Error('ログイン情報は必須です。');
    }

    return this.blogProvider.signin(user, {
      browser,
      ...opts
    });
  }
}

export default BlogDriver;
