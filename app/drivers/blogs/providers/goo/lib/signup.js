/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import getValidationLink from '../../../../emails/imap';
import AntiCaptcha from "anticaptcha";
import antiCaptchaKey from "../../../../../database/antiCaptcha";

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

  log.info('--------->create goo blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });
  await page.setDefaultNavigationTimeout(60000);

  log.info('create: browser page');
  try {
    // Goo login/signup page
    await page.goto(`https://blog.goo.ne.jp/`, { waitUntil: 'load' });
    log.info('access: https://blog.goo.ne.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'gooブログ ログインページアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[ブログ新規作成]ボタンをクリック' 
      }).show();
    `);
    log.info('click [ブログ新規作成]ボタンクリック');
    await page.click('img[src="https://blogimg.goo.ne.jp/img/portal/misc/blg_newentry.gif"]');
    await page.waitForSelector('.login_top');

    // mailaddress validation page
    // mailAddress input & captcha
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'goo新規作成ページにアクセス' 
      }).show();
    `);
    await delay(1000);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[gooIDを取得してブログを作成]ボタンをクリック' 
      }).show();
    `);

    await page.click('a[href^="https://login.mail.goo.ne.jp/id/portal/RegIDAndSvcStart"]')
    await page.waitFor('#MailAddress1');

    // mail address input page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'gooID新規登録ページにアクセス' 
      }).show();
    `);

    // mail address
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    await page.type('#MailAddress1', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}入力完了`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[登録を開始する]ボタンをクリック' 
      }).show();
    `);
    await page.click('#next');

    await delay(1000);
    await page.waitFor('#NR-wrapper-in > div > h2')

    const msg = await page.$eval('h2', item => {
      return item.textContent;
    });

    if (msg !== '2. メール確認') {
      log.warn('メール送信確認ページが見つかりません。');
      throw new Error('メール送信確認ページが見つかりません。')
    }
    log.info('GooID仮登録完了');

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
      await page.waitForSelector('#GooID');
      log.info('本登録URLへアクセス完了');
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'本登録URLへアクセス完了' 
      }).show();
    `);

      // password
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'gooID入力開始' 
      }).show();
    `);
      await page.type(`#GooID`, blogInfo.accountId);
      log.info(`input gooID:${blogInfo.accountId}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'gooID入力完了' 
      }).show();
    `);

      // pasword
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
      await page.type(`#Password`, blogInfo.password);
      log.info(`input password:${blogInfo.password}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);

      // birth date
      const birthDateParts = blogInfo.birthDate.split('/');
    // year
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[年]-選択開始' 
      }).show();
    `);
    await page.type(`#BirthDay_y`, birthDateParts[0]);
    log.info(`input birth month:${birthDateParts[0]}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[年]-選択完了' 
      }).show();
    `);
      // month
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[月]-選択開始' 
      }).show();
    `);
      await page.select(`select#BirthDay_m`, birthDateParts[1]);
      log.info(`input birth month:${birthDateParts[1]}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[月]-選択完了' 
      }).show();
    `);
      // date
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[日]-選択開始' 
      }).show();
    `);
      await page.select(`select#BirthDay_d`, birthDateParts[2]);
      log.info(`input birth date:${birthDateParts[2]}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[日]-選択完了' 
      }).show();
    `);


    // captcha
    try {
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'warning',
        layout: 'topLeft',
        text:'「私は、ロボットではありません。」を解決中...' 
      }).show();
    `);
      const AntiCaptchaAPI = new AntiCaptcha(antiCaptchaKey);

      const pageUrl = await page.url();
      const siteKey = await page.$eval('.g-recaptcha', (el, attribute) => el.getAttribute(attribute), 'data-sitekey');
      log.info('google reCaptcha found');

      console.log(`pageUrl:${pageUrl}`);
      console.log(`siteKay:${siteKey}`);
      if (!pageUrl || !siteKey) {
        throw new Error('can not get page url or siteKey');
      }
      log.info('start to resolve google reCaptcha');
      const taskId = await AntiCaptchaAPI.createTask(pageUrl, siteKey);
      const response = await AntiCaptchaAPI.getTaskResult(taskId);

      log.info('done resolver');
      console.log(response);

      await page.evaluate('Noty.closeAll()');
      if ('errorId' in response) {
        if (response.errorId === 0) {
          // set resolver to textarea
          const frame = await page.frames().find(f => f.url().indexOf('https://www.google.com/recaptcha/api2/'));

          if (!frame) {
            log.warn('google reCaptcha frame has not found.')
            throw new Error('google reCaptcha frame has not found.')
          }
          log.info('found response frame.');
          log.info(`response:${response.solution.gRecaptchaResponse}`);
          // #g-recaptcha-response
          await frame.$eval('#g-recaptcha-response', (el, value) => (el.value = value), response.solution.gRecaptchaResponse);
        }
      } else {
        log.warn('antiCaptcha has no result.')
        throw new Error('antiCaptcha has no result.');
      }

      // input image src='/img/common/spacer.gif'
      const selector = 'input[src^="/img/common/spacer.gif"]';
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);
      log.info('click [上記の内容で登録]')

    } catch (error) {

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      await page.evaluate(`swal({
      title: '手順',
      text: '「私は、ロボットではありません。」にチェックを入れて、[同意して登録する]ボタンをクリックしてください。5分(300秒)を超えるとエラーになります。',
      showCancelButton: false,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: '閉じる',
      cancelButtonText: 'ブラウザは、このまま',
      reverseButtons: true
    })`);
      log.info('Google captcha start');
    }

    await page.waitFor('#forward', {timeout: 300000});
    log.info('登録が完了しました。');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'登録完了ページへアクセス完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[サービスに戻る]ボタンをクリック' 
      }).show();
    `);
    await page.click('#forward');
    log.info('[サービスに戻る]ボタンをクリック');

    await page.waitFor('input[name="captcha_no"]');

    // http://blog.goo.ne.jp/mioi9i9
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'新規ブログ開設ページへアクセス完了' 
      }).show();
    `);

    await page.evaluate(`Noty.closeAll();`);
    let captchaError = true;

    // captcha
    do {
      let captchaValue = '';
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });

      await page.focus('input[name="captcha_no"]');

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      captchaValue = await page.evaluate(`swal({
          title: '画像認証',
          text: '画像に文字・数字が正常に表示されない場合、空欄で認証ボタンをクリックしてください。',
          input: 'text',
          inputPlaceholder: '画像にある数字を入力',
          confirmButtonText: '認証',
          position: 'top-start'
        })`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '画像承認キーワードへ[${captchaValue.value}]を入力開始'
      }).show();
    `);
      await page.$eval('input[name="captcha_no"]', (el, value) => (el.value = value), '');

      await page.type('input[name="captcha_no"]', captchaValue.value, { delay: 240 });
      log.info(`input captcha:${captchaValue.value}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '画像承認キーワードへ[${captchaValue.value}]を入力完了'
      }).show();
    `);
      await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text: '[利用規約に同意してブログを開設する]ボタンをクリック'
        }).show();
      `);
      const selector = 'input[src^="/img/portal/start.gif"]';
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);
      log.info('click:[利用規約に同意してブログを開設する]');

      throw new Error('ここまで');
      await page.waitFor('textarea[name="blog_name"]');
      // --loop
    } while (captchaError)

      // title page
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'タイトル設定ページへアクセス完了' 
      }).show();
    `);

      log.info('access title page');
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトルへ入力開始' 
      }).show();
    `);
      await page.type('textare[name="blog_name"]', blogInfo.title);
      log.info(`input title"${blogInfo.title}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトルへ入力完了' 
      }).show();
    `);

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログの概要へ入力開始' 
      }).show();
    `);
      await page.$eval('#blog_description_area', (el, value) => (el.value = value), '');
      await page.type('#blog_description_area', blogInfo.description);
      log.info(`input title"${blogInfo.description}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログの概要へ入力完了' 
      }).show();
    `);

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[保存して次へ]ボタンをクリック' 
      }).show();
    `);
      await page.click('input[type="submit"]')
      log.info('click save and next');

      await page.waitFor('#user_sign_area');

      // profile page
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'プロフィールページへアクセス完了' 
      }).show();
    `);
      log.info('access profile page')
      await delay(1000);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[保存して次へ]ボタンをクリック' 
      }).show();
    `);
      await page.click('input[type="submit"]')
      log.info('click save and next');

      await page.waitFor('input[name="skip"]');

      // 読者登録page
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'読者登録ページへアクセス完了' 
      }).show();
    `);

      await delay(1000);
      log.info('access follower adding page:')

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'スキップボタンをクリック' 
      }).show();
    `);

      await page.click('input[name="click"]');
      await page.waitFor('a[href^="/admin/newentry"]')

      log.info('gooブログ開設完了');

          await page.addStyleTag({ path: swa2Css });
          await page.addScriptTag({ path: swa2Js });

          const closeConfirm = await page.evaluate(`swal({
      title: 'Gooブログの作成が完了しました。',
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
