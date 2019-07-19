/* eslint-disable no-await-in-loop */
import delay from 'delay';
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

  log.info('--------->login to  cocolog blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Cocolog login/signup page
    await page.goto(`http://www.cocolog-nifty.com/`, { waitUntil: 'load' });

    log.info('http://www.cocolog-nifty.com/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ココログ トップページアクセス完了' 
      }).show();
    `);

    await delay(1000);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ログインボタンをクリック' 
      }).show();
    `);
    await page.click('a[href^="/login/"]');
    await page.waitFor('#username');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ココログ ログインページアクセス完了' 
      }).show();
    `);
    await delay(1000);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'@niftyユーザー名入力開始' 
      }).show();
    `);
    await page.type('#username', blogInfo.accountId);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'@niftyユーザー名入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.accountId}入力完了`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.type('#password', blogInfo.password);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);
    log.info(`password:${blogInfo.password}入力完了`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ログインボタンをクリック' 
      }).show();
    `);
    await page.click('p.button > input[value=ログイン]');
    await page.waitFor('a[href^="/t/app?__mode=logout"]');

    log.info('-------------> cocolog login done--')
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        timeout:3000,
        type: 'success',
        layout: 'topLeft',
        text:'ココログ ログイン完了' 
      }).show();
    `);
  } catch (error) {
    log.error(`error:${error.toString()}`);
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`Swal.fire({
      title: 'エラー発生',
      text: 'エラーが発生しました。お手数ですが、手作業で続けてください。',
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
