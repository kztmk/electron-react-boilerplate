/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';

const signup = async (blogInfo, opts) => {
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

  log.info('--------->create Webnode blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });
  await page.setBypassCSP(true);

  log.info('create: browser page');
  try {
    // Webnode login/signup page
    await page.goto(`https://www.webnode.jp/`, { waitUntil: 'load' });
    log.info('access: https://www.webnode.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Webnode トップページアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[さあ、はじめよう]ボタンをクリック' 
      }).show();
    `);
    log.info('click [さあ、はじめよう]ボタンクリック');
    await page.click('.signup-submit');
    await page.waitForSelector('#registrantFullName', { visible: true });

    await delay(1000);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ウェブサイト名の入力開始' 
      }).show();
    `);
    await page.type('#registrantFullName', blogInfo.accountId);
    log.info(`サイト名：${blogInfo.accountId}を入力`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ウェブサイト名の入力完了' 
      }).show();
    `);

    await delay(500);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレスの入力開始' 
      }).show();
    `);
    await page.click('#signupUserEMail');
    await page.keyboard.press('ArrowRight');
    await delay(500);
    await page.keyboard.press('Backspace');
    await delay(500);
    await page.$eval('#signupUserEMail', (el, value) => (el.value = value), '');
    await page.type('#signupUserEMail', blogInfo.mailAddress);
    log.info(`input mailAddress:${blogInfo.mailAddress}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレスの入力完了' 
      }).show();
    `);

    await delay(500);
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'パスワードの入力開始' 
      }).show();
    `);
    await page.type('#signupUserPwd', blogInfo.password);
    log.info(`input password:${blogInfo.password}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワードの入力開始' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[登録&作成]ボタンをクリック' 
      }).show();
    `);
    await page.click('input[name="register"]');
    await page.waitFor('#stepArea1', { timeout: 120000 });

    log.info('access to Step1-どんなホームページを作成しますか？');
    await delay(1000);
    console.log('--wait 1sec');
    // page step1
    console.log('--step1-1');
    await delay(1000);

    console.log('--step1-2');
    await page.click('div.icon.branch');
    log.info('[ホームページ]をクリック');

    await page.waitFor('#stepArea2', { timeout: 120000 });

    // page step2
    log.info('access to Step2-テンプレートを選択');
    await delay(1500);

    console.log('start select template');
    await page.click('.category-selected');
    log.info('click 全てのテンプレート');
    await delay(1000);
    await page.evaluate((selector) => document.querySelector(selector).click(), '#category_blog');
    // await page.click('#category_blog');
    log.info('click ブログ')
    // await page.select('select#mBaseCategories', 'personal');
    await delay(2000);

    const templates = await page.$$('.template');
    console.log(`found templates: ${templates.length}`);
    try {
      if (templates.length > 0) {
        // const templateButton = await templates[0].$('div.template-buttons');
        const { x, y, width, height } = await templates[0].boundingBox();
        const buttonX = Math.round(x) + Math.round(width) -30;
        const buttonY = Math.round(y) + Math.round(height) -30
        console.log(`x:${x},y:${y},width:${width},height:${height}`);
        log.info(`テンプレート選択-buttonX:${buttonX}--buttonY:${buttonY}`);
        await page.mouse.move(buttonX, buttonY);
        await delay(800);
        await page.mouse.click(buttonX, buttonY);
      } else {
        log.warn('テンプレートが表示されません。');
        await page.evaluate(
          'alert("寄騎 Version5--テンプレートの選択に失敗しました。お手数ですが、手動でテンプレートを選択してください。")'
        );
        throw new Error('テンプレートが表示されません。');
      }
    } catch (error) {
      log.warn('テンプレートが表示されません。');
      await page.evaluate(
        'alert("寄騎 Version5--テンプレートの選択に失敗しました。お手数ですが、手動でテンプレートを選択してください。")'
      );
      throw new Error('テンプレートが表示されません。');
    }
    log.info('アカウント作成中');
    try {
      await page.waitFor('.wnd-welcome', { timeout: 60000 });
    } catch (error) {
        log.info('wait 90 sec, page reload');
        await page.reload();
    }
    log.info('home page create done');

    // admin page
    await delay(1000);
    await page.click('.wnd-start-button');
    log.info('click start button');
    await delay(1000);
    // https://www.webnode.com/ver/?h=770708c7e4a8ce7c397fe45693130d78ffdf35a9&l=ja&email=j.koizumi2@gmail.com

    // login http://www.webnode.com/?page_identifier=sign-in&lang_identifier=ja

    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    const closeConfirm = await page.evaluate(`Swal.fire({
      title: 'Webnodeブログの作成が完了しました。',
      text: 'ブラウザを閉じてもよろしいですか？',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: '閉じる',
      cancelButtonText: 'ブラウザは、このまま',
      reverseButtons: true
    })`);

    if (closeConfirm.value) {
      await page.close();
    }
  } catch (error) {
    log.error(`error:${error.toString()}`);
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`Swal.fire({
      title: 'エラー発生',
      text: 'エラーが発生しました。お手数ですが、手作業で続けていただくか、登録済みのアカウントを削除してください。',
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
