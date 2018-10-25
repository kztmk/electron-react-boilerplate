/* eslint-disable indent */
// @flow
import { app, Menu, shell } from 'electron';
import fs from 'fs';
import findLogPath from 'electron-log/lib/transports/file/find-log-path';
import openAboutWindow from 'electron-about-window';
import { join } from 'path';

function setAppMenu() {
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
    template = buildDarwinTemplate();
  } else {
    template = buildDefaultTemplate();
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

function buildDarwinTemplate() {
  const subMenuAbout = {
    label: 'Yoriki-v5',
    submenu: [
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
            click: () => alert('coming soon')
          },
          {
            label: 'ブログデータを書出す',
            click: () => alert('coming soon')
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
          this.mainWindow.webContents.reload();
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click: () => {
          this.mainWindow.toggleDevTools();
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
          shell.openExternal('#');
        }
      },
      {
        label: 'オンライン・マニュアルを開く',
        click() {
          shell.openExternal('#');
        }
      }
    ]
  };
  const subMenuView =
    process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

  return [subMenuAbout, subMenuFile, subMenuView, subMenuHelp];
}

function buildDefaultTemplate() {
  return [
    {
      label: 'ファイル(&F)',
      submenu: [
        {
          label: 'エクスポート',
          submenu:[
            {
              label: 'メールアドレスデータを書出す',
              click: () => alert('coming soon')
            },
            {
              label: 'ブログデータを書出す',
              click: () => alert('coming soon')
            }
          ]
        },
        {
          label: '閉じる(&X)',
          accelerator: 'Ctrl+W',
          click: () => {
            this.mainWindow.close();
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
                  this.mainWindow.webContents.reload();
                }
              },
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  this.mainWindow.setFullScreen(
                    !this.mainWindow.isFullScreen()
                  );
                }
              },
              {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                  this.mainWindow.toggleDevTools();
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
        }
      ]
    }
  ];
}


export default setAppMenu;
