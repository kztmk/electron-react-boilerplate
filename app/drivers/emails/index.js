import { app } from 'electron';
import puppeteer from 'puppeteer';

import EmailProvider from './providers/provider';
import EmailProviderManager from './providers/providerManager';

/**
 * Main entry point for authenticating and automating a given email provider.
 *
 * @param {string| EmailProvider} provider - Name of built-in email provider or an
 * email address belonging to a built-in email provider. May also be an instance of a
 * custom EmailProvider.
 *
 * @example
 * const client = new EmailDriver('outlook')
 * const session = await client.signin({ username: 'xxx', password: 'xxx' })
 * const emails = await session.getEmails({ query: 'from:amazon' })
 * await session.close()
 *
 * @example
 * const client = new EmailDriver('test@outlook.com')
 * const session = await client.signin({ email: 'test@outlook.com', password: 'xxx' })
 * await session.close()
 */
class EmailDriver {
  constructor(provider) {
    const providerManager = new EmailProviderManager();
    const p = providerManager.getProviderByName(provider);

    if (!(p instanceof EmailProvider)) {
      throw new Error('メール提供元インスタンスが作成出来ません。');
    }
    console.log(`EmailDrinver_provider:${p.name}`);
    this.emailProvider = p;
  }

  /**
   * Email provider to automate.
   *
   * @member {EmailProvider}
   */
  get provider() {
    return this.emailProvider;
  }

  /**
   * Creates a new email account using the set email provider.
   *
   * Any user information that isn't provided will be filled in using
   * [faker.js](https://github.com/Marak/Faker.js).
   *
   * Returns an email session with the authenticated puppeteer browser.
   *
   * @param {object} [user] - User info for the account to create
   * @param {string} [user.username] - Username
   * @param {string} [user.password] - Password
   * @param {string} [user.firstName] - User's given name
   * @param {string} [user.lastName] - User's family name
   * @param {object} [user.birthday] - User's birthday
   * @param {string} [user.birthday.month] - User's birthday month
   * @param {string} [user.birthday.day] - User's birthday day
   * @param {string} [user.birthday.year] - User's birthday year
   *
   * depends on kugutsu provider require additional information.
   * ex) postal code, secret question and answer for recovery forgotten password
   *
   * @param {object} [opts] - Options
   * @param {Object} [opts.browser] - Puppeteer browser instance to use
   * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
   *
   * @return {Promise<EmailSession>}
   */
  async signup(user, opts = {}) {
    if (!user) {
      throw new Error('user information required.');
    }

    console.log(`app path:${app.getAppPath()}`);
    const chromiumPath =
      './app/node_modules/puppeteer/.local-chromium/mac-564778/chrome-mac/Chromium.app';
    const browser =
      opts.browser ||
      (await puppeteer.launch({
        executablePath: chromiumPath,
        headless: false,
        slowMo: 20
      }));

    return this.emailProvider.signup(user, {
      browser,
      ...opts
    });
  }

  /**
   * Signs into an existing email account using the set email provider.
   *
   * You must specify either `user.username` or `user.email`.
   *
   * Returns an email session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to sign into
   * @param {string} [user.username] - Username (usual accountID, emailAddress)
   * @param {string} [user.email] - Email (implies username)
   * @param {string} user.password - Password
   *
   * @param {object} [opts] - Options
   * @param {Object} [opts.browser] - Puppeteer browser instance to use
   * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
   *
   * @return {Promise<EmailSession>}
   */
  async signin(user, opts = {}) {
    const browser = opts.browser || (await puppeteer.launch(opts.puppeteer));

    if (!user) {
      throw new Error('ログイン情報は必須です。');
    }

    return this.emailProvider.signin(user, {
      browser,
      ...opts
    });
  }
}

export default EmailDriver;
