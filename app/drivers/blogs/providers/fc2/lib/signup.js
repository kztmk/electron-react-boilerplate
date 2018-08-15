/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';

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

  log.info('--------->create fc2 blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  log.info('create: browser page');
  try {
    // Fc2 login/signup page
    await page.goto(`https://fc2.com/login.php`, { waitUntil: 'load' });

    log.info('access: https://fc2.com/login.php');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'FC2ブログ ログインページアクセス完了' 
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
    await page.click('img[src="//static.fc2.com/share/fc2footermenu/blank.gif"]');
    await page.waitForSelector('#email', { timeout: 5000 });

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
    await page.type('#email', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    await page.evaluate(`Noty.closeAll();`);
    // captcha
    let isCapchaError = true;
    do {
      if (await page.$('.image-auth > img')) {
        await page.waitFor('.image-auth > img', { visible: true });
      }
      await delay(2000);

      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'画像認証入力待ち',
        killer: true
      }).show();
    `);

      await page.addStyleTag({ path: swa2Css });
      await page.addStyleTag({
        content:
          '.captchaImage{border:1px solid rgba(51,51,51,0.3);border-radius:12px;padding:10px 15px;'
      });
      await page.addScriptTag({ path: swa2Js });
      await page.evaluate(`Noty.closeAll();`);
      const captchaValue = await page.evaluate(`swal({
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

      await page.type('#auth_number', captchaValue.value, { delay: 100 });
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
        text:'[利用規約に同意しFC2IDへ登録する]をクリック' 
      }).show();
    `);
      await page.click('input[name="Submit2"]');
      log.info('[利用規約に同意しFC2IDへ登録する]をクリック');

      await page.waitFor('.signup_attention_msg, .sh_heading_main_b');
      const successMessege = await page.$eval('.sh_heading_main_b', item => {
        return item.textContent;
      });

      if (successMessege) {
        isCapchaError = false;
      }
    } while (isCapchaError);

    log.info('FC2ID仮登録完了');
    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'仮登録メールから本登録用リンクを取得します。',
        killer: true
      }).show();
    `);

    // email log in and get link
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
