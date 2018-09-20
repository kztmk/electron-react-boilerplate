/* eslint-disable no-await-in-loop */
import delay from 'delay';
import fs from 'fs';
import log from 'electron-log';
import tempy from 'tempy';
import getValidationLink from '../../../../emails/imap';

async function base64Encode(imgPath) {
  const bitmap = fs.readFileSync(imgPath);
  return Buffer.from(bitmap).toString('base64');
}

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

  log.info('--------->create livedoor blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // livedoor top page
    await page.goto(`http://blog.livedoor.com/guide/`, { waitUntil: 'load' });

    log.info('access: http://blog.livedoor.com/guide/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Livedoorブログ トップページアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[ブログをはじめる]ボタンをクリック' 
      }).show();
    `);
    log.info('click [ブログをはじめる]ボタンクリック');

    await page.click('a[href^="/signup/input?acode"]');
    await page.waitForSelector('#livedoor_id', { timeout: 5000 });

    // livedoor ユーザーの登録(無料)
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    // livedoor ID
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'livedoor ID入力開始' 
      }).show();
    `);
    await page.type('#livedoor_id', blogInfo.accountId);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'livedoor ID入力完了' 
      }).show();
    `);
    log.info(`livedoor ID:${blogInfo.accountId}入力完了`);

    // password
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.type('#password', blogInfo.password);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);
    log.info(`password:${blogInfo.password}入力完了`);
    await page.evaluate(`Noty.closeAll();`);

    // password confirm
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力開始' 
      }).show();
    `);
    await page.type('#password2', blogInfo.password);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力完了' 
      }).show();
    `);
    log.info(`password confirm:${blogInfo.password}入力完了`);

    // mail address
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    await page.type('#email', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}入力完了`);

    // click registerにて画像認証用ダイアログが表示
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ユーザー情報登録ボタンをクリック' 
      }).show();
    `);
    await page.click('input[value="ユーザー情報を登録"]');
    log.info('click: [ユーザー情報を登録]');

    // 画像認証が表示されるまで待機
    await page.waitForSelector('#captcha-img', { visible: true });
    delay(1000);

    // isCaptchaErrorがfalseになるまでLoop
    let isCaptchaError = true;
    do {
      // capthca
      let captchaValue = '';
      await page.focus('#captcha');
      log.info('画像認証入力用テキストボックスへフォーカス');
      const $img = await page.$('#captcha-img');
      const captchaPath = tempy.file({ extension: 'png' });
      // 画像をキャプチャ
      await $img.screenshot({
        path: captchaPath
      });
      log.info(`画像キャプチャ Path:${captchaPath}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'画像認証をキャプチャ' 
      }).show();
    `);
      // 1秒待機後に、closeボタンでダイアログを閉じる
      // 自前のダイアログが表示できないための回避策
      await delay(1000);
      await page.click('#close-button');

      // 入力用ダイアログ表示
      delay(500);
      await page.addStyleTag({ path: swa2Css });
      await page.addStyleTag({
        content:
          '.captchaImage{border:1px solid rgba(51,51,51,0.3);border-radius:12px;padding:10px 15px;'
      });
      await page.addScriptTag({ path: swa2Js });
      const imageData = await base64Encode(captchaPath);
      captchaValue = await page.evaluate(`swal({
        title: '画像認証',
        text: '画像に文字・数字が正常に表示されない場合、空欄で認証ボタンをクリックしてください。',
        imageUrl: 'data:image/jpg;base64,${imageData}',
        imageClass: 'captchaImage',
        input: 'text',
        confirmButtonText: '認証',
        allowOutsideClick: false
      })`);

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '${captchaValue.value}を入力' 
      }).show();
    `);

      // 再度、画像認証用ダイアログを表示させる
      await delay(500);
      await page.click('input[value="ユーザー情報を登録"]');
      await page.waitForSelector('#captcha', { visible: true });
      log.info('click: [ユーザー情報を登録]');
      // 画像認証を入力
      await page.type('#captcha', captchaValue.value, {
        delay: 40
      });
      log.info(`画像認証：${captchaValue}を入力`);
      await page.click('#commit-button');
      log.info('click: [完了]');
      // 完了、エラーのセレクター表示まで待機
      await page.waitFor('#captcha_msg, .done');

      // 完了セレクターをチェック
      const successMessage = await page.$('.done');

      if (successMessage) {
        log.info('captcha clear');
        isCaptchaError = false;
      } else {
        log.info('captcha error');
        // 次の画像が表示されるまで待機
        await delay(4000);
      }
    } while (isCaptchaError);

    // mail account へ
    log.info('livedoorブログ仮登録完了');

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
    const result = await getValidationLink(mailacc);

    if (result) {
      log.info(`本登録URL:${result[0]}`);
      // 本登録URLへアクセス プロフィールの入力ページ
      await page.goto(result[0]);

      await page.waitForSelector('#blogTitle');
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

      // blog title
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトル入力開始' 
      }).show();
    `);

      await page.$eval('#blogTitle', (el, value) => (el.value = value), '');
      await page.type('#blogTitle', blogInfo.title);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトル入力完了' 
      }).show();
    `);
      log.info(`blog title:${blogInfo.title}入力完了`);

      // domain使用
      if (blogInfo.detailInfo.useDomainValue) {
        await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ドメインを使用にチェック開始' 
      }).show();
    `);
        log.info('サブドメインを使用');
        await page.click('#forSubdomain');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サブドメインを使用にチェック完了' 
      }).show();
    `);
        log.info('checkbox: domain');

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サブドメイン入力開始' 
      }).show();
    `);
        await page.type('#sub', blogInfo.accountId);
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サブドメイン入力完了' 
      }).show();
    `);
        log.info('input: subdomain');

        await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ドメイン選択開始' 
      }).show();
    `);
        await page.select('#base', blogInfo.detailInfo.domainValue);
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ドメイン選択完了' 
      }).show();
    `);
        log.info('select subdomain');
      }

      // ブログを作成するボタン
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログを作成ボタンをクリック' 
      }).show();
    `);
      await page.click('input[value="ブログを作成する"]');
      await page.waitFor('a[href^="./article/edit"]');

      log.info('ブログ作成完了ページ');

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      const closeConfirm = await page.evaluate(`swal({
      title: 'Livedoorブログの作成が完了しました。',
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
    } else {
      throw new Error('本登録URLの取得に失敗しました。');
    }
  } catch (error) {
    const pageUrl = await page.url();

    if (pageUrl === 'https://tools.yoriki.cloud/getlinks/index.html') {
      // page blank errorへ
      await page.goto('https://tools.yoriki.cloud/getlinks/error.html', { waitUntil: 'load' });
    }
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
