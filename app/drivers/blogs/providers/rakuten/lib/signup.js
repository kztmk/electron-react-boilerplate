/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import jaconv from 'jaconv';
import AntiCaptcha from "anticaptcha";
import clickByText from '../../../utils';
import antiCaptchaKey from "../../../../../database/antiCaptcha";

const waitRandom = () => Math.floor(Math.random() * 501)

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

  log.info('--------->create rakuten blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Rakuten login/signup page
    await page.goto(`https://plaza.rakuten.co.jp/`, { waitUntil: 'load' });
    log.info('access: https://plaza.rakuten.co.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ra楽天ブログ トップページアクセス完了' 
      }).show();
    `);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[楽天会員登録]ボタンをクリック' 
      }).show();
    `);
    await delay(800 + waitRandom());
    await clickByText(page, '楽天会員登録（無料）');
    log.info('click [新規登録]ボタンクリック');
    await page.waitForSelector('#entryBtn');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'楽天会員に新規登録ボタンをクリック' 
      }).show();
    `);

    await delay(1000 + waitRandom());
    await page.click('#entryBtn');
    await page.waitFor('input[name="email"]');

    // 楽天会員登録
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'楽天会員登録ページにアクセス完了' 
      }).show();
    `);
    log.info('access to registory page')
    // mailAddress input
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    await delay(1000);
    await page.click('input[name="email"]')
    await delay(800 + waitRandom());
    await page.type('input[name="email"]', blogInfo.mailAddress, { delay: waitRandom()});
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}入力完了`);

    // mail address confirm
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス(確認)入力開始' 
      }).show();
    `);
    await delay(800 + waitRandom());
    await page.click('input[name="email2"]');
    await delay(800 + waitRandom());
    await page.type('input[name="email2"]', blogInfo.mailAddress, { delay: waitRandom()});
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス(確認)入力完了' 
      }).show();
    `);
    log.info(`mailAddress confirm:${blogInfo.mailAddress}入力完了`);

    // password
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await delay(800 + waitRandom());
    await page.click('#p_id');
    await delay(800 + waitRandom());
    await page.type('#p_id', blogInfo.password, { delay: waitRandom()});
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力完了' 
      }).show();
    `);
    log.info(`password:${blogInfo.password}入力完了`);

    // 氏名
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'姓の入力開始'
    }).show();
    `);
    await delay(800 + waitRandom());
    await page.click('input[name="lname"]');
    await delay(800 + waitRandom());
    await page.type('input[name="lname"]', blogInfo.lastName, { delay: waitRandom()});
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'姓の入力完了'
    }).show();
    `);
    log.info(`Last Name:${blogInfo.lastName}入力完了`);

    await page.evaluate(`
      new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'名の入力開始' 
      }).show();
    `);
    await delay(800 + waitRandom());
    await page.click('input[name="fname"]');
    await delay(800 + waitRandom());
    await page.type('input[name="fname"]', blogInfo.firstName, { delay: waitRandom()});
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名の入力完了' 
      }).show();
    `);
    log.info(`First Name:${blogInfo.firstName}入力完了`);

    // フリガナ
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'姓(フリガナ)の入力開始'
    }).show();
    `);
    await delay(800 + waitRandom());
    await page.click('input[name="lname_kana"]');
    await delay(800 + waitRandom());
    await page.type('input[name="lname_kana"]', jaconv.toKatakana(blogInfo.lastNameKana), { delay: waitRandom()});
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'姓(フリガナ)の入力完了'
    }).show();
    `);
    log.info(`Last Name:${jaconv.toKatakana(blogInfo.lastNameKana)}入力完了`);

    await page.evaluate(`
      new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'名(フリガナ)の入力開始' 
      }).show();
    `);
    await delay(800 + waitRandom());
    await page.click('input[name="fname_kana"]');
    await delay(800 + waitRandom());
    await page.type('input[name="fname_kana"]', jaconv.toKatakana(blogInfo.firstNameKana), { delay: waitRandom()});
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'名(フリガナ)の入力完了' 
      }).show();
    `);
    log.info(`First Name Katakana:${jaconv.toKatakana(blogInfo.firstNameKana)}入力完了`);


    // 誕生日
    const birthdayParts = blogInfo.birthDate.split('/');
    await page.evaluate(`
      new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '誕生日-年-を選択開始'
      }).show();
    `);
    await delay(1000 + waitRandom());
    await page.click('select[name="by"]');
    await delay(1000 + waitRandom());
    await page.select('select[name="by"]', birthdayParts[0]);
    await page.evaluate(`
      new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '誕生日-年-を選択完了'
      }).show();
    `);
    log.info(`select birth year: ${birthdayParts[0]}`);

    const numberOfMonth = parseInt(birthdayParts[1], 10).toString();
    await page.evaluate(`
      new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text: '誕生日-月-を選択開始'
      }).show();
    `);
    await delay(1000 + waitRandom());
    await page.click('select[name="bm"]');
    await delay(1000 + waitRandom());
    await page.select('select[name="bm"]', numberOfMonth);
    await page.evaluate(`
      new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '誕生日-月-を選択完了'
      }).show();
    `);
    log.info(`select birth year: ${numberOfMonth}`);

    const numberOfDay = parseInt(birthdayParts[2], 10).toString();
    await page.evaluate(`
      new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '誕生日-日-を選択開始'
      }).show();
    `);
    await delay(1000 + waitRandom());
    await page.click('select[name="bd"]');
    await delay(1000 + waitRandom());
    await page.select('select[name="bd"]', numberOfDay);
    await page.evaluate(`
      new Noty({
        type: 'success',
        layout: 'topLeft',
        text: '誕生日-日-を選択完了'
      }).show();
    `);
    log.info(`select birth year: ${numberOfDay}`);


    // 性別
    await page.evaluate(`
    new Noty({
      killer: true,
      type: 'success',
      layout: 'topLeft',
      text:'性別入力開始'
    }).show();
    `);
    await delay(500 + waitRandom());
    if (blogInfo.gender) {
      await page.click('input[name="sex"][value="F"]');
      log.info('click gender: female');
    } else {
      await page.click('input[name="sex"][value="M"]');
      log.info('click gender: male');
    }
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'性別入力完了'
    }).show();
    `);

    // ニックネーム
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'ニックネームの入力開始'
    }).show();
    `);
    // await page.type('input[name="nickname"]', `ffffff`);
    await delay(700 + waitRandom());
    await page.click('input[name="nickname"]');
    await delay(700 + waitRandom());
    await page.type('input[name="nickname"]', `${blogInfo.accountId}${birthdayParts[0]}${birthdayParts[1]}${birthdayParts[2]}`, { delay: waitRandom()});
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'ニックネームの入力完了'
    }).show();
    `);
    log.info(`nickname:${blogInfo.accountId}${birthdayParts[0]}${birthdayParts[1]}${birthdayParts[2]}入力完了`);


    // 同意して次へ
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'同意して次へボタンをクリック'
    }).show();
    `);
    await delay(waitRandom());
    await page.click('input[name="execMethod"]');
    log.info('click: 同意して次へ');

    await page.waitFor('#contents > h2');
    let title = await page.$eval('#contents > h2', item => item.textContent);
    console.log(`title:${title}`);

    if (title === "入力内容の確認") {
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'入力内容確認ページにアクセス完了' 
      }).show();
    `);
      log.info('access 入力内容の確認')
      // #regist3Form > p:nth-child(6) > input[type="submit"]
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[登録する]ボタンをクリック' 
      }).show();
    `);
      await delay(1000);
      await page.click('p.submit > input');
      log.info('click [登録する]ボタン')

      title = await page.$eval('#contents > h2', item => item.textContent);

      if (title === '会員登録の完了') {
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'会員登録完了ページにアクセス完了' 
      }).show();
    `);
        log.info('会員登録完了')
        // #regist3Form > p:nth-child(6) > input[type="submit"]
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[続けてサービスを利用する]ボタンをクリック' 
      }).show();
    `);
        await delay(500 + waitRandom());
        await page.click('p.submit > input')
        log.info('click [続けてサービスを利用する]ボタン');
        await page.waitFor('#myplaza_regist_base_url');

        //
        log.info('access 新規日記の登録')
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[新規日記の登録]ページにアクセス完了' 
      }).show();
    `);

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'日記のURLの入力開始' 
      }).show();
    `);
        await page.click('#myplaza_regist_base_url');
        await delay(waitRandom());
        await page.type('#myplaza_regist_base_url', blogInfo.accountId, { delay: waitRandom() });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'日記のURLの入力完了' 
      }).show();
    `);
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

          await page.click('#myplaza_regist_foreside');
          log.info('click [規約に同意して確認画面へ]')

        } catch (error) {

              await page.addStyleTag({ path: swa2Css });
              await page.addScriptTag({ path: swa2Js });

              await page.evaluate(`swal({
            title: '手順',
            text: '「私は、ロボットではありません。」にチェックを入れて、[規約に同意して確認画面へ]ボタンをクリックしてください。5分(300秒)を超えるとエラーになります。',
            showCancelButton: false,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#f44336',
            confirmButtonText: '閉じる',
            cancelButtonText: 'ブラウザは、このまま',
            reverseButtons: true
          })`);
        }

        await page.waitFor('#myplaza_regist_confirm_complete', { timeout: 300000 })


        // この内容で登録する
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'確認ページにアクセス完了' 
      }).show();
    `);

        log.info('access confirm page');
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[この内容で登録する]ボタンをクリック' 
      }).show();
    `);
        await page.click('#myplaza_regist_confirm_complete');
        log.info('click registration button');
        await page.waitFor('#contents > div > div.cosMt60.cosMb40 > div > a');
        // #contents > div > div.cosMt60.cosMb40 > h2

        // すぐにブログを始める
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログ作成ページにアクセス完了' 
      }).show();
    `);
        log.info('access: blog detail page');

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[すぐにブログを始める]ボタンをクリック' 
      }).show();
    `);
        await clickByText(page, 'すぐにブログを始める');
        log.info('click: すぐにブログを始める');
        await page.waitFor('.introjs-helperLayer');

        // ブログ設定画面
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[次へ]ボタンをクリック' 
      }).show();
    `);
        await clickByText(page, '次へ  →');
        log.info('click next');
        await delay(1000);
        log.info('次へをクリック');

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[次へ]ボタンをクリック' 
      }).show();
    `);
        await clickByText(page, '次へ  →');
        log.info('click next');
        await delay(1000);
        log.info('次へをクリック');

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[次へ]ボタンをクリック' 
      }).show();
    `);
        await clickByText(page, '次へ  →');
        log.info('click next');
        await delay(1000);
        log.info('次へをクリック');

        await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ブログ名の入力開始' 
      }).show();
    `);
        await page.$eval('#BlogConf_siteName', (el, value) => (el.value = value), '');
        await page.type('#BlogConf_siteName', blogInfo.title, { delay: 120 });
        log.info(`サイトタイトルを入力: ${blogInfo.title}`);
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログ名の入力完了' 
      }).show();
    `);

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[次へ]ボタンをクリック' 
      }).show();
    `);
        await clickByText(page, '次へ  →');
        log.info('click next');
        await delay(1000);
        log.info('次へをクリック');

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'サイトの説明の入力開始' 
      }).show();
    `);
        await page.$eval('#BlogConf_siteComment', (el, value) => (el.value = value), '');
        await page.type('#BlogConf_siteComment', blogInfo.description);
        log.info(`サイトの説明を入力: ${blogInfo.description}`)
        await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'サイトの説明の入力開始' 
      }).show();
    `);

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[次へ]ボタンをクリック' 
      }).show();
    `);
        await clickByText(page, '次へ  →');
        log.info('click next');
        await delay(1000);

        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[設定を変更する]ボタンをクリック' 
      }).show();
    `);
        await page.click('input[value="設定を変更する"]');
        log.info('click: [設定を変更する]')
        await delay(1000);

        log.info('ブログ登録完了');

        await page.addStyleTag({ path: swa2Css });
        await page.addScriptTag({ path: swa2Js });

        const closeConfirm = await page.evaluate(`swal({
      title: '楽天ブログの作成が完了しました。',
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
        log.warn('会員登録の完了ページにアクセスできません。');
        throw new Error('会員登録の完了ページにアクセスできません。');
      }

    } else {
      log.warn('入力内容確認ページにアクセス出来ません。');
      throw new Error('入力内容確認ページにアクセス出来ません。')
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
  ;
}

export default signup;
