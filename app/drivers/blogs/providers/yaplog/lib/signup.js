/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import AntiCaptcha from "anticaptcha";
import getValidationLink from '../../../../emails/imap';
import antiCaptchaKey from "../../../../../database/antiCaptcha";


const prefectures = [
  {val:"1", prefecture:"北海道"},
  {val:"2", prefecture:"青森県"},
  {val:"3", prefecture:"岩手県"},
  {val:"4", prefecture:"宮城県"},
  {val:"5", prefecture:"秋田県"},
  {val:"6", prefecture:"山形県"},
  {val:"7", prefecture:"福島県"},
  {val:"8", prefecture:"茨城県"},
  {val:"9", prefecture:"栃木県"},
  {val:"10", prefecture:"群馬県"},
  {val:"11", prefecture:"埼玉県"},
  {val:"12", prefecture:"千葉県"},
  {val:"13", prefecture:"東京都"},
  {val:"14", prefecture:"神奈川県"},
  {val:"15", prefecture:"新潟県"},
  {val:"16", prefecture:"富山県"},
  {val:"17", prefecture:"石川県"},
  {val:"18", prefecture:"福井県"},
  {val:"19", prefecture:"山梨県"},
  {val:"20", prefecture:"長野県"},
  {val:"21", prefecture:"岐阜県"},
  {val:"22", prefecture:"静岡県"},
  {val:"23", prefecture:"愛知県"},
  {val:"24", prefecture:"三重県"},
  {val:"25", prefecture:"滋賀県"},
  {val:"26", prefecture:"京都府"},
  {val:"27", prefecture:"大阪府"},
  {val:"28", prefecture:"兵庫県"},
  {val:"29", prefecture:"奈良県"},
  {val:"30", prefecture:"和歌山県"},
  {val:"31", prefecture:"鳥取県"},
  {val:"32", prefecture:"島根県"},
  {val:"33", prefecture:"岡山県"},
  {val:"34", prefecture:"広島県"},
  {val:"35", prefecture:"山口県"},
  {val:"36", prefecture:"徳島県"},
  {val:"37", prefecture:"香川県"},
  {val:"38", prefecture:"愛媛県"},
  {val:"39", prefecture:"高知県"},
  {val:"40", prefecture:"福岡県"},
  {val:"41", prefecture:"佐賀県"},
  {val:"42", prefecture:"長崎県"},
  {val:"43", prefecture:"熊本県"},
  {val:"44", prefecture:"大分県"},
  {val:"45", prefecture:"宮崎県"},
  {val:"46", prefecture:"鹿児島県"},
  {val:"47", prefecture:"沖縄県"}
];


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

  log.info('--------->create yaplog blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Yaplog login/signup page
    await page.goto(`https://www.yaplog.jp/`, { waitUntil: 'load' });

    log.info('access: https://www.yaplog.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yaplogトップページアクセス完了' 
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
    await page.click('#new');
    await page.waitForSelector('input[name="email"]');

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
    await page.type('input[name="email"]', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}入力完了`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[確認メールを送信]ボタンをクリック' 
      }).show();
    `);
    await page.click('input[name="btn_login"]');
    log.info('click: 確認メール送信')
    await page.waitFor('h1.step01');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'仮登録完了' 
      }).show();
    `);
    log.info('Yaplog仮登録完了');

    await delay(1000);

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
        log.info(`本登録URL:${result[0]}`);
        // 本登録URLへアクセス プロフィールの入力ページ
        [validationUrl] = result;
      } else {
        throw new Error('registration link not found')
      }
    } catch (error) {
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

      await page.goto(validationUrl);
      await page.waitForSelector('input[name="basePassword"]');

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
      await page.type('input[name="basePassword"]', blogInfo.password);
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
      await page.type('input[name="basePasswordConfirm"]', blogInfo.password);
      log.info(`input password confirm`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力完了' 
      }).show();
    `);

      // yaplogID
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ヤプログ！ID入力開始' 
      }).show();
    `);
    await page.type('input[name="memberId"]', blogInfo.accountId);
    log.info(`input: blogID:${blogInfo.accountId}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ヤプログ！ID入力完了' 
      }).show();
    `);

    // title
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトル入力開始' 
      }).show();
    `);
    await page.type('input[name="blogName"]', blogInfo.title);
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
        text:'性別選択開始' 
      }).show();
    `);
      if (blogInfo.gender === 0) {
        await page.click('#sexMLabel');
        log.info('select gender male');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[男性]選択完了' 
      }).show();
    `);
      } else {
        await page.click('#sexFLabel');
        log.info('select gender female');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[女性]選択完了' 
      }).show();
    `);
      }

      // birth date
      const birthDateParts = blogInfo.birthDate.split('/');
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[年]-選択開始' 
      }).show();
    `);
    await page.select(`select[name="birthYear"]`, birthDateParts[0]);
    log.info(`input birth year:${birthDateParts[0]}`);
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
      await page.select(`select[name="birthMonth"]`, birthDateParts[1]);
      log.info(`input birth month:${birthDateParts[1]}`);
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
      await page.select(`select[name="birthDay"]`, birthDateParts[2]);
      log.info(`input birth date:${birthDateParts[2]}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日-[日]-選択完了' 
      }).show();
    `);

      // prefecture
    const prefecture = prefectures.find(p => p.prefecture === blogInfo.prefecture);
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'都道府県選択開始' 
      }).show();
    `);
      await page.select(`select[name="prefecture_code"]`, prefecture.val);
      log.info(`input prefecture:${prefecture.val}-${prefecture.prefecture}`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'都道府県選択完了' 
      }).show();
    `);

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[規約に同意して進む]ボタンクリック' 
      }).show();
    `);
      await page.click('input[src^="/img/common/spacer.gif"]');
      log.info('click:登録ボタン');
      await page.waitFor('h1.step02');

      // Yaplog登録完了ページ
    log.info('access Yaplog登録完了ページ')
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    // captcha
    try {
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'warning',
        layout: 'topLeft',
        text:'「私は、ロボットではありません。」を解決中...' 
      }).show();
    `);
      const AntiCaptchaAPI = new AntiCaptcha(antiCaptchaKey);

      const pageUrl = await page.url();
      const precheck = await page.$('.g-recaptcha')
      if (!precheck) {
        await delay(1000);
      }
      const siteKey = await page.$eval('.g-recaptcha', (el, attribute) => el.getAttribute(attribute), 'data-sitekey');
      log.info('google reCaptcha found');

      console.log(`pageUrl:${pageUrl}`);
      console.log(`siteKay:${siteKey}`);
      if (!pageUrl || !siteKey) {
        throw new Error('can not get page url or siteKey');
      }
      log.info('start to resolve google reCaptcha');
      const taskId = await AntiCaptchaAPI.createTask(pageUrl, siteKey);
      const response = await AntiCaptchaAPI.getTaskResult(taskId);

      log.info('done resolver');
      console.log(response);

      await page.evaluate('Noty.closeAll()');
      if ('errorId' in response) {
        if (response.errorId === 0) {
          // set resolver to textarea
          const frame = await page.frames().find(f => f.url().indexOf('https://www.google.com/recaptcha/api2/'));

          if (!frame) {
            log.warn('google reCaptcha frame has not found.')
            throw new Error('google reCaptcha frame has not found.')
          }
          log.info('found response frame.');
          log.info(`response:${response.solution.gRecaptchaResponse}`);
          // #g-recaptcha-response
          await frame.$eval('#g-recaptcha-response', (el, value) => (el.value = value), response.solution.gRecaptchaResponse);
        }
      } else {
        log.warn('antiCaptcha has no result.')
        throw new Error('antiCaptcha has no result.');
      }

      // input image src='/img/common/spacer.gif'
      const selector = 'input[src^="/img/common/spacer.gif"]';
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);
      log.info('click [上記の内容で登録]')

    } catch (error) {

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      await page.evaluate(`swal({
        title: '手順',
        text: '「私は、ロボットではありません。」にチェックを入れて、[上記の内容で登録]ボタンをクリックしてください。5分(300秒)を超えるとエラーになります。',
        showCancelButton: false,
        confirmButtonColor: '#4caf50',
        cancelButtonColor: '#f44336',
        confirmButtonText: '閉じる',
        cancelButtonText: 'ブラウザは、このまま',
        reverseButtons: true
      })`);
    }

      await page.waitFor('h1.step03', {timeout: 300000});
      log.info('ブログ登録完了');

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      const closeConfirm = await page.evaluate(`swal({
      title: 'Yaplog作成が完了しました。',
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
