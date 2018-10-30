/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import getValidationLink from '../../../../emails/imap';

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
    await page.waitForSelector('#registrantFullName', {visible: true});

    await delay(1000);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ウェブサイト名の入力開始' 
      }).show();
    `);
    await page.type('#registrantFullName', blogInfo.accountId);
    log.info(`サイト名：${blogInfo.accountId}を入力`)
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
    log.info(`input mailAddress:${blogInfo.mailAddress}`)
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
     await page.click('input[name="register"]')
    await page.waitFor('#stepArea1', {timeout: 120000})

    log.info('access to Step1-どんなホームページを作成しますか？');
    await delay(1000);
    console.log('--wait 1sec');
     // page step1
    console.log('--step1-1');
    await delay(1000);

    console.log('--step1-2');
    await page.click('div.icon.branch');
    log.info('[ホームページ]をクリック');

    await page.waitFor('#stepArea2', {timeout: 120000});

    // page step2
    log.info('access to Step2-テンプレートを選択');
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Webnode STEP2アクセス完了' 
      }).show();
    `);

    const templates = await page.$$('.template');
    await delay(1000);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'1番目のテンプレートを選択' 
      }).show();
    `);
    const templateButton = await templates[0].$('div.template-buttons');
    const {x, y, width, height} = await templateButton.boundingBox();

    console.log(`x:${x},y:${y},width:${width},height:${height}`);
    await page.mouse.move(x+width-20, y+height -20);
    await delay(800);
    await page.mouse.click();

    await page.waitFor('.wnd-welcome', {timeout: 180000});
    log.info('home page create done');

    // admin page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Webnode ホームページ作成完了' 
      }).show();
    `);

    await delay(1000);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[編集をスタート]をクリック' 
      }).show();
    `);

    await page.click('.wnd-start-button');
    log.info('click start button');

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアカウントへアクセスします。' 
      }).show();
    `);

    // https://www.webnode.com/ver/?h=770708c7e4a8ce7c397fe45693130d78ffdf35a9&l=ja&email=j.koizumi2@gmail.com

    // login http://www.webnode.com/?page_identifier=sign-in&lang_identifier=ja

    // countdown page
    await page.goto('https://tools.yoriki.cloud/countdown/');
    log.info('メール到着60秒待機');
    await page.waitForSelector('#blind', { timeout: 70000 });

    // メールアカウントへのログイン情報
    const mailacc = {};
    mailacc.accountId = blogInfo.mailAccount.accountId;
    mailacc.mailAddress = blogInfo.mailAddress;
    mailacc.password = blogInfo.mailAccount.password;
    mailacc.provider = blogInfo.mailAccount.provider;
    mailacc.blogProvider = blogInfo.provider;
    log.info('本登録URLを取得');

    // メールアカウントへログインし、本登録URLを取得
    let validationUrl = '';
    try {
      const result = await getValidationLink(mailacc);

      if (result) {
        log.info(`本登録URL:${validationUrl}`);
        // 本登録URLへアクセス プロフィールの入力ページ
        [validationUrl] = result;
      } else {
        log.warn('本登録用リンクが見つかりません。')
        throw new Error('registration link not found')
      }
    } catch (error) {
      log.warn('本登録用リンク取得中にエラーが発生しました。')
      log.warn(error.toString());

      await page.goto('https://tools.yoriki.cloud/enter_url/index.html', { waitUntil: 'load' });

      const { value: url } = await page.evaluate(`
        swal({
          title: '本登録用リンクURLを貼付け',
          html: '<p>使用したメールアドレスにログインしてください。<span style="color: red;font-weight: bold;">本登録URLをコピー</span>して、以下のボックスへ貼りつけます。<b>OK</b>をクリックすると自動作成を続けます。</p><p><span style="color: red;font-weight: bold;">未入力でOK</span>をクリックすると<span style="color: red;font-weight: bold;">中止します。</span></p>',
          input: 'text',
          inputPlaceholder: '本登録URLを貼付け'
        })`);

      if (url) {
        console.log(`url: ${url}`);
        validationUrl = url;
        log.info(`set url: ${validationUrl}`);
      } else {
        await page.evaluate(`
        swal({
          title: '中止しました。',
          html: '<p>ブログの作成を中止しました。</p><p>ブログ一覧に登録されているデータを削除してください。</p>',
         })`);
        log.info('quit:');
        return;
      }
    }

      log.info(`本登録URL:${validationUrl}`);

      // 本登録URLへアクセス プロフィールの入力ページ
      await page.goto(validationUrl);
      await page.waitForNavigation();

      log.info('本登録URLへアクセス完了');

          await page.addStyleTag({ path: swa2Css });
          await page.addScriptTag({ path: swa2Js });

          const closeConfirm = await page.evaluate(`swal({
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

    await page.evaluate(`swal({
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
