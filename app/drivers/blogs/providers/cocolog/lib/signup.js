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

  log.info('--------->create cocolog blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Cocolog login/signup page
    await page.goto(`http://www.cocolog-nifty.com/`, { waitUntil: 'load' });

    log.info('access: http://www.cocolog-nifty.com/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ココログ ログインページアクセス完了' 
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
    await page.click('a[href^="/start/"]');
    await page.waitForSelector('img[src^="./images/btn_not_member.gif"]');

    // click not nifty member yet
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[まだ@nifty会員でない方はこちら]をクリック' 
      }).show();
    `);
    await page.click('img[src^="./images/btn_not_member.gif"]');
    await page.waitFor('#mail_address1');

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
    await page.type('#mail_address1', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}入力完了`);

    // mailAddress confirm
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス確認用入力開始' 
      }).show();
    `);
    await page.type('#mail_address2', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス確認入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}確認入力完了`);



    await page.evaluate(`Noty.closeAll();`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[個人情報の取扱いに同意し「メールアドレスを送信する」]をクリック' 
      }).show();
    `);
      await page.click('input[src^="/users/images/btn_submit_m.gif"]');
      log.info('[利用規約に同意しCocologIDへ登録する]をクリック');

      await page.waitFor('.cmpMail');
    log.info('CocologID仮登録完了');

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

    // https://signup.nifty.com/users/cgi-bin/msignup_cclg.cgi?T=PCSfWJzZo&M=j.koizumi2%40gmail.com
    let validationUrl = ''
    if (result) {
      log.info(`本登録URL:${result[0]}`);
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
      // 本登録URLへアクセス プロフィールの入力ページ

      await page.goto(validationUrl);
      await page.waitForSelector('#cruiser_id');
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

      // userId
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'@niftyユーザー名入力開始' 
      }).show();
    `);
    await page.type(`#cruiser_id`, blogInfo.accountId);
    log.info(`input @nifty user name:${blogInfo.accountId}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'@niftyユーザー名入力完了' 
      }).show();
    `);

    // nickname
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ニックネーム入力開始' 
      }).show();
    `);
    await page.type(`#cocolog_nickname`, blogInfo.detailInfo.nickNameValue);
    log.info(`input nickName: ${blogInfo.detailInfo.nickNameValue}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ニックネーム入力完了' 
      }).show();
    `);

    // subdomain
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ドメイン名入力開始' 
      }).show();
    `);
    await page.type(`#cocolog_domain`, blogInfo.accountId);
    log.info(`input domain:${blogInfo.accountId}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ドメイン名入力完了' 
      }).show();
    `);

    // postal code
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'郵便番号入力開始' 
      }).show();
    `);
    await page.type(`#post_code1`, blogInfo.postalCode);
    log.info(`input postalCode:${blogInfo.postalCode}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'郵便番号入力完了' 
      }).show();
    `);


    const birthDateParts = blogInfo.birthDate.split('/');
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[年]-入力開始' 
      }).show();
    `);
    await page.type(`#birthday_y`, birthDateParts[0]);
    log.info(`split birth date:${birthDateParts[0]}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[年]-入力完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[月]-入力開始' 
      }).show();
    `);
    const mm = parseInt(birthDateParts[1], 10);
    await page.type(`#birthday_m`, mm.toString());
    log.info(`split birth date:${mm.toString()}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[月]-入力完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[日]-入力開始' 
      }).show();
    `);
    const dd = parseInt(birthDateParts[2], 10).toString();
    await page.type(`#birthday_d`, dd);
    log.info(`input birth date:${dd}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[日]-入力完了' 
      }).show();
    `);

      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'性別選択開始' 
      }).show();
    `);
      if (blogInfo.gender === 0) {
        await page.click('#male');
        log.info('select gender male');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[男性]選択完了' 
      }).show();
    `);
      } else {
        await page.click('#female');
        log.info('select gender female');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[女性]選択完了' 
      }).show();
    `);
      }

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問選択開始' 
      }).show();
    `);
      await page.select(`select#secret_question`, blogInfo.detailInfo.questionValue);
      log.info(`select questions:${blogInfo.detailInfo.questionValue}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問選択完了' 
      }).show();
    `);
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'質問の答え入力開始' 
      }).show();
    `);
      await page.type(`#secret_answer`, blogInfo.detailInfo.answerValue);
      log.info(`input answer:${blogInfo.detailInfo.answerValue}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'質問の答え入力完了' 
      }).show();
    `);

      await page.focus('#password');
     await page.evaluate(() => {window.scrollBy(0, 100)});

    await page.evaluate(`Noty.closeAll();`);
    let captchaError = true;

    do {
      let captchaValue = '';
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });

      await page.evaluate(`
    new Noty({
        killer: true,
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
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力開始' 
      }).show();
    `);
      await page.type(`#WIdummy_password2`, blogInfo.password);
      log.info(`input password confirm`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力完了' 
      }).show();
    `);

      await page.focus('#password');
      await page.evaluate(() => {window.scrollBy(0, 100)});

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
      await page.$eval('#WIdummy_image_answer', (el, value) => (el.value = value), '');

      await page.type('#WIdummy_image_answer', captchaValue.value, { delay: 240 });
      log.info(`input captcha:${captchaValue.value}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '画像承認キーワードへ[${captchaValue.value}]を入力完了'
      }).show();
    `);

      await delay(1000);
      await page.click('input[src^="/users/images/btn_confirm.gif"]');

      await page.waitFor('#error', 'input[src^="/users/images/btn_entry.gif"]')

      const entryButton = await page.$('input[src^="/users/images/btn_entry.gif"]');

      if (entryButton) {
        captchaError = false
      }

    } while (captchaError)

     log.info('ココログ登録確認ページ');
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'上記の内容で[登録する]ボタンクリック' 
      }).show();
    `);
      await page.click('input[src^="/users/images/btn_entry.gif"]');
      log.info('click:登録ボタン');


      // CocologID登録完了ページ
      await page.waitFor('img[src^="/users/images/h2_step4_m.gif"]');

      log.info('CocologID登録完了');
      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      const closeConfirm = await page.evaluate(`swal({
      title: 'ココログの作成が完了しました。',
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
