/* eslint-disable indent */
// @flow
import { app, ipcRenderer, Menu, shell } from "electron";
import fs from 'fs';
import findLogPath from 'electron-log/lib/transports/file/find-log-path';
import openAboutWindow from 'electron-about-window';
import { join } from 'path';


function setAppMenu(options) {
  /*
export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }
*/
  let template = '';
  if (process.platform === 'darwin') {
    template = buildDarwinTemplate(options);
  } else {
    template = buildDefaultTemplate(options);
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // return menu;
}

/*
  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }
  */

function buildDarwinTemplate(options) {
  const subMenuAbout = {
    label: 'Yoriki-v5',
    submenu: [
      {
        label: '寄騎v5について',
        click: () => {
          openAboutWindow({
            icon_path: join(__dirname, '1024x1024.png'),
            product_name: '寄騎-',
            description: `アフィリエイト最強兵器`,
            use_version_info: false,
            copyright: 'Copyright (c) 2018 TMK Solutions, Inc.',
            package_json_dir: __dirname
          })
        }
      },
      { type: 'separator' },
      { label: 'Services', submenu: [] },
      { type: 'separator' },
      { label: '寄騎version5を隠す', accelerator: 'Command+H', selector: 'hide:' },
      {
        label: '他を隠す',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      },
      { label: 'すべてを表示', selector: 'unhideAllApplications:' },
      { type: 'separator' },
      {
        label: '寄騎version5を終了',
        accelerator: 'Command+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  };
  const subMenuFile = {
    label: 'ファイル',
    submenu: [
      {
        label: 'エクスポート',
        submenu:[
          {
            label: 'メールアドレスデータを書出す',
            click: () => options.saveAsNewFileToExportMailAccount()
          },
          {
            label: 'ブログデータを書出す',
            click: () => options.saveAsNewFileToExportBlogAccount()
          }
        ]
      }
    ]
  };
  const subMenuViewDev = {
    label: '表示',
    submenu: [
      {
        label: 'Reloadx',
        accelerator: 'Command+R',
        click: () => {
          mainWindow.webContents.reload();
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click: () => {
          mainWindow.toggleDevTools();
        }
      },
      {
        label: 'ログファイルを表示',
        click: () => {
          console.log(`__dirname:${__dirname}`);
          const myLogFilePath = `${app.getPath('documents')}/yoriki-v5/log.txt`;
          console.log(`dist dir:${myLogFilePath}`)
          console.log(`log file path:${findLogPath()}`);
          fs.copyFileSync(findLogPath(), myLogFilePath);
          shell.openItem(myLogFilePath);
        }
      }
    ]
  };
  const subMenuViewProd = {
    label: '表示',
    submenu: [
      {
        label: 'ログファイルを表示',
        click: () => {
          const myLogFilePath = `${app.getPath('documents')}/yoriki-v5/log.txt`;
          console.log(`dist dir:${myLogFilePath}`)
          console.log(`log file path:${findLogPath()}`);
          fs.copyFileSync(findLogPath(), myLogFilePath);
          shell.openItem(myLogFilePath);
        }
      }
    ]
  };
  const subMenuHelp = {
    label: 'ヘルプ',
    submenu: [
      {
        label: 'サポートサイトを開く',
        click() {
          shell.openExternal('https://support.yoriki.cloud/');
        }
      },
      {
        label: 'オンライン・マニュアルを開く',
        click() {
          shell.openExternal('https://manual.yoriki.cloud/');
        }
      }
    ]
  };
  const subMenuView =
    process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

  return [subMenuAbout, subMenuFile, subMenuView, subMenuHelp];
}

function buildDefaultTemplate(options) {
  return [
    {
      label: 'ファイル(&F)',
      submenu: [
        {
          label: 'エクスポート',
          submenu:[
            {
              label: 'メールアドレスデータを書出す',
              click: () => options.saveAsNewFileToExportMailAccount()
            },
            {
              label: 'ブログデータを書出す',
              click: () => options.saveAsNewFileToExportBlogAccount()
            }
          ]
        },
        {
          label: '閉じる(&X)',
          accelerator: 'Ctrl+W',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '表示(&V)',
      submenu:
        process.env.NODE_ENV === 'development'
          ? [
              {
                label: '&Reloadxx',
                accelerator: 'Ctrl+R',
                click: () => {
                  mainWindow.webContents.reload();
                }
              },
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  mainWindow.setFullScreen(
                    !mainWindow.isFullScreen()
                  );
                }
              },
              {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                  mainWindow.toggleDevTools();
                }
              }
            ]
          : [
              {
                label: 'ログを表示',
                  click: () => {
                    const myLogFilePath = `${app.getPath('documents')}/yoriki-v5/log.txt`;
                    console.log(`dist dir:${myLogFilePath}`)
                    console.log(`log file path:${findLogPath()}`);
                    fs.copyFileSync(findLogPath(), myLogFilePath);
                    shell.openItem(myLogFilePath);
                }
              }
            ]
    },
    {
      label: 'ヘルプ',
      submenu: [
        {
          label: 'サポートサイトを開く',
          click() {
            shell.openExternal('#');
          }
        },
        {
          label: 'オンライン・マニュアルを開く',
          click() {
            shell.openExternal('#');
          }
        },
        {
          label: '寄騎v5について',
          click: () => {
            console.log(`__dirname:${__dirname}`);
            openAboutWindow({
              icon_path: join(__dirname, '../resources/icons', '1024x1024.png'),
              description: 'アフィリエイト最強兵器',
              use_version_info: false,
              copyright: 'Copyright (c) 2018 TMK Solutions, Inc.',
              package_json_dir: __dirname
            })
          }
        }
      ]
    }
  ];
}


export default setAppMenu;
