/* eslint-disable no-unused-vars,class-methods-use-this */
/**
 * Abstract base class for kugutsu email providers.
 */
class EmailProvider {
  /**
   * Provider name.
   *
   * @member {string}
   */
  get name() {
    throw new Error('email provider must override "name"');
  }

  /**
   * Creates a new email account using this provider.
   *
   * Some providers may require additional user information during signup.
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
   *
   * @param {object} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<EmailSession>}
   */
  async signup(user, opts) {
    throw new Error('email provider must override "signup"');
  }

  /**
   * Signs into an existing email account using this provider.
   *
   * You must specify either `user.username` for signin.
   *
   * Returns an email session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to sign into
   * @param {string} [user.username] - Username (implies email)
   * @param {string} [user.email] - Email (implies username)
   *
   * @param {object} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<EmailSession>}
   */
  async signin(user, opts) {
    throw new Error('email provider must override "signin"');
  }

  /**
   * Signs out of the given authenticated session using this provider.
   *
   * @param {EmailSession} session
   * @return {Promise}
   */
  async signout(session) {
    throw new Error('email provider must override "signout"');
  }

  /**
   * Sends an email from an authenticated session using this provider.
   *
   * @param {EmailSession} session
   * @param {object} email - Details of email to send
   * @param {object} [opts] - Options
   * @return {Promise}
   */
  async sendEmail(session, email, opts) {
    throw new Error('email provider must override "sendEmail"');
  }

  /**
   * Fetches emails visible from the inbox of an authenticated session using
   * this provider.
   *
   * @param {EmailSession} session
   * @param {object} [opts] - Options
   * @param {string} [opts.query] - Search query to narrow down results
   * @return {Promise<Array<Object>>}
   */
  async getEmails(session, opts) {
    throw new Error('email provider must override "getEmails"');
  }
}

export default EmailProvider;
