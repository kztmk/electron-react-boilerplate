/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import clickByText from "../../../utils";

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

  log.info('--------->login to  hatena blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Hatena login/signup page
    await page.goto(`https://www.hatena.ne.jp/`, { waitUntil: 'load' });

    log.info('access: https://www.hatena.ne.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Hatenaブログ トップページアクセス完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ログインリンクをクリック' 
      }).show();
    `);
    await clickByText(page, 'ログイン');
    await page.waitFor('#login-name');

    // login page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'はてなID入力開始' 
      }).show();
    `);
    await page.type('#login-name', blogInfo.accountId);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'はてなID入力完了' 
      }).show();
    `);
    log.info(`HatenaId:${blogInfo.accountId}入力完了`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.type('input[name="password"]', blogInfo.password);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);
    log.info(`password:${blogInfo.password}入力完了`);

    await page.click('input[type="submit"]');
    await page.waitFor('#profile-image-profile');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        timeout:3000,
        type: 'success',
        layout: 'topLeft',
        text:'はてなブログ ログイン完了' 
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
