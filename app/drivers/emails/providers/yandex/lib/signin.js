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

  log.info('--------->login yandex account--------->');
  log.info('-----------user----------');
  log.info(user);
  log.info('-------------------------');

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });
  await page.setBypassCSP(true);
  try {
    await page.goto('https://mail.yandex.com/', { waitUntil: 'load' });
    log.info('---access to yandex mail top page ---');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yandex Mail  トップページアクセス完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ログインボタンをクリック' 
      }).show();
    `);
    await page.click('a[href^="https://passport.yandex.com/auth?"]');
    log.info('click: login link');
    await page.waitForSelector('input[name=login]');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ログインページへアクセス完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    // +以降と@の間を削除
    let yandexBase = user.username.replace(/@.*$/, '');
    yandexBase = yandexBase.replace(/\+.*$/, '');
    await page.type('input[name=login]', yandexBase, { delay: 40 });
    delay(500);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`input: yandex mail address--${yandexBase}`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);

    await page.focus('input[name=passwd]');
    await page.type('input[name=passwd]', user.password, {delay: 120});

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);
    log.info(`input: yandex password--${user.password}`);

    const buttons = await page.$$('.passport-Button-Text');
    let didClickButton = false;
    for (let i = 0; i < buttons.length; i++) {
      const buttonText = await (await buttons[i].getProperty('textContent')).jsonValue();
      console.log(`button text:${buttonText}`);

      if (buttonText === 'Sign in') {
        log.info('click:[Sign in]ボタン');
        buttons[i].click();
        didClickButton = true;
        break;
      }
    }

    if (!didClickButton) {
      throw new Error('can not find Sign in button');
    }
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[Sign in]ボタンをクリック' 
      }).show();
    `);

    await page.waitFor('.mail-Page-Body');
    log.info('login yandex mail');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        timeout:3000,
        type: 'success',
        layout: 'topLeft',
        text:'Yandexログイン完了' 
      }).show();
    `);

    log.info('-----------yandex mail login done------>');
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
