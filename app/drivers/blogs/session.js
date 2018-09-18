/**
 * Holds state for an authenticated kugutsu blog session.
 *
 * @param {object} opts - Options
 * @param {object} opts.user - Authenticated user
 * @param {string} opts.user.username - Authenticated user's username
 * @param {string} opts.user.password - Authenticated user's password
 * @param {object} opts.browser - Puppeteer Browser to use
 * @param {BlogProvider} opts.provider - Blog provider to use
 */
class BlogSession {
  constructor(opts) {
    if (!opts) throw new Error('プロパティは必須です。');
    if (!opts.blogInfo) throw new Error('ログイン情報は必須です。');
    if (!opts.blogInfo.accountId) throw new Error('ログインIDは必須です。');
    if (!opts.blogInfo.password) throw new Error('パスワードは必須です。');
    if (!opts.browser) throw new Error('セッションに必要なブラウザがありません。');
    if (!opts.provider) throw new Error('メール提供元は必須です。');

    this.sessionProperty = opts;
    this._isAuthenticated = true;
  }

  set isAuthenticated(status) {
    this._isAuthenticated = status;
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
   * blog provider.
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
    this.isAuthenticated = false;
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

export default BlogSession;
