// @flow
import { BrowserWindow, ipcMain } from 'electron';

class MainWindow {
  constructor() {
    this.window = new BrowserWindow({
      show: false,
      width: 1024,
      height: 748,
      minWidth: 465
    });
    this.window.loadURL(`file://${__dirname}/app.html`);

    // @TODO: Use 'ready-to-show' event
    //   https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    this.window.webContents.on('did-finish-load', () => {
      if (!this.window) {
        throw new Error('"mainWindow" is not defined');
      }
      this.window.show();
      this.window.focus();
    });
    // if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    this.window.webContents.openDevTools();
    // }
  }

  /**
   * rendererWindowへテキスト受け取り用意完了の通知と受取り
   * @returns {Promise<any>}
   */
  requestErrorMailJsonFile() {
    return new Promise(resolve => {
      this.window.webContents.send('REQUEST_ERROR_MAIL_ACCOUNT_JSON');
      ipcMain.once('REPLY_ERROR_MAIL_ACCOUNT_JSON', (_e, text) => resolve(text));
    });
  }

  /**
   * rendererWindowへテキスト受け取り用意完了の通知と受取り
   * @returns {Promise<any>}
   */
  requestErrorBlogJsonFile() {
    return new Promise(resolve => {
      this.window.webContents.send('REQUEST_ERROR_BLOG_ACCOUNT_JSON');
      ipcMain.once('REPLY_ERROR_BLOG_ACCOUNT_JSON', (_e, text) => resolve(text));
    });
  }

  /**
   * rendererWindowへtextを送る
   * MailAddressListのリスナ向け
   * @param text
   */
  sendImportedMailAccount(text) {
    // text内のspace、改行を削除
    const jsonFile = text.replace(/\s/, '');
    this.window.webContents.send('SEND_IMPORTED_MAIL_ACCOUNT', jsonFile);
  }

  /**
   * rendererWindowへtextを送る
   * BlogListのリスナ向け
   * @param text
   */
  sendImportedBlogAccount(text) {
    const jsonFile = text.replace(/\s/, '');
    this.window.webContents.send('SEND_IMPORTED_BLOG_ACCOUNT', jsonFile);
  }
}

const createMainWindow = () => new MainWindow();

export default createMainWindow;
