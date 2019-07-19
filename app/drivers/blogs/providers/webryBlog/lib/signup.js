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

  log.info('--------->create webryBlog blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  page.on('dialog', dialog => {
    console.log(dialog.message());
    log.info(`dialog:${dialog.message()}`);
    dialog.accept();
  })


  log.info('create: browser page');
  try {
    // WebryBlog login/signup page
    await page.goto(`https://webryblog.biglobe.ne.jp/`, { waitUntil: 'load' });
    log.info('access: https://webryblog.biglobe.ne.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'WebryBlogブログ トップページアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[新規登録]ボタンをクリック' 
      }).show();
    `);
    log.info('click [新規登録]ボタンクリック');
    await page.click('img[src^="/common/img/menu_btn_regist.gif"]');
    await page.waitForSelector('input[name="mailAddress"]');

    // サービス登録ページ
    // mailAddress input & captcha
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    // mail address
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    await page.type('input[name="mailAddress"]', blogInfo.mailAddress);
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
    let isCaptchaError = true;
    do {
      let captchaValue = '';
      await delay(1000);

      // when captcha error occurred, it needs script again
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });

      await page.focus('input[name="authString"]');
      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });
      await page.evaluate(`Noty.closeAll();`);
      captchaValue = await page.evaluate(`Swal.fire({
      title: '画像認証',
      text: '画像に文字・数字が正常に表示されない場合、空欄で認証ボタンをクリックしてください。',
      input: 'text',
      inputPlaceholder: '画像にある文字・数字を入力',
      confirmButtonText: '認証',
      position: 'top-start'
    })`);

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'画像認証へ[${captchaValue.value}]を入力開始' 
      }).show();
    `);

      await page.type('input[name="authString"]', captchaValue.value, { delay: 100 });
      log.info(`input:画像認証へ-${captchaValue.value}-を入力`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'画像認証へ[${captchaValue.value}]を入力完了' 
      }).show();
    `);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[次へ]をクリック' 
      }).show();
    `);
      const selector = 'input[src^="/images/regist/button_next.gif"]';
      await page.evaluate((selector) => document.querySelectorAll(selector)[1].click(), selector);
      log.info('[次へ]をクリック');

      await delay(2000);
      await page.waitFor('#container > h1');
      const successMessege = await page.$eval('#container > h1', item => {
        return item.textContent;
      })

      if (successMessege === '登録(案内メール送信)') {
        isCaptchaError = false;
      }
    } while (isCaptchaError);

    log.info('WebryBlog仮登録完了');

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
        Swal.fire({
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
        Swal.fire({
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
      await page.waitForSelector('#password');
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
        text:'パスワード入力開始' 
      }).show();
    `);
      await page.type(`#password`, blogInfo.password);
      log.info(`input password:${blogInfo.password}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);

      // gender
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'性別選択開始' 
      }).show();
    `);
      if (blogInfo.gender === 0) {
        await page.click('input[name="sex"][value="1"]');
        log.info('select gender male');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[男性]選択完了' 
      }).show();
    `);
      } else {
        await page.click('input[name="sex"][value="2"]');
        log.info('select gender female');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[女性]選択完了' 
      }).show();
    `);
      }

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
    await page.type(`#birth_Y`, birthDateParts[0]);
    log.info(`input birth year:${birthDateParts[0]}`);
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
      const mm = parseInt(birthDateParts[1], 10).toString();
      await page.select(`#birth_M`, mm);
      log.info(`input birth month:${mm}`);
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
      const dd = parseInt(birthDateParts[2], 10).toString();
      await page.select(`#birth_D`, dd);
      log.info(`input birth date:${dd}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[日]-選択完了' 
      }).show();
    `);

      // postal code
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'郵便番号入力開始' 
      }).show();
    `);
      await page.type('#post_1', blogInfo.postalCode.slice(0,3));
      log.info(`input postalCode:${blogInfo.postalCode.slice(0,3)}`);
      await page.type(`#post_2`, blogInfo.postalCode.slice(3));
      log.info(`input postalCode:${blogInfo.postalCode.slice(3)}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'郵便番号入力完了' 
      }).show();
    `);

      // domain http://accountId.at.webry.info/
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'希望URL入力開始' 
      }).show();
    `);
    await page.$eval('#domain', (el, value) => (el.value = value), '');
    await page.type(`#domain`, blogInfo.accountId);
    log.info(`input domain:${blogInfo.accountId}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'希望URL入力完了' 
      }).show();
    `);

    // title
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログ名入力開始' 
      }).show();
    `);
    await page.type(`input[name="blogname"]`, blogInfo.title);
    log.info(`input title:${blogInfo.title}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログ名入力完了' 
      }).show();
    `);

    // nickname
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ニックネーム入力開始' 
      }).show();
    `);
    await page.type(`input[name="nickname"]`, blogInfo.detailInfo.nickNameValue);
    log.info(`input nick name:${blogInfo.detailInfo.nickNameValue}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ニックネーム入力完了' 
      }).show();
    `);

      // button click /images/regist/button_confirm.gif
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[確認画面へ]ボタンクリック' 
      }).show();
    `);
    const selector = 'input[src^="/images/regist/button_confirm.gif"]';
    await page.evaluate((selector) => document.querySelector(selector).click(), selector);
      log.info('click:[確認画面へ]ボタン');

      await delay(2000);

    await page.waitFor('input[src^="/images/regist/button_submit.gif"]');


      // WebryBlog確認ページ
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'確認ページへアクセス完了' 
      }).show();
    `);
    await delay(2000);

      log.info('確認ページ')
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'申し込むボタンをクリック' 
      }).show();
    `);
      const selector2 = 'input[src^="/images/regist/button_submit.gif"]';
      await page.evaluate((selector2) => document.querySelector(selector2).click(), selector2);
      log.info('click submit');

      await page.waitFor('input[src^="/images/regist/button_write.gif"]');
          log.info('ブログ登録完了');
          // await page.click('#goto_admin > a');
          // log.info('click:管理ページへ');
          // await page.waitFor('#entry_title');
          // log.info('記事ページ');

          await page.addStyleTag({ path: swa2Css });
          await page.addScriptTag({ path: swa2Js });

          const closeConfirm = await page.evaluate(`Swal.fire({
      title: 'Webryブログの作成が完了しました。',
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
