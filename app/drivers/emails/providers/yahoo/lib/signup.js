import fs from 'fs';
import delay from 'delay';
import tempy from 'tempy';

async function base64Encode(path) {
  const bitmap = fs.readFileSync(path);
  return Buffer.from(bitmap).toString('base64');
}

const signup = async (user, opts) => {
  const { browser } = opts;

  console.log('-----------user----------');
  console.log(user);
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // Yahoo! Japan top page
  await page.goto(`https://www.yahoo.co.jp`, { waitUntil: 'load' });

  await page.addScriptTag({ path: './app/drivers/noty/noty.min.js' });
  await page.addStyleTag({ path: './app/drivers/noty/noty.css' });
  await page.addStyleTag({ path: './app/drivers/noty/mint.css' });
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahoo Japan トップページアクセス完了' 
      }).show();
    `);

  // go to mail accout application form
  // click 'create mail account(メールアドレス取得)'
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Yahooメールリンクをクリックしました。' 
      }).show();
    `);
  await page.click('.Personalbox__noticeItem--mail > .Personalbox__noticeLink');
  await page.waitForSelector('.button--main');

  // click 'create now(今すぐメールアドレスを作る)'
  await page.addScriptTag({ path: './app/drivers/noty/noty.min.js' });
  await page.addStyleTag({ path: './app/drivers/noty/noty.css' });
  await page.addStyleTag({ path: './app/drivers/noty/mint.css' });
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[今すぐメールアドレスを作る]をクリック' 
      }).show();
    `);
  await page.click('.MainVisual__box > .button--main');
  await page.waitForSelector('#yid');

  // [メールアドレスなしで登録する]をクリック
  await page.addScriptTag({ path: './app/drivers/noty/noty.min.js' });
  await page.addStyleTag({ path: './app/drivers/noty/noty.css' });
  await page.addStyleTag({ path: './app/drivers/noty/mint.css' });
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[メールアドレスなしで登録する]をクリック' 
      }).show();
    `);
  await page.click('#linkChangeRegMode > a'); // click create without contact mail address

  // YahooID
  // -------
  let error = '';
  await page.addScriptTag({ path: './app/drivers/noty/noty.min.js' });
  await page.addStyleTag({ path: './app/drivers/noty/noty.css' });
  await page.addStyleTag({ path: './app/drivers/noty/mint.css' });

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
  error = await page.$eval('#tipTxt', el => el.className);
  if (error.indexOf('chkYidNG') > -1) {
    await page.evaluate(`
    new Noty({
        type: 'error',
        layout: 'topLeft',
        text:'このYahoo IDは既に使用されています。' 
      }).show();
    `);
    throw new Error('入力されたYahooIDは、既に使われています。');
  }

  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード入力開始',
        killer: true
      }).show();
    `);
  await page.type('#passwd', user.password, { delay: 5 }); // password
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
  await page.type('#birthday', `${user.birthday.year}${user.birthday.month}${user.birthday.day}`, {
    delay: 33
  }); // birthdate YYYYMMDD
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
  await page.type('#dispname', `${user.lastName} ${user.firstName}`, { delay: 50 }); // user lastName firstName
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
  if (user.gender === 0) {
    await page.click('#mail', 'm', { delay: 20 });
  } else {
    await page.click('#female', 'f', { delay: 25 });
  }
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'性別入力完了' 
      }).show();
    `);
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問入力開始',
        killer: true
      }).show();
    `);
  await page.select('select#pw_q', user.secret.question); // password recovery question
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問入力完了' 
      }).show();
    `);
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問の答え入力開始' 
      }).show();
    `);
  await page.type('#pw_a', user.secret.answer, { delay: 30 }); // password recovery answer
  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'秘密の質問の答え入力完了' 
      }).show();
    `);
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
  do {
    const captchaPath = tempy.file({ extension: 'png' });
    if (await page.$('#cimg')) {
      await page.waitFor('#cimg', { visible: true });

      const $img = await page.$('#cimg');
      await $img.screenshot({
        path: captchaPath
      });

      console.log({ captchaPath });
    }

    await delay(2000);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'画像認証入力待ち',
        killer: true
      }).show();
    `);
    await page.addStyleTag({ path: './app/drivers/sweetalert2/sweetalert2.min.css' });
    await page.addStyleTag({
      content:
        '.captchaImage{border:1px solid rgba(51,51,51,0.3);border-radius:12px;padding:10px 15px;'
    });
    await page.addScriptTag({ path: './app/drivers/sweetalert2/sweetalert2.all.min.js' });

    const imageData = await base64Encode(captchaPath);
    const captchaValue = await page.evaluate(`swal({
      title: '画像認証',
      text: '画像に文字・数字が正常に表示されない場合、空欄で認証ボタンをクリックしてください。',
      imageUrl: 'data:image/jpg;base64,${imageData}',
      imageClass: 'captchaImage',
      input: 'text',
      inputPlaceholder: '画像にある文字・数字を入力',
      confirmButtonText: '認証'
    })`);

    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'画像認証へ[${captchaValue.value}]を入力開始' 
      }).show();
    `);

    await page.type('#secword', captchaValue.value);

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

    console.log(errorFields);
    console.log(`error cout:${errorFields.length}`);

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
  await page.addScriptTag({ path: './app/drivers/noty/noty.min.js' });
  await page.addStyleTag({ path: './app/drivers/noty/noty.css' });
  await page.addStyleTag({ path: './app/drivers/noty/mint.css' });

  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[同意して登録する]をクリック' 
      }).show();
    `);
  await page.click('#commit');
  console.log('click commit');
  await page.waitFor('.msgComplete');
  await page.$('#msgComplete');

  // a ご利用中のサービスに戻るをクリック
  await page.addScriptTag({ path: './app/drivers/noty/noty.min.js' });
  await page.addStyleTag({ path: './app/drivers/noty/noty.css' });
  await page.addStyleTag({ path: './app/drivers/noty/mint.css' });

  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[ご利用中のサービスに戻る]をクリック' 
      }).show();
    `);
  page.click('a[href^="https://mail.yahoo.co.jp"]');
  console.log('done!!!!!!');
  await page.waitFor('#masthead');

  // 「さっそく使ってみよう」をクリック
  await page.addScriptTag({ path: './app/drivers/noty/noty.min.js' });
  await page.addStyleTag({ path: './app/drivers/noty/noty.css' });
  await page.addStyleTag({ path: './app/drivers/noty/mint.css' });

  await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[さっそく使ってみよう]をクリック' 
      }).show();
    `);
  await page.click('.start');
  await page.waitFor('#tabinbox');

  await page.addStyleTag({ path: './app/drivers/sweetalert2/sweetalert2.min.css' });
  await page.addScriptTag({ path: './app/drivers/sweetalert2/sweetalert2.all.min.js' });

  const closeConfirm = await page.evaluate(`swal({
      title: 'Yahoo！メールアカウントの作成が完了しました。',
      text: 'ブラウザを閉じてもよろしいですか？',
      type: 'info',
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
};

export default signup;
