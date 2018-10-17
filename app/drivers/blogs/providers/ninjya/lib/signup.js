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

  log.info('--------->create ninjya blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Ninjya login/signup page
    await page.goto(`https://www.ninja.co.jp/`, { waitUntil: 'load' });

    log.info('access: https://www.ninja.co.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'忍者ブログ ログインページアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[新規ユーザー登録]ボタンをクリック' 
      }).show();
    `);
    log.info('click [新規ユーザー登録]ボタンクリック');
    await page.click('a[href^="/register"]');
    await page.waitForSelector('#email', { timeout: 5000 });

    // mailAddress input
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
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

    // click submit
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[この内容を送信]ボタンをクリック' 
      }).show();
    `);
    await page.click('#registTopSend');
    log.info('click: submit');

    await page.waitFor(2000);

    const messages = await page.$$('p');
    let existDoneMessage = false;
    for (let i = 0; i < messages.length; i += 1) {
      const msg = await (await messages[i].getProperty('textContent')).jsonValue();
      console.log(`msg:${msg}`);
      if (msg === '仮登録が完了しました。') {
        existDoneMessage = true;
      }
    }

    if (existDoneMessage) {
      log.info('NinjyaID仮登録完了');
    } else {
      log.warn('忍者-仮登録が出来ません。');
      throw new Error('忍者 仮登録に失敗');
    }

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

    let validationUrl = '';
    if (result) {
      validationUrl = result[0];
    } else {
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

    await page.waitForSelector('#password-input');
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

    await delay(1000);
    await page.evaluate(`Noty.closeAll();`);

    let isCaptchaError = true;
    let hasEntered = false;
    do {
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
      await page.$eval('#password-input', (el, value) => (el.value = value), '');
      await delay(500);
      await page.type(`#password-input`, blogInfo.password);
      log.info(`input password:${blogInfo.password}`);
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
        text:'パスワード(確認)入力開始' 
      }).show();
    `);
      await page.$eval('#password-confirm', (el, value) => (el.value = value), '');
      await delay(500);
      await page.type(`#password-confirm`, blogInfo.password);
      log.info(`input password confirm: ${blogInfo.password}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力完了' 
      }).show();
    `);

      if (!hasEntered) {
        await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'メールマガジン受信選択開始' 
      }).show();
    `);
        await page.click('#magazine-0');
        log.info('click: メールマガジン受信しない');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールマガジン受信選択完了' 
      }).show();
    `);
      }

      await page.focus('input[name="captcha[input]"]');
      await page.evaluate(`Noty.closeAll();`);

      await delay(500);
      await page.focus('#password-input');
      await delay(500);
      await page.evaluate(() => {window.scrollBy(0, 200)});
      await delay(500);

      await page.evaluate(`Noty.closeAll();`);

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      const captchaValue = await page.evaluate(`swal({
          title: '画像認証',
          text: '画像に文字・数字が正常に表示されない場合、空欄で認証ボタンをクリックしてください。',
          input: 'text',
          inputPlaceholder: '画像にある文字を入力',
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
      await page.focus('input[name="captcha[input]"]');
      await delay(500);
      await page.$eval('input[name="captcha[input]"]', (el, value) => (el.value = value), '');
      await page.type('input[name="captcha[input]"]', captchaValue.value, { delay: 240 });
      log.info(`input captcha:${captchaValue.value}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '画像承認キーワードへ[${captchaValue.value}]を入力完了'
      }).show();
    `);

      if (!hasEntered) {
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'利用規約に同意を選択開始' 
      }).show();
    `);
        await page.click('#registerInputRule');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'利用規約に同意を選択完了' 
      }).show();
    `);

        log.info('click: 利用規約に同意')
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'個人情報の取扱に同意を選択開始' 
      }).show();
    `);

      await page.click('#registerInputPrivacy');
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'個人情報の取扱に同意を選択完了' 
      }).show();
    `);
        hasEntered = true;
        log.info('click: 個人情報の取扱に同意')
      }
      await page.evaluate(`Noty.closeAll();`);

      await delay(1000);
      // button
      const submit = await page.$('#registerInputSend > input');
      const {x, y, width, hight} = await submit.boundingBox();
      await page.mouse.click(x + 10, y + 15 );
      // await page.focus('input[src^="/images/register/btn-regist.gif"]');
      // await page.click('input[src^="/images/register/btn-regist.gif"]');
      log.info('本登録ボタンをクリック');
      await delay(15000);
      await page.waitFor('#authimg, .ttl-registFinish');

      const h3Tags = await page.$$('h3.ttl-registFinish');
      if (h3Tags.length === 1) {
        isCaptchaError = false;
        log.info('忍者IDページを確認');
      }
    } while (isCaptchaError);

        // 完了ページ
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'忍者ツールズ登録完了' 
      }).show();
    `);


    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[サービス一覧へ]ボタンをクリック' 
      }).show();
    `);
    await delay(1000);
    await page.click('a[href="/home/"]');

    await page.waitFor('#main_block');

    // 管理ページ
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[サービス一覧からツールを作成してみよう]をクリック' 
      }).show();
    `);
    // const serviceButton = await page.$('img[src^="/images/home/btn-addTool-noTool.png"]');
    // const {x1, y1, width1, hight1} = await serviceButton.boundingBox();
    // await page.mouse.click(x1 + 10, y1 + 10);
    // await page.click('a[href^="/home/service"]');
    await page.goto('https://ninja.co.jp/home/service', {waitUntil: 'networkidle0'});
    log.info(`click: サービス一覧からツールを作成してみよう`);
    // await page.waitFor('#header_block > ul > li:nth-child(3)');

    // サービスを追加ページ
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'忍者ブログ サービスを作成リンクをクリック' 
      }).show();
    `);
    await page.click('a[href^="/home/blog/make"]');
    await page.waitFor('#main_block');

    // 忍者ブログ作成ページ
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'忍者ブログ作成ページへアクセス完了' 
      }).show();
    `);

    // blog title
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ツールの名前入力開始' 
      }).show();
    `);
    await page.type(`#name`, blogInfo.title);
    log.info(`input name of tools:${blogInfo.title}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ツールの名前入力完了' 
      }).show();
    `);
    log.info(`input title: ${blogInfo.title}`);

    // accountId
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'アカウント名入力開始' 
      }).show();
    `);
    await page.type('#account', blogInfo.accountId);
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'アカウント名入力開始' 
      }).show();
    `);
    log.info(`input accoutId: ${blogInfo.accountId}`);

    // domain
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ドメイン選択開始' 
      }).show();
    `);
    await page.select('select#domain', blogInfo.detailInfo.domainValue);
    log.info(`select: select ${blogInfo.detailInfo.domainValue}`);
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ドメイン選択完了' 
      }).show();
    `);

    // not adult site
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'「アダルトサイトではありません」にチェック' 
      }).show();
    `);
    await page.click('#adult');
    log.info('click: not adult site')
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'利用規約に同意するにチェック' 
      }).show();
    `);
    await page.click('#rule');

    isCaptchaError = true;
    do {
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      await page.focus('input[name="captcha[input]"]');
      await page.$eval('input[name="captcha[input]"]', (el, value) => (el.value = value), '');

      const captchaValue = await page.evaluate(`swal({
          title: '画像認証',
          text: '画像に文字・数字が正常に表示されない場合、空欄で認証ボタンをクリックしてください。',
          input: 'text',
          inputPlaceholder: '画像にある文字を入力',
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

      await page.type('input[name="captcha[input]"]', captchaValue.value, { delay: 240 });
      log.info(`input captcha:${captchaValue.value}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '画像承認キーワードへ[${captchaValue.value}]を入力完了'
      }).show();
    `);

      // await page.click('input[src^="/images/home/btn-make.gif"]');
      log.info('click: 作成ボタン')
      const finishButton = await page.$('input[src^="/images/home/btn-make.gif"]');
      if (!finishButton) {
        log.warn('can not found create button');
        throw new Error('作成ボタンが見つかりません。')
      }
      const {x2, y2, width2, height2} = await finishButton.boundingBox();
      await page.mouse.click(x2 +10, y2 +10);
      await delay(2000);
      await page.waitFor('.errorArea, #header_block > ul > li:nth-child(5)');

      const finish = await page.$('#header_block > ul > li:nth-child(5)');
      if (finish) {
        const message = await page.$eval('#main_block > h2', item => {
          return item.textContent;
        });

        if (message === '忍者ブログ作成完了') {
          log.info(message);
          isCaptchaError = false;
        }
      }
      log.warn('can not complete page')
    } while (isCaptchaError);

    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    const closeConfirm = await page.evaluate(`swal({
      title: 'Ninjyaブログの作成が完了しました。',
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
