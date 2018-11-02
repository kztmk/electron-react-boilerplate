/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import getValidationLink from '../../../../emails/imap';
import clickByText from '../../../utils';
import antiCaptchaKey from '../../../../../database/antiCaptcha';
import { AntiCaptcha } from 'anticaptcha';

const waitRandom = () => Math.floor(Math.random() * 501);

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

  log.info('--------->create hatena blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Hatena login/signup page
    await page.goto(`http://www.hatena.ne.jp/`, { waitUntil: 'load' });
    log.info('access: http://www.hatena.ne.jp/');

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
        text:'[ユーザー登録]ボタンをクリック' 
      }).show();
    `);
    log.info('click [ユーザー登録]ボタンクリック');
    await page.click('.side_register');
    await page.waitForSelector('#username-input');

    // registration page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    // はてなID
    await delay(waitRandom());
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'はてなID入力開始' 
      }).show();
    `);
    await page.click('#username-input');
    await delay(waitRandom());
    await page.type('#username-input', blogInfo.accountId, {
      delay: waitRandom()
    });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'はてなID入力完了' 
      }).show();
    `);
    log.info(`hatenaId:${blogInfo.accountId}入力完了`);

    // password
    await delay(waitRandom());
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.click('#password-input');
    await delay(waitRandom());
    await page.type('#password-input', blogInfo.password, {
      delay: waitRandom()
    });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);
    log.info(`password:${blogInfo.password}入力完了`);

    // mailAddress
    await delay(waitRandom());
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    await page.click('#mail-input');
    await delay(waitRandom());
    await page.type('#mail-input', blogInfo.mailAddress, {
      delay: waitRandom()
    });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}入力完了`);
    await page.evaluate(`Noty.closeAll();`);

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
      const siteKey = await page.$eval(
        '.g-recaptcha',
        (el, attribute) => el.getAttribute(attribute),
        'data-sitekey'
      );
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
          const frame = await page
            .frames()
            .find(f =>
              f.url().indexOf('https://www.google.com/recaptcha/api2/')
            );

          if (!frame) {
            log.warn('google reCaptcha frame has not found.');
            throw new Error('google reCaptcha frame has not found.');
          }
          log.info('found response frame.');
          log.info(`response:${response.solution.gRecaptchaResponse}`);
          // #g-recaptcha-response
          await frame.$eval(
            '#g-recaptcha-response',
            (el, value) => (el.value = value),
            response.solution.gRecaptchaResponse
          );
        }
      } else {
        log.warn('antiCaptcha has no result.');
        throw new Error('antiCaptcha has no result.');
      }

      await page.click('#submit-button');
      log.info('click [入力内容を確認]');
    } catch (error) {
      // google captcha
      // captcha
      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      await page.evaluate(`swal({
      title: '手順',
      text: '「私は、ロボットではありません。」にチェックを入れて、[入力内容を確認]ボタンをクリックしてください。5分(300秒)を超えるとエラーになります。',
      showCancelButton: false,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: '閉じる',
      cancelButtonText: 'ブラウザは、このまま',
      reverseButtons: true
    })`);
    }
    await page.waitForSelector('#agreed_with_rules', { timeout: 300000 });
    log.info('はてな登録確認ページへアクセス');

    // confirmation page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'規約に同意するにチェック' 
      }).show();
    `);
    await page.click('#agreed_with_rules');
    log.info('check on: 規約に同意');
    await delay(500);

    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'成人または、親権者の同意にチェック' 
      }).show();
    `);
    await page.click('#is_adult_or_parents_approved');
    log.info('check on: 親権者に同意');
    await delay(800 + waitRandom());

    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'送信ボタンをクリック' 
      }).show();
    `);
    await page.click('#submit-button');
    await delay(2000);
    await page.waitFor('#title > h1');

    // 完了ページ
    const headMessage = await page.$eval('#title > h1', item => {
      return item.textContent;
    });
    log.info('仮登録完了ページ');

    // if (headMessage === 'はてなIDの登録が完了しました。') {
    //   log.info('HatenaID仮登録完了');
    // } else {
    //   log.warn('HatenaIDの完了ページが確認できません。');
    //   throw new Error('Hatena ID complete page not found.')
    // }

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
        log.warn('本登録用リンクが見つかりません。');
        throw new Error('registration link not found');
      }
    } catch (error) {
      log.warn('本登録用リンク取得中にエラーが発生しました。');
      log.warn(error.toString());

      await page.goto('https://tools.yoriki.cloud/enter_url/index.html', {
        waitUntil: 'load'
      });

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
    await page.waitForSelector('#container > h1');
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

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'はてなブログをクリック' 
      }).show();
    `);
    await page.click('a[href^="http://blog.hatena.ne.jp/guide"]');
    log.info('click はてなブログ');
    await page.waitFor('.guide-header-btn-wrapper');

    // はてなブログトップ
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[無料でブログをはじめる]をクリック' 
      }).show();
    `);
    await page.click('.guide-header-btn-wrapper > a');
    log.info('[無料でブログを始める]をクリック');
    await page.waitFor('input[name="id"]');

    // はてなブログ作成ページ
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[簡単ブログ作成]ページへアクセス' 
      }).show();
    `);

    log.info('簡単ブログ作成ページへアクセス');
    // select domain
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ドメインを選択開始' 
      }).show();
    `);
    await page.select(`select#domain`, blogInfo.detailInfo.domainValue);
    log.info(`ドメインを選択:${blogInfo.detailInfo.domainValue}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ドメインを選択完了' 
      }).show();
    `);

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
      const siteKey = await page.$eval(
        '.g-recaptcha',
        (el, attribute) => el.getAttribute(attribute),
        'data-sitekey'
      );
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
          const frame = await page
            .frames()
            .find(f =>
              f.url().indexOf('https://www.google.com/recaptcha/api2/')
            );

          if (!frame) {
            log.warn('google reCaptcha frame has not found.');
            throw new Error('google reCaptcha frame has not found.');
          }
          log.info('found response frame.');
          log.info(`response:${response.solution.gRecaptchaResponse}`);
          // #g-recaptcha-response
          await frame.$eval(
            '#g-recaptcha-response',
            (el, value) => (el.value = value),
            response.solution.gRecaptchaResponse
          );
        }
      } else {
        log.warn('antiCaptcha has no result.');
        throw new Error('antiCaptcha has no result.');
      }

      // input image src='/img/common/spacer.gif'
      await page.click('input[type="submit"]');
      log.info('click [上記の内容で登録]');
    } catch (error) {
      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      await page.evaluate(`swal({
      title: '手順',
      text: '「私は、ロボットではありません。」にチェックを入れて、[ブログを作成]ボタンをクリックしてください。時間制限はありません。',
      showCancelButton: false,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: '閉じる',
      cancelButtonText: 'ブラウザは、このまま',
      reverseButtons: true
    })`);
      log.info('Google captcha start');
    }
    await page.waitFor('.register-done-heading, #welcome-message', {
      timeout: 300000
    });
    const message = await page.$('.register-done-heading');

    if (message) {
      await clickByText(
        page,
        '\n' + '        無料でブログをはじめる\n' + '      '
      );
    }

    await page.waitFor('#welcome-message', { timeout: 0 });
    log.info('--------->はてなブログ作成完了');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[ブログ作成完了]ページへアクセス' 
      }).show();
    `);

    const configUrl = `https://blog.hatena.ne.jp/${blogInfo.accountId}/${blogInfo.accountId}.${blogInfo.detailInfo.domainValue}/config`;
    await delay(1000);

    await page.goto(configUrl, {until: 'load'});

/*
    // #globalheader #current-blog > span > a
    const frame = await page.frames().find(f => f.name() === 'globalheader');
    if (!frame) {
      log.warn('ブログヘッダが見つかりません。');
      throw new Error('ブログヘッダが見つかりません。');
    }

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトルをクリック'
      }).show();
    `);
    const myBlogLink = frame.$eval(
      '.current-blog-title',
      (el, attribute) => el.getAttribute(attribute),
      'href'
    );
    if (!myBlogLink) {
      log.warn('設定へのリンクが取得できません。');
      throw new Error('設定へのリンクが取得できません。');
    }
    await delay(1000);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'設定をクリック'
      }).show();
    `);
    await page.goto()
    log.info('click settings');
    await page.waitFor('#name');

*/

    // 設定ページ
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'設定ページへアクセス' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトルを入力開始' 
      }).show();
    `);
    await page.$eval('#name', (el, value) => (el.value = value), '');
    await delay(1000);
    await page.type('#name', blogInfo.title);
    log.info('input blog title');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトルを入力完了' 
      }).show();
    `);

    // #description
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログの説明を入力開始' 
      }).show();
    `);
    await page.$eval('#description', (el, value) => (el.value = value), '');
    await delay(1000);
    await page.type('#description', blogInfo.title);
    log.info('input description');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログの説明の入力完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'変更ボタンをクリック' 
      }).show();
    `);
    await page.click('input[type="submit"]');
    log.info('click save button');

    log.info('ブログ登録完了');
    // await page.click('#goto_admin > a');
    // log.info('click:管理ページへ');
    // await page.waitFor('#entry_title');
    // log.info('記事ページ');

    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    const closeConfirm = await page.evaluate(`swal({
      title: 'Hatenaブログの作成が完了しました。',
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
