/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import { getYahooAuthCode } from '../../../imap';

const notyYahooStyle = `
#noty_layout__dialogCenter {
  position: absolute;
  top: 50%;
  left: 50%;
  width:460px;
  transform: translateY(-50%) translateX(-50%);
}

.mainWrapper {
}

.loadContainer { height: 35px;
  width: 35px;
  float: left; }

.wraperContainer { height: 235px;
  width: 460px;background: #36c;
  display: flex;
  justify-content: center;
  align-items: center;
}

span {
  font-size: 35px;
  font-style: oblique;
  color: #DDD;
  padding-left: 16px;
  text-shadow: 0px 0px 4px #9CF;
  animation: loadingText .4s ease-in-out infinite alternate;
}

.loader2 {
  border-top: 3px solid #ddd;
  border-bottom: 3px solid #ddd;
  border-radius: 50%;
  height: 14px;
  width: 15px;
  margin: 10px;
  position: absolute;
  animation: loading 1.2s infinite linear; }

.loader3 {
  border-left: 3px solid #ccc;
  border-right: 3px solid #ccc;
  border-radius: 50%;
  height: 24px;
  width: 25px;
  margin: 8px 2px;
  position: absolute;
  animation: loading 1s infinite linear; }

.loader4 {
  border-top: 3px solid #bbb;
  border-bottom: 3px solid #bbb;
  border-radius: 50%;
  height: 34px;
  width: 35px;
  position: absolute;
  animation: loading .8s infinite linear; }

@keyframes loading {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); } }

@keyframes loadingText {
  to {text-shadow:
    0 0 2px #9CF,
    0 0 3px #9CF,
    0 0 4px #69C,
    0 0 5px #69C; } }

`;

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

  log.info('--------->create yahoo mail account--------->');
  log.info('-----------user----------');
  log.info(user);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Yahoo! Japan top page
    await page.goto(`https://www.yahoo.co.jp`, { waitUntil: 'load' });

    log.info('access: https://www.yahoo.co.jp');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo Japan トップページアクセス完了' 
      }).show();
    `);
    log.info('load: https://www.yahoo.co.jp');

    // go to mail accout application form
    // click 'create mail account(メールアドレス取得)'
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahooメールリンクをクリックしました。' 
      }).show();
    `);
    await page.click(
      '.Personalbox__noticeItem--mail > .Personalbox__noticeLink'
    );
    await page.waitForSelector('.button--main');

    log.info('click:[Yahoo!メール]');
    // click 'create now(今すぐメールアドレスを作る)'
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[今すぐメールアドレスを作る]をクリック' 
      }).show();
    `);
    await page.click('.MainVisual__box > .button--main');
    await page.waitForSelector('#yid');

    log.info('click:[今すぐメールアドレスを作る]');

    // YahooID
    // -------
    let error = '';
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'連絡先メールアドレス入力開始' 
      }).show();
    `);
    log.info(`連絡先メールアドレス:${user.contactMailAddress}を入力開始`);
    await page.type('#mail', user.contactMailAddress, { delay: 9 }); // 連絡用メールアドレス
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'連絡用メールアドレス入力完了' 
      }).show();
    `);
    log.info(`連絡先メールアドレス:${user.contactMailAddress}を入力完了`);
    await delay(250);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始',
        killer: true
      }).show();
    `);
    await page.type('#passwd', user.password, { delay: 5 }); // password
    log.info(`input:[password]-${user.password}`);
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
        text:'郵便番号入力開始' 
      }).show();
    `);
    await page.type('#postCode', user.postalCode, { delay: 45 }); // Japanese postal code(7digits)
    log.info(`input:[郵便番号]-${user.postalCode}`);
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
        text:'生年月日入力開始' ,
        killer: true
      }).show();
    `);
    await page.type(
      '#birthday',
      `${user.birthday.year}${user.birthday.month}${user.birthday.day}`,
      {
        delay: 33
      }
    ); // birthdate YYYYMMDD
    log.info(
      `input:[生年月日]-${user.birthday.year}/${user.birthday.month}/${
        user.birthday.day
      }`
    );
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日入力完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名前入力開始' 
      }).show();
    `);
    await page.type('#dispname', `${user.lastName} ${user.firstName}`, {
      delay: 50
    }); // user lastName firstName
    log.info(`input:[名前]-${user.lastName} ${user.firstName}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名前入力完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'性別入力開始',
        killer: true
      }).show();
    `);
    if (user.gender) {
      await page.click('#female', 'f', { delay: 20 });
      log.info('input:[性別]-女');
    } else {
      await page.click('#male', 'm', { delay: 25 });
      log.info('input:[性別]-男');
    }

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'性別入力完了' 
      }).show();
    `);

    // 連絡用メールアドレスを入力すると、@の後1文字入力で
    // 連絡用メールアドレスのID部分に(_MMDD)でYahooIDが自動で作成される。
    await page.waitForFunction('document.querySelector("#yid").value.length > 0');

    // 勝手に作成されたYahooIDをクリア
    await page.evaluate( () => document.getElementById("yid").value = "");

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo ID入力開始' 
      }).show();
    `);
    await page.type('#yid', user.username, { delay: 9 }); // yahoo ID
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo ID入力完了' 
      }).show();
    `);
    await delay(250);

    log.info(`input:[Yahoo ID]-${user.username}`);

    error = await page.$eval('#tipTxt', el => el.className);
    if (error.indexOf('chkYidNG') > -1) {
      const errMsg = '入力されたYahooIDは、既に使われています。';
      await page.evaluate(`
    new Noty({
        type: 'error',
        layout: 'topLeft',
        text: ${errMsg}
      }).show();
    `);
      log.warn(errMsg);
      throw new Error(errMsg);
    }


    // captcha
    // -------
    await delay(1500);
    let isCaptchaError = true;
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'お知らせメール配信希望入力開始',
        killer: true
      }).show();
    `);
    await page.type('#deliver', '1');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'お知らせメール配信希望入力完了' 
      }).show();
    `);
    await page.evaluate(`Noty.closeAll();`);
    do {
      let captchaValue = '';
      if (await page.$('#cimg')) {
        await page.waitFor('#cimg', { visible: true });
      }

      await delay(2000);

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

      await page.focus('#secword');
      await page.addStyleTag({ path: swa2Css });
      await page.addStyleTag({
        content:
          '.captchaImage{border:1px solid rgba(51,51,51,0.3);border-radius:12px;padding:10px 15px;'
      });
      await page.addScriptTag({ path: swa2Js });
      await page.evaluate('Noty.closeAll();');
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

      await page.type('#secword', captchaValue.value, { delay: 100 });
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
        text:'[Yahoo! JAPAN IDを登録]をクリック' 
      }).show();
    `);
      await page.click('#btnSubmit');
      log.info('click:[Yahoo! JAPAN IDを登録]');
      // await page.waitFor('#errMsg')

      await page.waitFor('.errTxt, #commit');
      const errorFields = await page.evaluate(() => {
        const errors = [];
        const errorList = document.querySelectorAll('.errTxt');
        errorList.forEach(err => {
          errors.push(err.innerText);
        });
        return errors;
      });

      const errMsgs = errorFields.find(
        errorField => errorField === '画像に表示された文字を入力してください。'
      );
      isCaptchaError = errMsgs === undefined;
      console.log(`isCaptchaError:${isCaptchaError}`);

      if (errorFields.length === 0) {
        console.log('no error');
        isCaptchaError = false;
      }

      if (errorFields.length > 1) {
        console.log('error found more than 2');
        throw Error('画像認証以外にもエラーがあります。');
      }
    } while (isCaptchaError);

    await page.waitFor('#commit');
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.click('#nonexistence');
    log.info('T-point card持っていないをクリック');

    await delay(500);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[同意して登録する]をクリック' 
      }).show();
    `);
    await page.click('#commit');
    log.info('click:[同意して登録する]');
    await page.waitFor('.msgComplete');
    await page.$('#msgComplete');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.addStyleTag({ path: './app/assets/notyDialog/notyYahoo.css'});
    await page.evaluate(`
        new Noty({
          type: 'none',
          layout: 'dialogCenter',
          closeWith: [],
          killer: true,
          text:'<div class="mainWrapper"><div class="wrapperContainer"><div class="loadContainer"><div class="loader2"></div><div class="loader3"></div><div class="loader4"></div></div><div class="loadingTitle">確認コード取得中...</div></div></div>'
        }).show();
    `)


    await delay(20000);

    // メールアカウントへのログイン情報
    const mailacc = {};
    mailacc.accountId = user.contactMailAccount.accountId;
    mailacc.mailAddress = user.contactMailAccount.mailAddress;
    mailacc.password = user.contactMailAccount.password;
    mailacc.provider = user.contactMailAccount.provider;
    log.info('Yahoo!メール確認コードを取得開始');

    // メールアカウントへログインし、本登録URLを取得
    let authCode = '';

    const result = await getYahooAuthCode(mailacc);

    if  (result) {
      [authCode] = result;
      log.info(`確認コード：${authCode}`)
    } else {
      log.warn('Yahoo!メール確認コードが見つかりません。');
      throw new Error('Yahoo!メール確認コードが見つかりません。');
    }

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    // Yahoo!メール確認コード
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo!メール確認コード入力開始',
        killer: true
      }).show();
    `);
    await page.type('input[name="iptPasscode"]', authCode);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo!メール確認コード入力完了' 
      }).show();
    `);

    await delay(500);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[次へ]をクリック' 
      }).show();
    `);
    await page.click('#btnSubmit');
    log.info('click:[次へ]');
    await page.waitFor('.msgComplete');

    // a ご利用中のサービスに戻るをクリック
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[ご利用中のサービスに戻る]をクリック' 
      }).show();
    `);
    page.click('a[href^="https://mail.yahoo.co.jp"]');
    log.info('click:[ご利用中のサービスに戻る]');
    await page.waitFor('#masthead');

    await page.waitForSelector('.start');
    await delay(500);
    // 「さっそく使ってみよう」をクリック
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    console.log('--addTag done--');
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[さっそく使ってみよう]をクリック' 
      }).show();
    `);
    console.log('--addTag done--');
    await page.click('.start');
    log.info(`click:[さっそく使ってみよう]`);
    await page.waitFor('#tabinbox');

    log.info('<--------- done yahoo mail account<---------');
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    const closeConfirm = await page.evaluate(`Swal.fire({
      title: 'Yahoo！メールアカウントの作成が完了しました。',
      text: 'ブラウザを閉じてもよろしいですか？',
      killer: true,
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
      killer: true,
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
