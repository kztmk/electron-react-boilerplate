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

  log.info('--------->create fc2 blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Fc2 login/signup page
    await page.goto(`https://fc2.com/login.php`, { waitUntil: 'load' });

    log.info('access: https://fc2.com/login.php');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'FC2ブログ ログインページアクセス完了' 
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
    await page.click('img[src="//static.fc2.com/share/fc2footermenu/blank.gif"]');
    await page.waitForSelector('#email', { timeout: 5000 });

    // mailAddress input & captcha
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
    await page.evaluate(`Noty.closeAll();`);
    // captcha
    let isCapchaError = true;
    do {
      let captchaValue = '';
      await page.evaluate('window.scrollTo(0, 200)');
      if (await page.$('.image-auth > img')) {
        await page.waitFor('.image-auth > img', { visible: true });
      }
      await delay(1000);

      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'画像認証入力待ち',
        killer: true
      }).show();
    `);

      await page.focus('#auth_number');
      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });
      await page.evaluate(`Noty.closeAll();`);
      captchaValue = await page.evaluate(`swal({
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

      await page.type('#auth_number', captchaValue.value, { delay: 100 });
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
        text:'[利用規約に同意しFC2IDへ登録する]をクリック' 
      }).show();
    `);
      await page.click('input[name="Submit2"]');
      log.info('[利用規約に同意しFC2IDへ登録する]をクリック');

      await page.waitFor('.signup_attention_msg, .sh_heading_main_b');

      const successMessege = await page.$('.sh_heading_main_b');

      if (successMessege) {
        isCapchaError = false;
      }
    } while (isCapchaError);

    log.info('FC2ID仮登録完了');

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
      await page.waitForSelector('#pass1');
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
        text:'パスワード入力開始' 
      }).show();
    `);
      await page.type(`#pass1`, blogInfo.password);
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
      await page.type(`#pass2`, blogInfo.password);
      log.info(`input password confirm`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力完了' 
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
        await page.select('#sex', 'male');
        log.info('select gender male');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[男性]選択完了' 
      }).show();
    `);
      } else {
        await page.select('#sex', 'female');
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
      await page.select(`#select_question`, blogInfo.detailInfo.questionValue);
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
      await page.type(`#answer`, blogInfo.detailInfo.answerValue);
      log.info(`input answer:${blogInfo.detailInfo.answerValue}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'質問の答え入力完了' 
      }).show();
    `);
      const birthDateParts = blogInfo.birthDate.split('/');
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[月]-選択開始' 
      }).show();
    `);
      const mm = parseInt(birthDateParts[1], 10).toString();
      await page.select(`#birthday_mm`, mm);
      log.info(`split birth date:${birthDateParts[0]}`);
      log.info(`input birth month:${mm}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[月]-選択完了' 
      }).show();
    `);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[日]-選択開始' 
      }).show();
    `);
      const dd = parseInt(birthDateParts[2], 10).toString();
      await page.select(`#birthday_dd`, dd);
      log.info(`input birth date:${dd}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[日]-選択完了' 
      }).show();
    `);
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'郵便番号入力開始' 
      }).show();
    `);
      await page.type(`#zip`, blogInfo.postalCode);
      log.info(`input postalCode:${blogInfo.postalCode}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'郵便番号入力完了' 
      }).show();
    `);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'登録ボタンクリック' 
      }).show();
    `);
      await page.click('#enter > input[type="submit"]');
      log.info('click:登録ボタン');

      // FC2ID登録完了ページ
      await page.waitFor('.sh_heading_main_b');
      const successMessage = await page.$eval('.sh_heading_main_b', item => item.textContent);

      if (successMessage === 'FC2IDの登録完了') {
        log.info('FC2ID登録完了');
        // サービスの追加リンクをクリック
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'FC2ID本登録完了' 
      }).show();
    `);

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サービス追加リンクをクリック' 
      }).show();
    `);
        await page.click('a[href^="https://secure.id.fc2.com/add.php"]');
        log.info('サービス追加リンクをクリック');
        // サービス追加ページ
        await page.waitFor('.sh_heading_main_b');
        successMessege = await page.$eval('.sh_heading_main_b', item => item.textContent);

        if (successMessege === 'サービスの追加') {
          log.info('サービス追加ページへアクセス完了');
          await page.addScriptTag({ path: notyJsPath });
          await page.addStyleTag({ path: notyCssPath });
          await page.addStyleTag({ path: notyThemePath });
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[サービス追加ページ]アクセス完了' 
      }).show();
    `);
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログを追加ボタンをクリック' 
      }).show();
    `);

          // ブログを追加
          await page.click(
            '#service_body > dl.service_blog > dd.service_button > form > input[type="submit"]:nth-child(2)'
          );
          log.info('click:ブログを追加ボタン');
          await page.waitFor('#topicpath');

          await page.addScriptTag({ path: notyJsPath });
          await page.addStyleTag({ path: notyCssPath });
          await page.addStyleTag({ path: notyThemePath });
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[ブログ情報入力ページ]アクセス完了' 
      }).show();
    `);
          log.info('ブログ-ユーザ情報入力ページ');
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログID入力開始' 
      }).show();
    `);
          await page.type('#id', blogInfo.accountId);
          log.info(`input: blogID:${blogInfo.accountId}`);
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログID入力完了' 
      }).show();
    `);
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトル入力開始' 
      }).show();
    `);
          await page.type('#blog_title > input', blogInfo.title);
          log.info(`input blog title:${blogInfo.title}`);
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトル入力完了' 
      }).show();
    `);
          await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ジャンル入力開始' 
      }).show();
    `);
          await page.select('#janre_list', blogInfo.detailInfo.mainJunreValue);
          log.info('select main junre');
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ジャンル入力完了' 
      }).show();
    `);
          await delay(1000);
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サブジャンル入力開始' 
      }).show();
    `);
          await page.select('#subjanre_list', blogInfo.detailInfo.subJunreValue);
          log.info('select sub junre');
          await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サブジャンル入力完了' 
      }).show();
    `);

          await page.evaluate(`Noty.closeAll();`);
          let captchaError = true;

          do {
            let captchaValue = '';
            await page.addScriptTag({ path: notyJsPath });
            await page.addStyleTag({ path: notyCssPath });
            await page.addStyleTag({ path: notyThemePath });

            await page.focus('#auth_answer_focus');

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
            await page.$eval('#auth_answer_focus', (el, value) => (el.value = value), '');

            await page.type('#auth_answer_focus', captchaValue.value, { delay: 240 });
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
        text: '[利用規約に同意して登録する]ボタンをクリック'
      }).show();
    `);
            await page.click('#submit');
            log.info('click:[利用規約に同意して登録する]');
            // --loop

            await page.waitFor('#thankyou, .style_error');
            const checkSuccess = await page.$('#thankyou');
            if (checkSuccess) {
              captchaError = false;
            }
          } while (captchaError);

          log.info('ブログ登録完了');
          await page.click('#goto_admin > a');
          log.info('click:管理ページへ');
          await page.waitFor('#entry_title');
          log.info('記事ページ');

          await page.addStyleTag({ path: swa2Css });
          await page.addScriptTag({ path: swa2Js });

          const closeConfirm = await page.evaluate(`swal({
      title: 'FC2ブログの作成が完了しました。',
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
          log.warn('サービス追加ページが確認できません。');
          throw new Error('サービス追加ページが確認できません。');
        }
      } else {
        log.warn('FC2IDの登録完了ページが確認できません。');
        throw new Error('FC2IDの登録完了ページが確認できません。');
      }
    } else {
      throw new Error('本登録URLの取得に失敗しました。');
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
