/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import jaconv from 'jaconv';
import clickByText from '../../../utils';
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
    await clickByText(page, '楽天会員登録（無料）');
    log.info('click [新規登録]ボタンクリック');
    await page.waitForSelector('#entryBtn', { timeout: 5000 });

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

    // mailAddress input
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力開始' 
      }).show();
    `);
    await delay(1000);
    await page.type('input[name="email"]', blogInfo.mailAddress, { delay: 80 });
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
    await page.type('input[name="email2"]', blogInfo.mailAddress);
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
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始' 
      }).show();
    `);
    await page.type('#p_id', blogInfo.password);
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
    await page.type('input[name="lname"]', blogInfo.lastName);
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
        type: 'success',
        layout: 'topLeft',
        text:'名の入力開始' 
      }).show();
    `);
    await page.type('input[name="fname"]', blogInfo.firstName);
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
    await page.type('input[name="lname_kana"]', jaconv.toKatakana(blogInfo.lastNameKana));
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
        type: 'success',
        layout: 'topLeft',
        text:'名(フリガナ)の入力開始' 
      }).show();
    `);
    await page.type('input[name="fname_kana"]', jaconv.toKatakana(blogInfo.firstNameKana));
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
        type: 'success',
        layout: 'topLeft',
        text: '誕生日-月-を選択開始'
      }).show();
    `);
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
    if (blogInfo.gender) {
      await page.click('input[name="sex"][value="F"]');
      log.info('click gender: female');
    } else {
      await page.click('input[name="sex"][value="M"]');
      log.info('click gender: male');
    }

    // ニックネーム
    await page.evaluate(`
    new Noty({
      type: 'success',
      layout: 'topLeft',
      text:'ニックネームの入力開始'
    }).show();
    `);
    // await page.type('input[name="nickname"]', `ffffff`);
    await page.type('input[name="nickname"]', `${blogInfo.accountId}${birthdayParts[0]}${birthdayParts[1]}${birthdayParts[2]}`);
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
    await page.click('input[name="execMethod"]');
    log.info('click: 同意して次へ');

    await page.waitFor('#contents > h2');
    let title = await page.$eval('#contents > h2', item => {
      return item.textContent
    });
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

      title = await page.$eval('#contents > h2', item => {
        return item.textContent
      });

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
        // #regist3Form > p:nth-child(6) > input[type="submit"]
        await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[続けてサービスを利用する]ボタンをクリック' 
      }).show();
    `);
        await page.click('p.submit > input')
        await page.waitFor('#myplaza_regist_base_url');


        await page.type('#myplaza_regist_base_url', blogInfo.accountId, { delay: 240 });

        // captcha
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

        await page.waitFor('#myplaza_regist_confirm_complete', { timeout: 300000 })
        // この内容で登録する
        await page.click('#myplaza_regist_confirm_complete');
        await page.waitFor('#contents > div > div.cosMt60.cosMb40 > div > a');
        // #contents > div > div.cosMt60.cosMb40 > h2

        // すぐにブログを始める
        await clickByText(page, 'すぐにブログを始める');
        await page.waitFor('.introjs-helperLayer');

        await clickByText(page, '次へ  →');
        await delay(1000);
        log.info('次へをクリック');

        await clickByText(page, '次へ  →');
        await delay(1000);
        log.info('次へをクリック');

        await clickByText(page, '次へ  →');
        await delay(1000);
        log.info('次へをクリック');

        await page.$eval('#BlogConf_siteName', (el, value) => (el.value = value), '');
        await page.type('#BlogConf_siteName', blogInfo.title, { delay: 120 });
        log.info(`サイトタイトルを入力: ${blogInfo.title}`);
        await clickByText(page, '次へ  →');
        await delay(1000);
        log.info('次へをクリック');

        await page.$eval('#BlogConf_siteComment', (el, value) => (el.value = value), '');
        await page.type('#BlogConf_siteComment', blogInfo.description);
        log.info(`サイトの説明を入力: ${blogInfo.description}`)
        await clickByText(page, '次へ  →');
        await delay(1000);

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
