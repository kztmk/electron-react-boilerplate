/* eslint global-require: 0, flowtype-errors/show-errors: 0 */
// TODO: need logging check electron-log or any other logger
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, ipcMain, Menu } from 'electron';
// import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import createMainWindow from './createMainWindow';
// import MenuBuilder from './menu';
import createFileManager from './utils/fileManager/createFileManager';
import showOpenFileDialog from './utils/dialogs/showOpenFileDialog';
import showSaveAsNewFileDialog from './utils/dialogs/showSaveAsNewFileDialog';
import setAppMenu from './menu';

let mainWindow = null;
let fileManager = null;

const shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
}

// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = 'info';
log.transports.file.level = 'info';
log.transports.file.maxSize = 1 * 1024 * 1024;
log.info('Yoriki-v5 starting...');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * FileOpenDialogの表示
 * ファイルの読込
 * 読み込んだtextをsendImportMailAccountでrendererWindowへ送信
 */
const openImportMailAccountFile = () => {
  showOpenFileDialog()
    .then(filePath => fileManager.readFile(filePath))
    .then(text => mainWindow.sendImportedMailAccount(text))
    .catch(error => mainWindow.sendImportedMailAccount(error.toString()));
};

/**
 * saveFileDialogの表示
 * 受取ったtextをfileManagerで書込
 */
const saveAsNewFileToErrorMailAccount = () =>
  Promise.all([showSaveAsNewFileDialog(), mainWindow.requestErrorMailJsonFile()])
    .then(([filePath, text]) => fileManager.saveFile(filePath, text))
    .catch(error => {
      console.log(error);
    });

/**
 * FileOpenDialogの表示
 * ファイルの読込
 * 読み込んだtextをsendImportBlogAccountでrendererWindowへ送信
 */
const openImportBlogAccountFile = () => {
  showOpenFileDialog()
    .then(filePath => fileManager.readFile(filePath))
    .then(text => mainWindow.sendImportedBlogAccount(text))
    .catch(error => mainWindow.sendImportedBlogAccount(error.toString()));
};

/**
 * saveFileDialogの表示
 * 受取ったtextをfileManagerで書込
 */
const saveAsNewFileToErrorBlogAccount = () =>
  Promise.all([showSaveAsNewFileDialog(), mainWindow.requestErrorBlogJsonFile()])
    .then(([filePath, text]) => fileManager.saveFile(filePath, text))
    .catch(error => {
      console.log(error);
    });

/**
 * Add event listeners...
 */
app.commandLine.appendSwitch('remote-debugging-port', '9222');
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  mainWindow = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = createMainWindow();
  fileManager = createFileManager();
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();
  setAppMenu();

  /**
   * rendererWindowsから呼ばれるリスナ
   */
  ipcMain.on('request-importMailAccount-action', (event, arg) => {
    openImportMailAccountFile();
  });

  ipcMain.on('request-errorMailAccount-export-action', (event, arg) => {
    console.log('call from render - open saveDialog');
    saveAsNewFileToErrorMailAccount();
  });

  ipcMain.on('request-importBlogAccount-action', (event, arg) => {
    openImportBlogAccountFile();
  });

  ipcMain.on('request-errorBlogAccount-export-action', (event, arg) => {
    console.log('call from render - open saveDialog');
    saveAsNewFileToErrorBlogAccount();
  });

  // autoUpdater.checkForUpdatesAndNotify();
});

process.env.NODE_APPPATH = app.getAppPath();

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

/*
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', info => {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', info => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', err => {
  sendStatusToWindow(`Error in auto-updater.  ${err}`);
});

autoUpdater.on('download-progress', progressObj => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
  logMessage = `${logMessage}  - Downloaded  ${progressObj.percent}%`;
  logMessage = `${logMessage}  (${progressObj.transferred}/${progressObj.total})`;
  sendStatusToWindow(logMessage);
});

autoUpdater.on('update-downloaded', info => {
  sendStatusToWindow('Update downloaded');
});

/**
 *   ここまでが追加したリスナ
 */

app.on('activate', (_e, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    mainWindow = createMainWindow();
  }
});
