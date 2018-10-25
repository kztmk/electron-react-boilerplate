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

      await page.goto(validationUrl);
      await page.waitFor('#amebaIdInputElem', { timeout: 60000 });
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
      await page.type(`#birthdayDay`, dd);
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

      await page.waitForNavigation({ timeout: 40000 });
      await delay(1000);

      log.info(`${page.url()}へアクセス完了`);

      if (page.url() === 'https://www.ameba.jp/home') {
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Amebaトップへアクセス完了' 
      }).show();
    `);

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[ログインする]ボタンをクリック' 
      }).show();
    `);
        // click login button
        await clickByText(page, 'ログインする');
        log.info('click: login button');
        await page.waitFor('a[href^="https://profile.ameba.jp/me"]');

        log.info('access: myPage');
        // click blog adminpage
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'マイページへアクセス完了' 
      }).show();
    `);

        await delay(1000);
        // click settings
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログ管理ボタンをクリック' 
      }).show();
    `);
        // await clickByText(page, 'ブログ管理');
        await page.click('a[href="https://blog.ameba.jp/ucs/top.do"]');
        log.info('click: [ブログ管理]');
        await page.goto('https://blog.ameba.jp/ucs/top.do');
        await page.waitFor('#ucsMainLeft > h1');

        // check input title field
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'管理トップへアクセス完了' 
      }).show();
    `);
        log.info('access: admin page');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'設定リンクをクリック' 
      }).show();
    `);
        // await clickByText(page, '設定');
        await page.click('a[href="https://blog.ameba.jp/ucs/blog/bloginfoinput.do"]');
        log.info('click: settings');
        await page.waitFor('input[name="blog_title"]');

        // input title
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'アメブロの基本設定へアクセス完了' 
      }).show();
    `);
        log.info('access: settings page');

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'タイトルへ入力開始' 
      }).show();
    `);
        await page.$eval('input[name="blog_title"]', (el, value) => (el.value = value), '');
        await page.type('input[name="blog_title"]', blogInfo.title);
        log.info(`input: blog title-${blogInfo.title}`);
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'タイトルへ入力完了' 
      }).show();
    `);
        // input description
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'説明へ入力開始' 
      }).show();
    `);
        await page.$eval('#entryTextArea', (el, value) => (el.value = value), '');
        await page.type('#entryTextArea', blogInfo.description);
        log.info(`input description-${blogInfo.description}`);
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'説明へ入力完了' 
      }).show();
    `);

        // click save button
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'保存ボタンをクリック' 
      }).show();
    `);
        await page.click('input[value="保存"]');
        log.info('click save button');
        await page.waitFor('#completeMsgArea');

        await delay(2000);
        await page.goto('https://profile.ameba.jp/edit');
        await page.waitFor('input[name="nickname"]');

        await page.$eval('input[name="nickname"]', (el, value) => (el.value = value), '');
        await page.type('input[name="nickname"]', blogInfo.detailInfo.nickNameValue);

        const buttons = await page.$$('button');
        if (buttons) {
          let didClickSave = false;
          for (let i = 0; i < buttons.length; i = +1) {
            textContent = await (await buttons[i].getProperty('textContent')).jsonValue();
            console.log('----text content--');
            console.log(textContent);

            if (textContent === '変更を保存') {
              log.info(`click: save button`);
              buttons[i].click();
              didClickSave = true;
              break;
            }

            if (didClickSave) {
              const buttons2 = await page.$$('.btn__text');
              let isSaved = false;
              if (buttons2) {
                for (i = 0; i < buttons2.length; i += 1) {
                  textContent = await (await buttons2[i].getProperty('textContent')).jsonValue();
                  if (textContent === 'プロフィールを編集') {
                    isSaved = true;
                    break;
                  }
                  if (isSaved) {
                    log.info('saved profile');
                  } else {
                    log.warn('can not save profile');
                  }
                }
              }
              log.info('保存ボタンをクリックできません。');
            }
          }
        }
      }
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
  } catch (error) {
    log.error(`error:${error.toString()}`);
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    let timeout = '';
    if (error.toString().indexOf('TimeoutError') > -1) {
      timeout = 'タイムアウト';
    }
    await page.evaluate(`swal({
      title: '${timeout}エラー発生',
      text: '${timeout}エラーが発生しました。お手数ですが、手作業で続けていただくか、登録済みのアカウントを削除してください。',
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
