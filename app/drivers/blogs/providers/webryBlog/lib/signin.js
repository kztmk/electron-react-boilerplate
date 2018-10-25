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

  log.info('--------->login to  webryblog blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Webryblog login/signup page
    await page.goto(`https://login.sso.biglobe.ne.jp/scpf_op/auth.php`, { waitUntil: 'load' });

    log.info('access: https://login.sso.biglobe.ne.jp/scpf_op/auth.php');

    // await page.addScriptTag({ path: notyJsPath });
    // await page.addStyleTag({ path: notyCssPath });
    // await page.addStyleTag({ path: notyThemePath });
    // await page.evaluate(`
    // new Noty({
    //     type: 'success',
    //     layout: 'topLeft',
    //     text:'ウェブリブログ トップページアクセス完了'
    //   }).show();
    // `);
    // await delay(1000);
    // await page.evaluate(`
    // new Noty({
    //     type: 'success',
    //     layout: 'topLeft',
    //     text:'[ログイン]ボタンをクリック'
    //   }).show();
    // `);
    // await page.click('img[src^="/common/img/menu_btn_login.jpg"]');
    // log.info('click login button');
    // await page.waitFor('#FLD_ID');

    // login page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ウェブリブログ ログインページアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    await page.type('#loginid', blogInfo.mailAddress, {delay: 80});
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}入力完了`);

    await delay(500);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.type('#biglobe_pw', blogInfo.password, {delay:120});
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
        text:'[ログイン]ボタンをクリック' 
      }).show();
    `);
    const selector = 'input[src^="/scpf_op/img/button_03.gif"]';
    await page.evaluate((selector) => document.querySelector(selector).click(), selector);
    log.info('click login button');
    await page.waitFor('#pf-bx');

    // login
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await delay(2000);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[マイページ]ボタンをクリック' 
      }).show();
    `);

    const frame = await page.frames().find(f => {
      console.log(`frameName:${f.name()}`);
      return f.name() === 'mbframe';
    });

    await frame.click('#hd-icn-member');
    log.info('マイページアイコンをクリック')
    await page.waitFor('img[src^="/images/common/icon/icon_logout.png"]');

    // my page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        timeout:3000,
        type: 'success',
        layout: 'topLeft',
        text:'Webryblogブログ ログイン完了' 
      }).show();
    `);
  } catch (error) {
    log.error(`error:${error.toString()}`);
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`swal({
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
