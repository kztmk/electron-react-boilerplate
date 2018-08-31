/**
 * Holds state for an authenticated kugutsu email session.
 *
 * @param {object} opts - Options
 * @param {object} opts.user - Authenticated user
 * @param {string} opts.user.username - Authenticated user's username
 * @param {string} opts.user.email - Authenticated user's email
 * @param {object} opts.browser - Puppeteer Browser to use
 * @param {EmailProvider} opts.provider - Email provider to use
 */
class EmailSession {
  constructor(opts) {
    if (!opts) throw new Error('プロパティは必須です。');
    if (!opts.user) throw new Error('ログイン情報は必須です。');
    if (!opts.user.username) throw new Error('ログインIDは必須です。');
    if (!opts.user.email) throw new Error('メールアドレスは必須です。');
    if (!opts.browser) throw new Error('セッションに必要なブラウザがありません。');
    if (!opts.provider) throw new Error('メール提供元は必須です。');

    this.sessionProperty = opts;
    this._isAuthenticated = true;
  }

  /**
   * Authenticated user's username.
   *
   * @member {string}
   */
  get username() {
    return this.sessionProperty.user.username;
  }

  /**
   * Authenticated user's email.
   *
   * @member {string}
   */
  get email() {
    return this.sessionProperty.user.email;
  }

  /**
   * Email provider to use.
   *
   * @member {EmailProvider}
   */
  get provider() {
    return this.sessionProperty.provider;
  }

  /**
   * Puppeteer Browser to use.
   *
   * @member {string}
   */
  get browser() {
    return this.sessionProperty.browser;
  }

  /**
   * Whether or not this session is currently authenticated with the given
   * email provider.
   *
   * @member {boolean}
   */
  get isAuthenticated() {
    return this._isAuthenticated;
  }

  /**
   * Signs out of this session.
   *
   * @return {Promise}
   */
  async signout() {
    if (!this.isAuthenticated) {
      return;
    }

    await this.provider.signout(this);
    this._isAuthenticated = false;
  }

  /**
   * Sends an email from this session.
   *
   * @param {object} email - TODO
   * @param {object} [opts] - Options
   *
   * @return {Promise}
   */
  async sendEmail(email, opts) {
    if (!this.isAuthenticated) {
      throw new Error(`"${this.email}" sendEmail not authenticated`);
    }

    return this.provider.sendEmail(this, email, opts);
  }

  /**
   * Fetches emails from the inbox of this session's account.
   *
   * @param {object} [opts] - Options
   * @param {object} [opts.query] - Search query to narrow down results
   *
   * @return {Promise<Array<Object>>}
   */
  async getEmails(opts) {
    if (!this.isAuthenticated) {
      throw new Error(`"${this.email}" getEmails not authenticated`);
    }

    return this.provider.getEmails(this, opts);
  }

  /**
   * Closes the underlying Puppeteer Browser instance, effectively ending this
   * session.
   *
   * @return {Promise}
   */
  async close() {
    return this.browser.close();
  }
}

export default EmailSession;
