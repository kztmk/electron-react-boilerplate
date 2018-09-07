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

  log.info('--------->login gmail account--------->');
  log.info('-----------user----------');
  log.info(user);
  log.info('-------------------------');

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.setBypassCSP(true);
  try {
    await page.goto('https://mail.google.com/');
    log.info('---access to gmail login page ---');
    await page.waitFor('#identifierId');
    log.info('---done wait for---');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    log.info('call noty');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Googleログイン  トップページアクセス完了' 
      }).show();
    `);

    log.info('load: https://mail.google.com');

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    const gmailBase = user.email.replace(/\+.*@/, '@');
    await page.type('#identifierId', gmailBase);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'gmailアドレス入力完了' 
      }).show();
    `);
    log.info('input: gmail address');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'次へボタンをクリック' 
      }).show();
    `);

    await page.click('#identifierNext > content > span');
    log.info('click: next button');
    await page.waitFor('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', {
      visible: true,
      timeout: 5000
    });

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);

    await page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', user.password);
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
        text:'次へボタンをクリック' 
      }).show();
    `);

    await page.click('#passwordNext > content > span');
    log.info('click next button');

    await page.waitFor('a[href^="#inbox"]');
    log.info('login gmail');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Gmailログイン完了' 
      }).show();
    `);

    log.info('-----------gmail mail login done------>');
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
