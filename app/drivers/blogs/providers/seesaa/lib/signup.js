/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';
import jaconv from 'jaconv';

import getValidationLink from '../../../../emails/imap';

const prefectureValue = [
  { value: '01', prefecture: '北海道' },
  { value: '02', prefecture: '青森県' },
  { value: '03', prefecture: '岩手県' },
  { value: '04', prefecture: '宮城県' },
  { value: '05', prefecture: '秋田県' },
  { value: '06', prefecture: '山形県' },
  { value: '07', prefecture: '福島県' },
  { value: '08', prefecture: '茨城県' },
  { value: '09', prefecture: '栃木県' },
  { value: '10', prefecture: '群馬県' },
  { value: '11', prefecture: '埼玉県' },
  { value: '12', prefecture: '千葉県' },
  { value: '13', prefecture: '東京都' },
  { value: '14', prefecture: '神奈川県' },
  { value: '15', prefecture: '新潟県' },
  { value: '16', prefecture: '富山県' },
  { value: '17', prefecture: '石川県' },
  { value: '18', prefecture: '福井県' },
  { value: '19', prefecture: '山梨県' },
  { value: '20', prefecture: '長野県' },
  { value: '21', prefecture: '岐阜県' },
  { value: '22', prefecture: '静岡県' },
  { value: '23', prefecture: '愛知県' },
  { value: '24', prefecture: '三重県' },
  { value: '25', prefecture: '滋賀県' },
  { value: '26', prefecture: '京都府' },
  { value: '27', prefecture: '大阪府' },
  { value: '28', prefecture: '兵庫県' },
  { value: '29', prefecture: '奈良県' },
  { value: '30', prefecture: '和歌山県' },
  { value: '31', prefecture: '鳥取県' },
  { value: '32', prefecture: '島根県' },
  { value: '33', prefecture: '岡山県' },
  { value: '34', prefecture: '広島県' },
  { value: '35', prefecture: '山口県' },
  { value: '36', prefecture: '徳島県' },
  { value: '37', prefecture: '香川県' },
  { value: '38', prefecture: '愛媛県' },
  { value: '39', prefecture: '高知県' },
  { value: '40', prefecture: '福岡県' },
  { value: '41', prefecture: '佐賀県' },
  { value: '42', prefecture: '長崎県' },
  { value: '43', prefecture: '熊本県' },
  { value: '44', prefecture: '大分県' },
  { value: '45', prefecture: '宮崎県' },
  { value: '46', prefecture: '鹿児島県' },
  { value: '47', prefecture: '沖縄県' },
  { value: '48', prefecture: '海外' }
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

  log.info('--------->create seesaa blog account--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Seesaa login/signup page
    await page.goto('http://blog.seesaa.jp/');
    log.info('access: http://blog.seesaa.jp/');

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'Seesaaブログ ログインページアクセス完了' 
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
    await page.click('a[href^="https://ssl.seesaa.jp/pages/welcome/regist/"]');
    await page.waitForSelector('#member__email', { timeout: 5000 });

    // mailAddress
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
    await page.type('#member__email', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス入力完了' 
      }).show();
    `);
    log.info(`mailAddress:${blogInfo.mailAddress}入力完了`);

    // mailAddress confirm
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス(確認)入力開始' 
      }).show();
    `);
    await page.type('#member__email_confirm', blogInfo.mailAddress);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'メールアドレス(確認)入力完了' 
      }).show();
    `);
    log.info(`mailAddress(confirm):${blogInfo.mailAddress}入力完了`);

    // password
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

    // password confirm
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力開始' 
      }).show();
    `);
    await page.type('#password_confirm', blogInfo.password);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'パスワード(確認)入力完了' 
      }).show();
    `);
    log.info(`password(confirm):${blogInfo.mailAddress}入力完了`);

    // name
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'氏名入力開始' 
      }).show();
    `);
    await page.type('#member__name', `${blogInfo.lastName} ${blogInfo.firstName}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'氏名入力完了' 
      }).show();
    `);
    log.info(`name:${`${blogInfo.lastName} ${blogInfo.firstName}`}入力完了`);

    // name kana
    const lastNameFurigana = jaconv.toKatakana(blogInfo.lastNameKana);
    const firstNameFurigana = jaconv.toKatakana(blogInfo.firstNameKana);
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'氏名(フリガナ)入力開始' 
      }).show();
    `);
    await page.type('#member__name_read', `${lastNameFurigana} ${firstNameFurigana}`);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'氏名(フリガナ)入力完了' 
      }).show();
    `);
    log.info(`name カタカナ:${`${lastNameFurigana} ${firstNameFurigana}`}入力完了`);

    const prefect = prefectureValue.find(p => p.prefecture === blogInfo.prefecture);

    if (!prefect) {
      log.warn('都道府県からSeesaa居住地の変換に失敗しました。');
      throw new Error('都道府県からSeesaa居住地の変換に失敗しました。');
    }

    // 居住地
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'居住地入力開始' 
      }).show();
    `);
    await page.select('select#member_profile__pref_code', prefect.value);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'居住地入力完了' 
      }).show();
    `);
    log.info(`居住地: ${blogInfo.prefecture}-${prefect.value}-入力完了`);

    // 性別
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'性別入力開始' 
      }).show();
    `);
    if (blogInfo.gender) {
      await page.click('#member_profile__sex_code_2');
      log.info(`性別:女`);
    } else {
      await page.click('#member_profile__sex_code_1');
      log.info('性別:男');
    }
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'性別入力完了' 
      }).show();
    `);

    // occupation
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'職業入力開始' 
      }).show();
    `);
    await page.select(
      'select#member_profile__employment_style_code',
      blogInfo.detailInfo.occupationValue
    );
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'職業入力完了' 
      }).show();
    `);
    log.info(`職業: ${blogInfo.occupation}-入力完了`);

    // birthDate
    const birthday = blogInfo.birthDate.split('/');
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'生年月日入力開始' 
      }).show();
    `);
    await page.type('#birthday_year', birthday[0]);
    await delay(500);
    await page.type('#birthday_month', birthday[1]);
    await delay(500);
    await page.type('#birthday_mday', birthday[2]);
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'生年月日入力完了' 
      }).show();
    `);
    log.info(`生年月日: ${blogInfo.birthDate}-入力完了`);

    // 配偶者
    await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'配偶者入力開始' 
      }).show();
    `);
    if (blogInfo.detailInfo.spouseValue) {
      await page.click('#member_profile__married_1');
      log.info(`配偶者:あり`);
    } else {
      await page.click('#member_profile__married_0');
      log.info('配偶者:なし');
    }
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'配偶者入力完了' 
      }).show();
    `);

    // 子ども
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'子ども入力開始' 
      }).show();
    `);
    if (blogInfo.detailInfo.childrenValue) {
      await page.click('#member_profile__has_child_1');
      log.info(`子ども:あり`);
    } else {
      await page.click('#member_profile__has_child_0');
      log.info('子ども:なし');
    }
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'子ども入力完了' 
      }).show();
    `);
    await page.evaluate(`Noty.closeAll();`);
    // captcha

    let captchaValue = '';
    let isCaptchaError = true;

    do {
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });

      await page.evaluate(`Noty.closeAll();`);
      await page.focus('#captcha_answer');

      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });
      await page.evaluate(`Noty.closeAll();`);
      captchaValue = await page.evaluate(`swal({
      title: '認証',
      text: '問題の答えを入力し、認証ボタンをクリックしてください。',
      input: 'text',
      inputPlaceholder: '問題の答えを入力',
      confirmButtonText: '認証',
      position: 'top-start'
    })`);

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'問題の答え欄へ[${captchaValue.value}]を入力開始' 
      }).show();
    `);

      await page.$eval('#captcha_answer', (el, value) => (el.value = value), '');
      await page.type('#captcha_answer', captchaValue.value, { delay: 100 });
      log.info(`input:画像認証へ-${captchaValue.value}-を入力`);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'問題の答え欄へ[${captchaValue.value}]を入力完了' 
      }).show();
    `);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[利用規約に同意の上、アカウントを登録する]をクリック' 
      }).show();
    `);
      await page.click('input[value="利用規約に同意の上、アカウントを登録する"]');
      log.info('[利用規約に同意の上、アカウントを登録する]をクリック');

      await page.waitFor('.error, .finished');

      const successMessage = await page.$('.finished');
      console.log('--successMessage');
      console.log(successMessage);
      75266;
      if (successMessage) {
        isCaptchaError = false;
      }

      let errors;
      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      if (isCaptchaError) {
        try {
          errors = await page.$eval('.error > p', item => {
            return item.textContent;
          });
        } catch (error) {
          await page.evaluate(`swal({
            type: 'error',
            title: 'エラー項目の取得に失敗',
            text: 'エラー確認が出来ません。'
          })`);
        }

        if (errors) {
          log.warn(`errors: ${errors}`);
          const errorRows = errors.split('\n');
          log.warn(`errors count: ${errorRows.length}`);
          let tryContinue = false;
          const realErrors = [];
          for (let i = 0; i < errorRows.length; i++) {
            if (errorRows[i].length > 0 && errorRows[i] !== '問題の答えが違います。') {
              realErrors.push(errorRows[i]);
            }
          }
          console.log(`realError count: ${realErrors.length}`);
          if (realErrors.length > 0) {
            tryContinue = true;
          }

          if (tryContinue) {
            await page.evaluate(`swal({
            type: 'error',
            title: 'エラー項目あり',
            text: '認証以外のエラーがあります。'
          })`);

            return;
          }
        }
      }
    } while (isCaptchaError);

    log.info('Seesaa仮登録完了');

    // ---------仮登録完了
    await page.goto('https://tools.yoriki.cloud/countdown/');
    log.info('メール到着60秒待機');
    await page.waitForSelector('#blind', { timeout: 70000 });

    // ---------メールアカウントへアクセス  本登録URLを習得

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

      await page.goto(result[0], { waitUntil: 'load' });
      await page.waitForSelector('.finished');
      log.info('本登録完了');

      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'登録完了、ブログトップページへアクセスします。' 
      }).show();
    `);

      // ブログトップページへ
      await page.goto('http://blog.seesaa.jp/', { waitUntil: 'load' });
      await delay(1000);
      log.info('ブログトップページへアクセス完了');

      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログトップページへアクセス完了' 
      }).show();
    `);

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'[マイブログ]ボタンクリック' 
      }).show();
    `);

      // ブログ設定ページ
      await page.goto('http://blog.seesaa.jp/cms/home/', { waitUntil: 'load' });
      await delay(1000);
      log.info('ブログ設定ページへアクセス完了');
      await page.addScriptTag({ path: notyJsPath });
      await page.addStyleTag({ path: notyCssPath });
      await page.addStyleTag({ path: notyThemePath });
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログ設定ページへアクセス完了' 
      }).show();
    `);

      // blog title
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトル入力開始' 
      }).show();
    `);
      await page.type('input[name="blog__title"]', blogInfo.title);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログタイトル入力完了' 
      }).show();
    `);
      log.info(`input blog title: ${blogInfo.title}`);

      // blog description
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ブログ説明入力開始' 
      }).show();
    `);
      await page.type('textarea[name="blog__description"]', blogInfo.description);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ブログ説明入力完了' 
      }).show();
    `);
      log.info(`input description: ${blogInfo.description}`);

      // sub domain
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ホスト名入力開始' 
      }).show();
    `);
      await page.type('input[name="blog__name"]', blogInfo.accountId);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ホスト名入力完了' 
      }).show();
    `);
      log.info(`input sub domain: ${blogInfo.accountId}`);

      // nick name
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'ニックネーム:入力開始' 
      }).show();
    `);
      await page.type('input[name="blog__nickname"]', blogInfo.detailInfo.nickNameValue);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'ニックネーム入力完了' 
      }).show();
    `);
      log.info(`input nickName: ${blogInfo.detailInfo.nickNameValue}`);

      // category
      await page.evaluate(`
    new Noty({
        killer: true,
        type: 'success',
        layout: 'topLeft',
        text:'カテゴリ選択開始' 
      }).show();
    `);
      await page.select('select[name="blog_category_id"]', blogInfo.detailInfo.categoryValue);
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'カテゴリ選択完了' 
      }).show();
    `);
      log.info(`select category: ${blogInfo.detailInfo.categoryValue}`);

      // captcha
      isCaptchaError = true;
      captchaValue = '';
      await page.evaluate(`Noty.closeAll();`);
      do {
        await page.addScriptTag({ path: notyJsPath });
        await page.addStyleTag({ path: notyCssPath });
        await page.addStyleTag({ path: notyThemePath });

        await page.focus('input[name="captcha_code"]');
        await page.$eval('input[name="captcha_code"]', (el, value) => (el.value = value), '');

        await page.addStyleTag({ path: swa2Css });
        await page.addScriptTag({ path: swa2Js });

        captchaValue = await page.evaluate(`swal({
          title: '画像認証',
          text: '画像に文字・数字が正常に表示されない場合、空欄で認証ボタンをクリックしてください。',
          input: 'text',
          inputPlaceholder: '画像にある数字を入力',
          confirmButtonText: '認証',
          position: 'top-start'
        })`);
        await page.$eval('input[name="captcha_code"]', (el, value) => (el.value = value), '');
        await page.type('input[name="captcha_code"]', captchaValue.value);
        log.info(`input captcha: ${captchaValue.value}`);

        // click submit
        await page.click('input[value="ブログを作る"]');
        log.info(`click submit`);

        // error check
        await page.waitFor('h4.alert-header');
        const success = await page.$eval('h4.alert-header', item => {
          return item.textContent;
        });
        console.log(`--result:${success}`);

        if (success === '新しいブログを作成しました。') {
          console.log('--complete--');
          isCaptchaError = false;
        } else {
          // "認証コードが不正です。画像の中の数字を入力してください。"
          console.log('-----captcha error----');
          const errors = await page.$$('.alert-list > li');
          console.log(`error count:${errors.length}`);
          let isCriticalError = false;
          if (errors.length === 1) {
            const textContent = await (await errors[0].getProperty('textContent')).jsonValue();
            console.log(`error textContent:${textContent}`);
            if (textContent !== '認証コードが不正です。画像の中の数字を入力してください。') {
              isCriticalError = true;
            }
          } else if (errors.length > 1) {
            isCriticalError = true;
          }
          if (isCriticalError) {
            await page.addStyleTag({ path: swa2Css });
            await page.addScriptTag({ path: swa2Js });

            await page.evaluate(`swal({
              'error',
              '画像認証以外のエラーがあります。
            })`);
          }
        }
      } while (isCaptchaError);

      log.info('Seesaaブログ作成完了');
      log.info('--------------------------->');
      await page.addStyleTag({ path: swa2Css });
      await page.addScriptTag({ path: swa2Js });

      const closeConfirm = await page.evaluate(`swal({
      title: 'Seesaaブログの作成が完了しました。',
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
      throw new Error('本登録URLの取得に失敗しました。');
    }
  } catch (error) {
    log.error(`error:${error.toString()}`);
    await page.addStyleTag({ path: swa2Css });
    await page.addScriptTag({ path: swa2Js });

    await page.evaluate(`swal({
      title: 'エラー発生',
      text: 'お手数ですが、手作業で続けていただくか、登録済みのアカウントを削除してください。',
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
