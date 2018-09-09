import delay from 'delay';
import log from 'electron-log';

const signin = async (user, opts) => {
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

  log.info('--------->login yahoo mail account--------->');
  log.info('-----------user----------');
  log.info(user);
  log.info('-------------------------');

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  try {
    await page.goto('https://www.yahoo.co.jp/');
    await page.waitFor('#srchtxtBg', { visible: true });
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo Japan トップページアクセス完了' 
      }).show();
    `);
    log.info('load: https://www.yahoo.co.jp');

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ログインリンクをクリック' 
      }).show();
    `);
    log.info('load: https://www.yahoo.co.jp');

    // ログインリンク
    await page.click('#pbhello > span > a');
    await page.waitFor('#unm');
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo ログインページへアクセス完了' 
      }).show();
    `);
    log.info('access: login page');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo ID入力開始' 
      }).show();
    `);

    await page.type('#username', user.username);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo ID入力完了' 
      }).show();
    `);
    log.info('input: yahoo ID');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'次へボタンをクリック' 
      }).show();
    `);
    await page.click('#btnNext');
    log.info('click: next button');
    await page.waitFor('#passwd', { visible: true, timeout: 5000 });
    const errorMsg = await page.$('#errMsg > p', el => el.textContent);
    if (errorMsg.length > 0) {
      throw new Error('Yahoo IDを確認してください。');
    }

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.type('#passwd', user.password);
    log.info('input password');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ログインボタンをクリック' 
      }).show();
    `);
    await page.click('#btnSubmit');
    log.info('click login button');

    await page.waitFor('#srchtxtBg', { visible: true });
    log.info('login yahoo');
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahooログイン完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールリンクをクリック' 
      }).show();
    `);
    await page.click('#mhi6th > a');
    log.info('click mail link');

    await page.waitFor('#ygmhlog');
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        timeout: 3000,
        type: 'success',
        layout: 'topLeft',
        text:'Yahoomメールログイン完了' 
      }).show();
    `);
    log.info('-----------yahoo mail login done------>');
  } catch (error) {
    log.error(`error:${error.toString()}`);
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`swal({
      title: 'エラー発生',
      text: 'エラーが発生しました。アカウントが削除されていないかを確認してください。',
      showCancelButton: false,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: '閉じる',
      cancelButtonText: 'ブラウザは、このまま',
      reverseButtons: true
    })`);
  }

  return browser;
};

export default signin;
