/* eslint-disable no-unused-vars,class-methods-use-this */
/**
 * Abstract base class for kugutsu blog providers.
 */
class BlogProvider {
  /**
   * Provider name.
   *
   * @member {string}
   */
  get name() {
    throw new Error('blog provider must override "name"');
  }

  /**
   * Creates a new blog account using this provider.
   *
   * Some providers may require additional blogInfo information during signup.
   *
   * Returns an blog session with the authenticated puppeteer browser.
   *
   * @param {object} blogInfo - User info for the account to create
   * @param {string} blogInfo.accountId - Username
   * @param {string} blogInfo.password - Password
   * @param {string} blogInfo.mailAddress - User's mailAddress
   * @param {string} blogInfo.title - User's family name
   * @param {string} blogInfo.desctiption - User's birthday
   * @param {object} blogInfo.detailInfo - information for create blog account
   *
   * @param {object} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<blogSession>}
   */
  async signup(blogInfo, opts) {
    throw new Error('blog provider must override "signup"');
  }

  /**
   * Signs into an existing blog account using this provider.
   *
   * You must specify either `blogInfo.blogInfoname` for signin.
   *
   * Returns an blog session with the authenticated puppeteer browser.
   *
   * @param {object} blogInfo - User info for the account to sign into
   * @param {string} [blogInfo.blogInfoname] - Username
   * @param {string} [blogInfo.password] - password
   *
   * @param {object} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<blogSession>}
   */
  async signin(blogInfo, opts) {
    throw new Error('blog provider must override "signin"');
  }

  /**
   * Signs out of the given authenticated session using this provider.
   *
   * @param {blogSession} session
   * @return {Promise}
   */
  async signout(session) {
    throw new Error('blog provider must override "signout"');
  }
}

export default BlogProvider;
