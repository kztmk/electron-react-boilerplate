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

  log.info('--------->create yandex mail account--------->');
  log.info('-----------user----------');
  log.info(user);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });
  await page.setBypassCSP(true);

  log.info('create: browser page');
  try {
    // Yahoo! Japan top page
    await page.goto(`https://mail.yandex.com`, { waitUntil: 'load' });

    log.info('access: https://mail.yandex.com');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yandex Mail トップページアクセス完了' 
      }).show();
    `);

    // go to mail accout application form
    // click 'create mail account(メールアドレス取得)'
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Create an accountリンクをクリックしました。' 
      }).show();
    `);
    await page.click('a[href^="https://passport.yandex.com/registration/mail?"]');
    log.info('click: create an account link');
    await page.waitForSelector('#firstname');

    log.info('access: Registraiton form');
    // click 'create now(今すぐメールアドレスを作る)'
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'登録フォームページへアクセス完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名前を入力開始' 
      }).show();
    `);
    await page.type('#firstname', user.firstName, { delay: 9 }); // Firstname
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名前の入力完了' 
      }).show();
    `);
    await delay(250);
    log.info(`input:[Firstname]-${user.firstName}`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'姓の入力開始',
        killer: true
      }).show();
    `);
    await page.type('#lastname', user.lastName, { delay: 5 }); // Surname
    log.info(`input:[Surname]-${user.lastName}`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'姓の入力完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ログインIDの入力開始' 
      }).show();
    `);
    await page.type('#login', user.username, { delay: 45 }); // login
    log.info(`input:[login]-${user.username}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ログインIDの入力完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワードの入力開始' ,
        killer: true
      }).show();
    `);
    await page.type('#password', user.password, {
      delay: 33
    }); // password
    log.info(`input:[password]-${user.password}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワードの入力完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'パスワード確認の入力開始' 
      }).show();
    `);
    await page.type('#password_confirm', user.password, {
      delay: 50
    }); // password confirm
    log.info(`input:[Confirm password]-${user.password}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード確認の入力完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'携帯電話なしリンクをクリック',
        killer: true
      }).show();
    `);

    await page.click('.link_has-no-phone', { delay: 20 });
    log.info('click: I do not have telephone number');

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'携帯電話なしリンクをクリック完了' 
      }).show();
    `);

    await page.click('button[role="listbox"]');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問ドロップリスト表示をクリック',
        killer: true
      }).show();
    `);

    console.log(`==user question:${user.secret.question}`);
    const menuTexts = await page.$$('.menu__text');
    console.log(`find--text menu:${menuTexts.length}`);
    let didClickSecretQuestion = false;
    for (let i = 0; i < menuTexts.length; i++) {
      const textContent = await (await menuTexts[i].getProperty('textContent')).jsonValue();
      console.log('----text content--');
      console.log(textContent);

      if (textContent === user.secret.question) {
        log.info(`select: secret question:${user.secret.question}`);
        menuTexts[i].click();
        didClickSecretQuestion = true;
        break;
      }
    }

    if (!didClickSecretQuestion) {
      throw new Error('can not click secret question');
    }

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問選択完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問の答え入力開始' 
      }).show();
    `);
    await page.type('#hint_answer', user.secret.answer, { delay: 30 }); // password recovery answer
    log.info(`input:[秘密の答え]-${user.secret.answer}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問の答え入力完了' 
      }).show();
    `);
    // captcha
    // -------
    await delay(1500);
    let isCaptchaError = true;

    let captchaValue;
    do {
      captchaValue = '';
      await page.evaluate(`Noty.closeAll();`);
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'画像認証入力待ち',
        killer: true
      }).show();
    `);

      await page.focus('#captcha');
      await page.addStyleTag({ path: swa2Css });
      await page.addStyleTag({
        content:
          '.captchaImage{border:1px solid rgba(51,51,51,0.3);border-radius:12px;padding:10px 15px;'
      });
      await page.addScriptTag({ path: swa2Js });
      await page.evaluate('Noty.closeAll();');
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

      await page.focus('#captcha');
      await page.$eval('#captcha', (el, value) => (el.value = value), '');
      if (captchaValue.value.length > 0) {
        await page.type('#captcha', captchaValue.value, { delay: 100 });
      }
      log.info(`input:画像認証へ-${captchaValue.value}-を入力`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'画像認証へ[${captchaValue.value}]を入力完了' 
      }).show();
    `);

      await page.keyboard.press('Tab', { delay: 200 });
      const buttons = await page.$$('.button2__text');
      let didClickButton = false;
      for (let i = 0; i < buttons.length; i++) {
        const buttonText = await (await buttons[i].getProperty('textContent')).jsonValue();
        console.log(`button text:${buttonText}`);

        if (buttonText === 'Register') {
          log.info('click:[登録]ボタン');
          buttons[i].click();
          didClickButton = true;
          break;
        }
      }

      if (!didClickButton) {
        throw new Error('can not find register button');
      }
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[登録]ボタンをクリック' 
      }).show();
    `);

      delay(1000);

      const buttons2 = await page.$$('.button2__text');
      didClickButton = false;
      for (let i = 0; i < buttons2.length; i++) {
        const buttonText = await (await buttons2[i].getProperty('textContent')).jsonValue();
        console.log(`button text:${buttonText}`);

        if (buttonText === 'Accept') {
          log.info('click:[規約に同意]ボタン');
          buttons[i].click();
          didClickButton = true;
          break;
        }
      }

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[規約に同意]ボタンをクリック' 
      }).show();
    `);

      if (!didClickButton) {
        throw new Error('can not find Accept button');
      }
      await page.waitFor('.error-message, .mail-Page-Body');

      const errorFields = await page.$$('.error-message');
      console.log(`isCaptchaError:${isCaptchaError}`);

      if (errorFields.length === 0) {
        log.info('no error');
        isCaptchaError = false;
      } else {
        log.info('==>error correct it');
      }

      if (errorFields.length > 1) {
        console.log('error found more than 2');
        throw Error('画像認証以外にもエラーがあります。');
      }
    } while (isCaptchaError);

    await page.waitFor('#nb-10 > div > div > div > div > svg > rect');
    await page.click('#nb-10 > div > div > div > div > svg > rect');
    log.info('<--------- done yahoo mail account<---------');
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    const closeConfirm = await page.evaluate(`swal({
      title: 'メールアカウントの作成が完了しました。',
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
