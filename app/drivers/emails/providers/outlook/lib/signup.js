/* eslint-disable no-await-in-loop */
import delay from 'delay';
import tempy from 'tempy';
import fs from 'fs';
import log from 'electron-log';

async function base64Encode(imgPath) {
  const bitmap = fs.readFileSync(imgPath);
  return Buffer.from(bitmap).toString('base64');
}

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

  log.info('--------->create outlook mail account--------->');
  log.info('-----------user----------');
  log.info(user);
  log.info('-------------------------');
  const page = await browser.newPage();
  log.info('create: browser page');

  try {
    await page.goto('https://signup.live.com/signup');
    log.info('access https://signup.live.com/signup');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Outlookアカウント作成ページへアクセス完了' 
      }).show();
    `);

    // email / username and select domain
    // --------------------------------
    await page.waitFor('#liveSwitch', { visible: true });
    await page.click('#liveSwitch');
    await delay(100);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'新しいメールアドレスを作成をクリック' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Outlook アカウントID入力開始' 
      }).show();
    `);
    await page.type('#MemberName', user.username, { delay: 40 });
    log.info(`input:[MemberName]-${user.username}`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Outlook アカウントID入力完了' 
      }).show();
    `);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'ドメイン選択ドロップボックスをクリック' 
      }).show();
    `);
    await page.click('#domainLabel');
    await delay(500);
    switch (user.domain) {
      case 'outlook.jp':
        await page.click('#domain0');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'outlook.jpを選択' 
      }).show();
    `);
        break;
      case 'outlook.com':
        await page.click('#domain1');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'outlook.comを選択' 
      }).show();
    `);
        break;
      case 'hotmail.com':
        await page.click('#domain2');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'hotmail.comを選択' 
      }).show();
    `);
        break;
      default:
    }
    log.info(`select:[ドメイン選択]-user.domain`);

    let error = null;
    await delay(250);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'次へをクリック' 
      }).show();
    `);
    await page.click('#iSignupAction', { delay: 20 });
    log.info('click:[次へ]');

    await delay(1000);
    error = await page.$('#MemberNameError');

    if (error) {
      const errMsg = 'アカウントIDは既に使用されています。';
      log.warn(errMsg);
      throw new Error(errMsg);
    }

    // password
    // -------------------

    await page.waitFor('#Password', { visible: true });
    await delay(100);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.type('#Password', user.password, { delay: 10 });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);
    await delay(100);
    log.info(`input:[password]-${user.password}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'キャンペーンメール受け取りを選択' 
      }).show();
    `);
    await page.click('#iOptinEmail', { delay: 10 });
    await delay(100);
    log.info(`click: [キャンペーンメールを受け取る]`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'次へをクリック' 
      }).show();
    `);
    await page.click('#iSignupAction', { delay: 30 });
    log.info(`click:[次へ]`);
    // first and last name
    // -------------------

    await page.waitFor('#FirstName', { visible: true });
    await delay(100);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'名前の入力開始' 
      }).show();
    `);
    await page.type('#FirstName', user.firstName, { delay: 30 });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名前の入力完了' 
      }).show();
    `);
    log.info(`input:[名]-${user.firstName}`);
    await delay(120);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'姓の入力開始' 
      }).show();
    `);
    await page.type('#LastName', user.lastName, { delay: 35 });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'姓の入力完了' 
      }).show();
    `);
    await delay(260);
    log.info(`input:[姓]-${user.lastName}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'次へをクリック' 
      }).show();
    `);
    await page.click('#iSignupAction', { delay: 25 });
    log.info(`click:[次へ]`);

    // birth date
    // ----------

    await page.waitFor('#BirthMonth', { visible: true });
    await delay(100);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'生年月日-月-を選択' 
      }).show();
    `);
    await page.select('#BirthMonth', user.birthday.month);
    await delay(120);
    log.info(`input:[生年月日]-${user.birthday.month}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-日-を選択' 
      }).show();
    `);
    await page.select('#BirthDay', user.birthday.day);
    await delay(260);
    log.info(`input:[生年月日]-${user.birthday.day}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-年-を選択' 
      }).show();
    `);
    await page.select('#BirthYear', user.birthday.year);
    await delay(220);
    log.info(`input:[生年月日]-${user.birthday.year}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'次へをクリック' 
      }).show();
    `);
    await page.click('#iSignupAction', { delay: 8 });

    // captcha or sms validation
    // -------------------------

    await delay(1000);

    if (await page.$('#hipTemplateContainer')) {
      // captcha
      let isChaptchaError = true;
      await page.waitFor('#hipTemplateContainer img', { visible: true });

      // captcha clear
      do {
        let captchaValue = '';
        // in case of left previous input
        await page.focus('#hipTemplateContainer input');
        const inputCaptcha = await page.$eval('#hipTemplateContainer input', elm => elm.value);
        if (inputCaptcha && inputCaptcha.length > 0) {
          await page.focus('#hipTemplateContainer input');
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < inputCaptcha.length; ++i) {
            await page.keyboard.press('Backspace');
          }
        }
        const $img = await page.$('#hipTemplateContainer img');
        const captchaPath = tempy.file({ extension: 'png' });
        await $img.screenshot({
          path: captchaPath
        });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'画像認証をキャプチャ' 
      }).show();
    `);

        await page.addStyleTag({ path: swa2Css });
        await page.addStyleTag({
          content:
            '.captchaImage{border:1px solid rgba(51,51,51,0.3);border-radius:12px;padding:10px 15px;'
        });
        await page.addScriptTag({ path: swa2Js });

        const imageData = await base64Encode(captchaPath);

        captchaValue = await page.evaluate(`Swal.fire({
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
        await page.type('#hipTemplateContainer input', captchaValue.value, {
          delay: 40
        });

        log.info(`input:[画像認証]-${captchaValue.value}`);
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'次へをクリック' 
      }).show();
    `);
        await page.click('#iSignupAction', { delay: 9 });
        log.info(`click:[次へ]`);

        await delay(1500);
        const captchaError = await page.$('.alert-error');
        if (captchaError === null) {
          isChaptchaError = false;
        } else {
          log.warn('画像認証の画像と入力が一致しません。');
        }
        // try {
        //   await page.waitFor('#hipTemplateContainer img', {
        //     timeout: 1000,
        //     visible: true
        //   });
        //   log.warn('画像認証の画像と入力が一致しません。');
        // } catch (e) {
        //   log.info('画像認証完了');
        //   isChaptchaError = false;
        // }
      } while (isChaptchaError);
    } else {
      // TODO: handle case of sms validation
      await page.waitForNavigation({ timeout: 0 });
    }

    await page.waitForNavigation({ timeout: 0 });
    if (page.$('#hipDesc') !== null) {
      throw new Error(
        'セキュリティ・チェックです。次のOutlookアカウントを作成するまで、少し時間をおいて下さい。'
      );
    }

    log.info('アカウント設定開始');
    // main account page
    // -----------------

    await delay(500);
    await page.goto('https://www.outlook.com/?refd=account.microsoft.com&fref=home.banner.profile');
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'設定ウィザード開始' 
      }).show();
    `);

    log.info('設定ウィザード開始');
    // inbox page first-run
    // --------------------

    await delay(800);

    // keep pressing next...
    while (true) {
      if (!await page.$('.dialog button.nextButton')) break;
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'次へをクリック' 
      }).show();
    `);
      await page.click('.dialog button.nextButton', { delay: 5 });
      log.info('click:[次へ]');
      await delay(220);
    }

    // wait until "let's go" button appears...
    while (true) {
      await delay(1000);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        killer: true,
        text:'OKをクリック' 
      }).show();
    `);
      if (await page.$('.dialog button.primaryButton')) break;
    }
    log.info('click:[lets go button]');

    await delay(120);
    await Promise.all([
      page.waitForNavigation(),
      page.click('.dialog button.primaryButton', { delay: 7 })
    ]);

    log.info('<--------- create outlook mail account<---------');
    // should now be at https://outlook.live.com/mail/inbox
    // await page.close();
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    const closeConfirm = await page.evaluate(`Swal.fire({
      title: 'Outlookメールアカウントの作成が完了しました。',
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
    log.error(error.toString());
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`Swal.fire({
      title: 'エラー発生',
      text: 'エラーが発生しました。お手数ですが、手作業で続けていただくか、登録済みのアカウントを削除してください。',
      showCancelButton: false,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'OK',
      cancelButtonText: 'ブラウザは、このまま',
      reverseButtons: true
    })`);
  }
};

export default signup;
