/* eslint-disable no-await-in-loop */
import { store } from '../../../../../index.js';
import type { DispatchType } from "../../../../../types";
import type { State } from '../../../../../types/state';

import delay from 'delay';
import log from 'electron-log';
import { getYahooAuthCode } from '../../../imap';
import { createMailAddressRequest } from "../../../../../containers/MailAddressList/actions";
import clickByText, { clickByTextInTagName } from "../../../../blogs/utils";

const saveYahooAccount =  async (yaccount) => {
  store.dispatch(createMailAddressRequest(yaccount));
};

const nextClickOnStep1 = async(page) => {
   const startLabel = await page.$eval('#startLabel', (element) => {
     return element.innerText;
   });
   console.log(`startLabel:${startLabel}`)
   if (startLabel === '携帯電話番号でID登録') {
     const btnArea = await page.$$eval('.btnSwitchArea', (element) => {
       if (element) {
         return element[0].innerText;
       } else {
         return null;
       }
     });
      console.log(`btnSwitchArea:${btnArea}`);
     if (btnArea === '携帯電話番号をお持ちでない場合') {
       // 携帯電話番号をお持ちでない場合
       return 0;
     } else {
       // メールアドレスで登録する
       return 1;
     }
   } else {
     return 2;
   }
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

  log.info('--------->create yahoo mail account--------->');
  log.info('-----------user----------');
  log.info(user);
  log.info('-------------------------');
  let page = await browser.newPage();
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

    // go to mail account application form
    // click 'create mail account(メールアドレス取得)'
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahooメールリンクをクリックしました。'
      }).show();
    `);
    // await page.click(
    // '.Personalbox__noticeItem--mail > .Personalbox__noticeLink'
    // );
    await clickByTextInTagName(page, 'ID新規取得', 'span');
    await page.waitForSelector('#startLabel');

    // メールアドレスで登録可能かをチェック

      const btnSwitch = await nextClickOnStep1(page);

    // #btnSwitchInputで切替
    // startLabel メールアドレスでID登録　携帯電話番号でID登録
    console.log(`btnSwitch:${btnSwitch}`);
    switch (btnSwitch) {
      // case '携帯電話番号をお持ちでない場合':
      case 0:
        log.info('click:[携帯電話番号をお持ちでない場合]');
        // click 'create now(今すぐメールアドレスを作る)'
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
          new Noty({
              type: 'success',
              layout: 'topLeft',
              text:'[携帯電話番号をお持ちでない場合]をクリック'
            }).show();
        `);
        await page.click('.btnSwitchArea');
        await page.waitForSelector('.answer_detail--title');

        // Yahoo! Help page
        await delay(1000);

        // 専用の登録フォームリンクをクリックすると、newTabで開いてしまう
        const pageTarget = page.target();
        await clickByText(page, '専用の登録フォーム');
        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
        const newPage = await newTarget.page();

        await delay(1000);
        page = newPage;
        await delay(300);

        break;
      // case 'メールアドレスで登録する':
      case 1:
        await clickByText(page, 'メールアドレスで登録する');
        break;
      default:
    }


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
    await delay(300);
    await page.type('#mail', user.contactMailAddress, { delay: 90 }); // 連絡用メールアドレス
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
          text:'次へボタンをクリック'
        }).show();
    `);
    log.info(`連絡先メールアドレス入力後、次へボタンをクリック開始`);
    await page.click('#btnSendCode');
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'次へボタンのクリック完了'
        }).show();
    `);
    log.info(`連絡先メールアドレス入力後、次へボタンをクリック完了`);

    await delay(1000);
    // メールアドレスでの登録が制限されているかをチェック
    const errTxt = await page.$eval('#sendErrMsg', item => {
      return item.textContent.trim();
    });
    log.info(`sendErrTxt:${errTxt}`);
    console.log(errTxt);
    if (errTxt.length > 0) {
      throw new Error(errTxt);
    }

// 確認コードを取得

    // #code
    // button #btnSubmit
    await page.addStyleTag({ content: `
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

      .wrapperContainer { height: 235px;
        width: 460px;background: #36c;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .loadingTitle {
        font-size: 35px;
        font-style: oblique;
        color: #DDD;
        padding-left: 16px;
        text-shadow: 0 0 4px #9CF;
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
    `});
    await page.evaluate(`
        new Noty({
          type: 'none',
          layout: 'dialogCenter',
          closeWith: [],
          killer: true,
          text:'<div class="mainWrapper"><div class="wrapperContainer"><div class="loadContainer"><div class="loader2"></div><div class="loader3"></div><div class="loader4"></div></div><div class="loadingTitle">確認コード取得中...</div></div></div>'
        }).show();
    `);


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

    let result = await getYahooAuthCode(mailacc);

    if (result) {
      [authCode] = result;
      log.info(`確認コード：${authCode}`)
    } else {
      await page.evaluate(`Noty.closeAll();`);
      log.warn('Yahoo!メール確認コードが見つかりません。');
      throw new Error('Yahoo!メール確認コードが見つかりません。');
    }

    await page.evaluate(() =>  { document.querySelector('.wrapperContainer').style.display = 'none'});
    await page.evaluate(`Noty.closeAll();`);

    // Yahoo!メール確認コード
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'Yahoo!メール確認コード入力開始',
          killer: true
        }).show();
    `);
    log.info('Yahoo!メール確認コード入力開始');
    await page.type('#code', authCode, {delay: 500});
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'Yahoo!メール確認コード入力完了'
        }).show();
    `);
    log.info('Yahoo!メール確認コード入力完了');

    await delay(1000);
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'[次へ]をクリック'
        }).show();
    `);
    await page.click('#btnSubmit');
    log.info('click:[次へ]');
    await delay(2000);
    try {
      await page.waitForFunction(`document.querySelector('#stepNav03').className.includes('is-current')`);
    } catch (e) {
      throw new Error('ご覧になろうとしているページは現在表示できません');
    }


    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    // 性別
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'性別入力開始',
          killer: true
        }).show();
    `);
    let genderSelect = '';
    if (user.gender) {
      // await page.click('input[name="gender"][value="f"]', { delay: 20 });
      genderSelect = `input[name="gender"][value="f"]`;
      log.info('input:[性別]-女');
    } else {
      // await page.click('input[name="gender"][value="m"]', { delay: 25 });
      genderSelect = `input[name="gender"][value="m"]`;
      log.info('input:[性別]-男');
    }
    await page.evaluate(s => (document.querySelector(s).checked = true), genderSelect );
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'性別入力完了'
        }).show();
    `);

  //生年月日
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
      `${user.birthday.year}`,
      {
        delay: 33
      }
    );
    log.info(
      `input:[生年]-${user.birthday.year}`
    );
    await delay(500);
    await page.select('#birthmonth', `${user.birthday.month}`);
    log.info(`input:[生月]-${user.birthday.month}`);
    await delay(800);
    await page.type('#birthdate', `${user.birthday.day}`);
    await delay(600);
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'生年月日入力完了'
        }).show();
    `);

    // 郵便番号
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

    // 名前
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

    // 登録ボタン
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'次へをクリック'
        }).show();
    `);

    await page.click('#btnSubmit');
    log.info(`click:[次へ]`);

    // t-point
    await page.waitFor('input[name="card"][value="nonexistence"]');

    //await page.waitFor('#nonexistence', {visible: true});
    log.info(`Tポイントページ`);
    // await page.click('input[name="card"][value="nonexistence"]');
    const noTcard = 'input[name="card"][value="nonexistence"]';
    await page.evaluate((noTcard) => document.querySelector(noTcard).click(),  noTcard);
    await delay(500);
    log.info(`click[Tカード：持っていませんをクリック]`);

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'[同意して登録する]をクリック'
        }).show();
    `);
    await delay(1000);
    page.click('#commit');
    log.info('click:[T-ポイント 同意して登録する]');
    await page.waitFor('.complete');

    // Complete page
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await delay(500);
    const actualMailAddressElements = await page.$$('.mail');
    let actualMailAddress ='';
    if (actualMailAddressElements.length ===1){
        actualMailAddress = await page.evaluate(el => el.innerText, actualMailAddressElements[0]);
        log.info(`Yahoo!メールアドレス:${actualMailAddress}`);
        const providedYahooId = actualMailAddress.replace('@yahoo.co.jp', '');
        const userGender = user.gender ? '女' : '男';
        const userDetailInfo = [];
        userDetailInfo.push(`氏名(漢字):${user.lastName} ${user.firstName}`);
        userDetailInfo.push(`しめい(ふりがな):${user.lastNameKana} ${user.firstNameKana}`);
        userDetailInfo.push(`生年月日:${user.birthday.year}/${user.birthday.month}/${user.birthday.day}`);
        userDetailInfo.push(`郵便番号:${user.postalCode}`);
        userDetailInfo.push(`都道府県:${user.prefecture}`);
        userDetailInfo.push(`性別:${userGender}`);
        userDetailInfo.push(`連絡先メールアドレス:${user.contactMailAddress}`);
        userDetailInfo.push(`連絡先メールアドレスパスワード:${user.contactMailAccount.password}`);


        saveYahooAccount({
          key: '',
          accountId: providedYahooId,
          password: user.password,
          mailAddress: actualMailAddress,
          provider: 'Yahoo',
          createDate: Date.now(),
          lastLogin: 0,
          tags: '',
          detailInfo: userDetailInfo
        });
    } else {
      throw new Error('Yahoo!Japanが割り当てたメールアドレスの取得ができません。')
    }

    await delay(1000);
    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'[次へ]をクリック'
        }).show();
    `);
    await page.click('#btnSubmit');
    log.info('click:[次へ]');
    await page.waitFor('#Masthead');

    // Yahoo!Japan top
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

    await page.evaluate(`
      new Noty({
          type: 'success',
          layout: 'topLeft',
          text:'[メール]をクリック'
        }).show();
    `);
    await clickByTextInTagName(page, 'メール', 'span');
    log.info(`メールアイコンをクリック`);
    await page.waitFor('#contents-body');


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
    await delay(1000);

    // パスワードの無効・変更
    // https://account.edit.yahoo.co.jp/change_pw
    log.info('-------> password set on yahoo account------->');

    await page.goto('https://account.edit.yahoo.co.jp/change_pw');

    // check top page
    const loginButton = await page.$('#btnSubmit');
    console.log(`btnSubmit:${loginButton}`);
    const inputCode = await page.$('#code');

    if (loginButton && inputCode) {


      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });

      // 確認コードを取得

      // #code
      // button #btnSubmit
      await page.addStyleTag({
        content: `
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

          .wrapperContainer { height: 235px;
            width: 460px;background: #36c;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .loadingTitle {
            font-size: 35px;
            font-style: oblique;
            color: #DDD;
            padding-left: 16px;
            text-shadow: 0 0 4px #9CF;
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
          `
      });
      await page.evaluate(`
        new Noty({
          type: 'none',
          layout: 'dialogCenter',
          closeWith: [],
          killer: true,
          text:'<div class="mainWrapper"><div class="wrapperContainer"><div class="loadContainer"><div class="loader2"></div><div class="loader3"></div><div class="loader4"></div></div><div class="loadingTitle">確認コード取得中...</div></div></div>'
        }).show();
      `);


      await delay(20000);

      // メールアカウントへのログイン情報
      log.info('Yahoo!メール確認コードを取得開始');

      // メールアカウントへログインし、本登録URLを取得
      result = await getYahooAuthCode(mailacc);

      if (result) {
        [authCode] = result;
        log.info(`確認コード：${authCode}`)
      } else {
        await page.evaluate(`Noty.closeAll();`);
        log.warn('Yahoo!メール確認コードが見つかりません。');
        throw new Error('Yahoo!メール確認コードが見つかりません。');
      }

      await page.evaluate(() => {
        document.querySelector('.wrapperContainer').style.display = 'none'
      });
      await page.evaluate(`Noty.closeAll();`);

      // Yahoo!メール確認コード
      await page.evaluate(`
        new Noty({
            type: 'success',
            layout: 'topLeft',
            text:'Yahoo!メール確認コード入力開始',
            killer: true
          }).show();
      `);
      log.info('Yahoo!メール確認コード入力開始');
      await page.type('#code', authCode, { delay: 500 });
      await page.evaluate(`
        new Noty({
            type: 'success',
            layout: 'topLeft',
            text:'Yahoo!メール確認コード入力完了'
          }).show();
      `);
      log.info('Yahoo!メール確認コード入力完了');

      await delay(1000);
      await page.evaluate(`
        new Noty({
            type: 'success',
            layout: 'topLeft',
            text:'[ログイン]をクリック'
          }).show();
      `);
      await page.click('#btnSubmit');
      log.info('click:[ログイン]');
      await page.waitForFunction(`document.querySelector('h1').innerText.includes('登録情報の追加')`);
    }

    // 登録情報追加ページ
    // check page
    const addPasswordPage = await page.$eval('h1', el => el.innerText === '登録情報の追加');

    if (!addPasswordPage) {
      throw new Error('パスワード設定ページが確認出来ません。');
    }
      // 登録情報ページ
      log.info(`登録情報ページ確認`);
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });

      await page.evaluate(`
        new Noty({
            type: 'success',
            layout: 'topLeft',
            text:'パスワード入力開始',
            killer: true
          }).show();
      `);
      log.info('パスワード入力開始');
      await page.type('#passwd', user.password, {delay: 500});
      await page.evaluate(`
        new Noty({
            type: 'success',
            layout: 'topLeft',
            text:'パスワード入力完了'
          }).show();
      `);
      log.info('パスワード入力完了');

      await page.evaluate(`
        new Noty({
            type: 'success',
            layout: 'topLeft',
            text:'追加して次へをクリック',
            killer: true
          }).show();
      `);
      log.info('click[追加して次へ]');
      await page.click('#commit');
      await delay(1000);
      await page.waitForFunction('document.querySelector("body").innerText.includes("ログインとセキュリティ")');

      log.info('<--------- done set password yahoo account<---------');
      await page.goto('https://mail.yahoo.co.jp');
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
    log.info(`error:${error.message}`);
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`Noty.closeAll();`);

    const errMsg = error.message.replace("（ヘルプ）", '');
    const swa2dialog = `Swal.fire({
        title: 'エラー発生',
        text:'`  +  `エラーが発生しました: ${errMsg}` + `',
        killer: true,
        showCancelButton: true,
        confirmButtonColor: '#4caf50',
        cancelButtonColor: '#f44336',
        confirmButtonText: '閉じる',
        cancelButtonText: 'ブラウザは、このまま',
        reverseButtons: true
      })`;

    console.log(`dialog:${swa2dialog}`);
    const closeConfirm = await page.evaluate(swa2dialog);

    if (closeConfirm.value) {
      await page.close();
    }
  }
};

export default signup;
