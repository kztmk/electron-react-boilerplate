/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';

const signup = async (user, opts) => {
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

  log.info('--------->create gmail account--------->');
  log.info('-----------user----------');
  log.info(user);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });
  await page.setBypassCSP(true);

  log.info('create: browser page');
  try {
    // Yahoo! Japan top page
    await page.goto(`https://accounts.google.com/SignUp?hl=ja`, { waitUntil: 'load' });

    log.info('https://accounts.google.com/SignUp?hl=ja');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Googleアカウント作成ページアクセス完了' 
      }).show();
    `);

    // last name
    // -------
    let error = '';
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'姓入力開始' 
      }).show();
    `);
    await page.type('#lastName', user.lastName, { delay: 9 });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'姓入力完了' 
      }).show();
    `);
    await delay(250);

    log.info(`input:[lastName]-${user.lastName}`);

    // first name
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名入力開始',
        killer: true
      }).show();
    `);
    await page.type('#firstName', user.firstName, { delay: 5 });
    log.info(`input:[firstName]-${user.firstName}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名入力完了' 
      }).show();
    `);

    // user name
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ユーザー名入力開始' 
      }).show();
    `);
    await page.type('#username', user.username, { delay: 45 });
    log.info(`input:[username]-${user.username}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ユーザー名入力完了' 
      }).show();
    `);

    // password
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' ,
        killer: true
      }).show();
    `);
    await page.type('input[name="Passwd"]', user.password, { delay: 33 });
    log.info(`input:[password]-${user.password}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);

    // password confirm
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード確認入力開始' ,
        killer: true
      }).show();
    `);
    await page.type('input[name="ConfirmPasswd"]', user.password, { delay: 33 });
    log.info(`input:[password]-${user.password}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード確認入力完了' 
      }).show();
    `);

    /*
    // click next button
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'次へボタンをクリック' 
      }).show();
    `);
    await page.click('#accountDetailsNext');
    log.info(`click::[次へ]`);

    await page.waitForSelector('#year', { visible: true });
    await delay(1000);
    // input contact mail address
    if (user.contactMail.length > 0) {
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'再設定用メールアドレス入力開始',
        killer: true
      }).show();
    `);

      await page.focus(
        '#view_container > form > div.mbekbe.bxPAYd > div > div.fQxwff.cDSmF > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input'
      );
      await page.type(
        '#view_container > form > div.mbekbe.bxPAYd > div > div.fQxwff.cDSmF > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input',
        user.contactMail,
        { delay: 20 }
      );
      log.info('input:[再設定用メールアドレス]');

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'再設定用メールアドレス入力完了' 
      }).show();
    `);
    }

    // imput birth year
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日(年)入力開始' ,
        killer: true
      }).show();
    `);
    await page.type('#year', user.birthday.year, { delay: 33 });
    log.info(`input:[year]-${user.birthday.year}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日(年)入力完了' 
      }).show();
    `);

    // imput birth month
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日(月)入力開始' ,
        killer: true
      }).show();
    `);
    await page.select('select#month', user.birthday.month, { delay: 33 });
    log.info(`input:[month]-${user.birthday.month}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日(月)入力完了' 
      }).show();
    `);

    // imput birth day
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日(日)入力開始' ,
        killer: true
      }).show();
    `);
    await page.type('#day', user.birthday.day, { delay: 33 });
    log.info(`input:[day]-${user.birthday.day}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日(日)入力完了' 
      }).show();
    `);

    // gender
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'性別入力開始',
        killer: true
      }).show();
    `);
    if (user.gender) {
      await page.select('#gender', '2'); // 女性
      log.info(`input:[性別]-女性`);
    } else {
      await page.select('#gender', '1'); // 男性
      log.info(`input:[性別]-男性`);
    }
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'性別入力完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問の答え入力開始' 
      }).show();
    `);
    await page.click('#personalDetailsNext');
    log.info(`click:[次へ]`);

    await page.click('#termsofserviceNext');

    await page.waitForSelector('a[href^="accounts.google.com/SignOutOptions]');

    await page.click('#13');
    */
    await page.evaluate('Noty.closeAll();');
    log.info('<--------- done gmail account<---------');
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`swal({
      title: '以降は、手動で続けてください。',
      text: 'これ以降を自動で進めますと電話番号認証が必要になります。Gmail情報は保存してあります。',
      showCancelButton: false,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: '閉じる'
    })`);
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

export default signup;
