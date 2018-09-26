/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import getValidationLink from '../../../../emails/imap';
import clickByText from '../../../utils';

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

  log.info('--------->create ameba blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Ameba login/signup page
    await page.goto(`https://ameblo.jp/`, { waitUntil: 'load' });

    log.info('access: https://ameblo.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Amebaブログ トップページへアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[ブログをはじめる]ボタンをクリック' 
      }).show();
    `);
    log.info('click [ブログを始める]ボタンクリック');
    await clickByText(page, `ブログをはじめる`);
    await page.waitForNavigation({ waitUntil: 'load' });

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
    await page.type('#mailaddress', blogInfo.mailAddress);
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
        text:'登録ボタンクリック' 
      }).show();
    `);
    await page.click('#submitBtn');
    log.info('[確認メールを送信]ボタンをクリック');

    await page.waitFor('#contentsArea > h2, #contentsArea > h1');

    let message = await page.$('#contentsArea > h2');
    let textContent = '';
    if (message) {
      textContent = await (await message.getProperty('textContent')).jsonValue();
    } else {
      message = await page.$('#contentsArea > h1');
      textContent = await (await message.getProperty('textContent')).jsonValue();

      throw new Error(textContent);
    }
    console.log('--message--');
    console.log(textContent);
    if (textContent === 'メールを確認してください') {
      log.info('AmebaID仮登録完了');
    } else {
      throw new Error('仮登録完了ページが確認出来ません。');
    }

    // メール到着まで60秒待機
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
      await page.waitForNavigation({ waitUntil: 'load' });
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

      // accountId
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'アカウントID入力開始' 
      }).show();
    `);
      await page.type(`#amebaIdInputElem`, blogInfo.accountId);
      log.info(`input accountId:${blogInfo.accountId}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'アカウントID入力完了' 
      }).show();
    `);

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

      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'性別選択開始' 
      }).show();
    `);
      if (blogInfo.gender) {
        await page.click('#female');
        log.info('select gender female');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[女性]選択完了' 
      }).show();
    `);
      } else {
        await page.click('#man');
        log.info('select gender male');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[男性]選択完了' 
      }).show();
    `);
      }

      // 生年月日
      const birthDateParts = blogInfo.birthDate.split('/');

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[年]-選択開始' 
      }).show();
    `);
      await page.type(`#birthdayYear`, birthDateParts[0]);
      log.info(`input birth date:${birthDateParts[0]}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[年]-選択完了' 
      }).show();
    `);

      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[月]-選択開始' 
      }).show();
    `);
      const mm = parseInt(birthDateParts[1], 10).toString();
      await page.type(`#birthdayMonth`, mm);
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
      await page.select(`#birthdayDay`, dd);
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
        text:'送信ボタンをクリック' 
      }).show();
    `);
      await page.click(`#submitBtn`);
      log.info(`click: submit`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'送信ボタンをクリック' 
      }).show();
    `);

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      const closeConfirm = await page.evaluate(`swal({
      title: 'Amebaブログの作成が完了しました。',
      text: 'ブラウザを閉じてもよろしいですか？',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: '閉じる',
      cancelButtonText: 'ブラウザは、このまま',
      reverseButtons: true
    })`);
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
