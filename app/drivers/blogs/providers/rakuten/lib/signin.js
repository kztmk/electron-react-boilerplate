/* eslint-disable no-await-in-loop */
import delay from 'delay';
import clickByText from '../../../utils';
import log from 'electron-log';

const signin = async (blogInfo, opts) => {
  const { browser } = opts;

  let scriptDir = './app';
  log.info(`appPath:${process.env.NODE_APPPATH}`);
  if (process.env.NODE_ENV === 'production') {
    scriptDir = process.env.NODE_APPPATH;
    scriptDir = scriptDir.replace('app.asar', 'app.asar.unpacked');
  }
  const notyJsPath = `${scriptDir}/node_modules/noty/lib/noty.min.js`;
  const notyCssPath = `${scriptDir}/node_modules/noty/lib/noty.css`;
  const notyThemePath = `${scriptDir}/node_modules/noty/lib/themes/mint.css`;
  const swa2Js = `${scriptDir}/node_modules/sweetalert2/dist/sweetalert2.all.min.js`;
  const swa2Css = `${scriptDir}/node_modules/sweetalert2/dist/sweetalert2.min.css`;

  log.info('--------->login to  Rakuten blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Rakuten login/signup page
    await page.goto(`https://plaza.rakuten.co.jp/`, { waitUntil: 'load', timeout: 60000 });
    log.info('access: https://plaza.rakuten.co.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'楽天ブログ トップページアクセス完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'楽天ブログ トップページアクセス完了' 
      }).show();
    `);
    await clickByText(page, 'ログイン');
    log.info('click: login button');
    await page.waitFor('input[name="u"]');

    log.info('access: login page');
    // login page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'楽天ブログ ログインページアクセス完了' 
      }).show();
    `);

    // loginInner
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'楽天ID 入力開始' 
      }).show();
    `);
    await page.$eval('input[name="u"]', (el, value) => (el.value = value), '');
    await page.type('input[name="u"]', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'楽天ID 入力完了' 
      }).show();
    `);
    log.info(`input id: ${blogInfo.mailAddress}`);

    await delay(1000);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.$eval('input[name="p"]', (el, value) => (el.value = value), '');
    await page.type('input[name="p"]', blogInfo.password);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード 入力完了' 
      }).show();
    `);
    log.info(`input password: ${blogInfo.password}`);
    await delay(1000);

    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ログインボタンをクリック' 
      }).show();
    `);
    await page.click('input[value="ログイン"]')
    log.info('click: login button');
    await page.waitFor('#top');

    log.info('done: login')
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        timeout:3000,
        type: 'success',
        layout: 'topLeft',
        text:'Rakutenブログ ログイン完了' 
      }).show();
    `);
  } catch (error) {
    log.error(`error:${error.toString()}`);
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`Swal.fire({
      title: 'エラー発生',
      text: 'エラーが発生しました。タイムアウト、又は、アカウント削除を確認してください。',
      showCancelButton: false,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: '閉じる',
      cancelButtonText: 'ブラウザは、このまま',
      reverseButtons: true
    })`);
  }
};

export default signin;
