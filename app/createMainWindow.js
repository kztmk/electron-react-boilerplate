// @flow
import { BrowserWindow, ipcMain } from 'electron';

class MainWindow {
  constructor() {
    this.window = new BrowserWindow({
      show: false,
      width: 1024,
      height: 980,
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

    this.window.webContents.openDevTools();
  }

  requestErrorMailJsonFile() {
    return new Promise(resolve => {
      this.window.webContents.send('REQUEST_ERROR_MAIL_ACCOUNT_JSON');
      ipcMain.once('REPLY_ERROR_MAIL_ACCOUNT_JSON', (_e, text) => resolve(text));
    });
  }

  requestErrorBlogJsonFile() {
    return new Promise(resolve => {
      this.window.webContents.send('REQUEST_ERROR_BLOG_ACCOUNT_JSON');
      ipcMain.once('REPLY_ERROR_BLOG_ACCOUNT_JSON', (_e, text) => resolve(text));
    });
  }

  sendImportedMailAccount(text) {
    // console.log(`send text:${text}`);
    const jsonfile = text.replace(/\s/, '');
    this.window.webContents.send('SEND_IMPORTED_MAIL_ACCOUNT', jsonfile);
  }

  sendImportedBlogAccount(text) {
    // console.log(`send text:${text}`);
    const jsonfile = text.replace(/\s/, '');
    this.window.webContents.send('SEND_IMPORTED_BLOG_ACCOUNT', jsonfile);
  }
}

const createMainWindow = () => {
  return new MainWindow();
};

export default createMainWindow;
