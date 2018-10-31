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

  log.info('--------->create WordPress.com blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Wpcom login/signup page
    await page.goto(`https://ja.wordpress.com/`, { waitUntil: 'load' });
    log.info('access: https://ja.wordpress.com/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'WordPress.comトップページアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[始めてみよう]ボタンをクリック' 
      }).show();
    `);
    log.info('click [始めてみよう]ボタンクリック');
    await page.click('#hero-cta');
    await page.waitForSelector('#email');

    // mailaddress validation page
    // mailAddress input & captcha
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });

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

    // user name
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ユーザー名入力開始' 
      }).show();
    `);
    await page.type('#username', blogInfo.accountId);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ユーザー名入力完了' 
      }).show();
    `);
    log.info(`accountId:${blogInfo.accountId}入力完了`);

    // pass word
    await page.evaluate(`
    new Noty({
        killer: true,
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

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[続ける]ボタンをクリック' 
      }).show();
    `);
    await page.click('button.button.signup-form__submit.form-button.is-primary')
    log.info('click continue');
    await page.evaluate(`Noty.closeAll();`);
    await page.waitForSelector('#siteTitle', {visible: true});

    // step2
    // user name
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サイト名入力開始' 
      }).show();
    `);
    await page.type('#siteTitle', blogInfo.title);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サイト名入力完了' 
      }).show();
    `);
    log.info(`site title:${blogInfo.title}入力完了`);

    // mail address
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サイト内容入力開始' 
      }).show();
    `);
    await page.type('#siteTopic', blogInfo.description);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サイト内容入力完了' 
      }).show();
    `);
    log.info(`description:${blogInfo.accountId}入力完了`);

    // pass word
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'サイトの目的-共有-をクリック' 
      }).show();
    `);
    await page.click('#share');
    log.info(`click purpose:share`);

    await delay(1000);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サイトの作成に自信-2をクリック' 
      }).show();
    `);

    const segmentedControls = await page.$$('.segmented-control__link');
    if (segmentedControls.length > 0) {
      await segmentedControls[1].click();
      log.info('click サイト作成の自信： 2')
    }
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'[続ける]をクリック' 
      }).show();
    `);
    await delay(500);
    // #primary > div > div.signup__steps > div > div > div > div.about__wrapper > div.about__form-wrapper > form > div.about__submit-wrapper > button
    // #primary > div > div.signup__steps > div > div > div > div.about__wrapper > div.about__form-wrapper > form > div.about__submit-wrapper > button
    await page.click('div.about__submit-wrapper > button');
    log.info('click continue');
    await page.waitFor('#search-component-17');

    await delay(1000);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サイトアドレス入力開始' 
      }).show();
    `);
    await page.type('#search-component-17', blogInfo.accountId);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サイトアドレス入力完了' 
      }).show();
    `);
    log.info(`description:${blogInfo.accountId}入力完了`);
    await page.waitForSelector('.domain-search-results', {visible: true});

    // div.domain-suggestion.card.is-compact.is-clickable
    const suggestions = await page.$$('div.domain-suggestion.card.is-compact.is-clickable');

    console.log(`suggestions:${suggestions.length}`);
    let foundSuggestionFree = false;
    for (let i = 0; i < suggestions.length; i = +1) {
      const textContent = await (await suggestions[i].getProperty('textContent')).jsonValue();
      console.log('----text content--');
      console.log(textContent);

      if (textContent.indexOf('無料') > -1) {
        console.log('found free domain');
        suggestions[i].click();
        foundSuggestionFree = true;
        break;
      }
    }

    if (!foundSuggestionFree) {
      throw new Error('無料のドメインが見つかりません。');
    }

    await page.waitForSelector('.plan-features__actions', {visible: true});
    await delay(1000);

    await page.click('button.button.plan-features__actions-button.is-free-plan');
    await page.waitForSelector('button.button.email-confirmation__button.is-primary');

    await delay(1000);
    await page.click('button.button.email-confirmation__button.is-primary');

    await page.waitForSelector('header.formatted-header');

    const title = await page.$eval('header.formatted-header', item => item.textContent);
    if (title && title.indexOf('サイトが巻き戻されました') > -1) {
      log.info('WordPress.com作成完了');
    }
    // countdown page
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

      // 本登録URLへアクセス プロフィールの入力ページ
      await page.goto(validationUrl);
      await page.waitForSelector('header.formatted-header__title');
      log.info('本登録URLへアクセス完了');

          await page.addStyleTag({ path: swa2Css });
          await page.addScriptTag({ path: swa2Js });

          const closeConfirm = await page.evaluate(`swal({
      title: 'Wpcomブログの作成が完了しました。',
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
