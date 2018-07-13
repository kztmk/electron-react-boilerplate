/* eslint-disable no-await-in-loop */
import delay from 'delay';
import tempy from 'tempy';
import fs from 'fs';

async function base64Encode(path) {
  const bitmap = fs.readFileSync(path);
  return Buffer.from(bitmap).toString('base64');
}

const signup = async (user, opts) => {
  const { browser } = opts;

  const page = await browser.newPage();
  await page.goto('https://signup.live.com/signup');

  // email / username and select domain
  // --------------------------------

  await page.waitFor('#liveSwitch', { visible: true });
  await page.click('#liveSwitch', { delay: 10 });
  await delay(100);
  await page.click('#domainLabel');
  await delay(500);
  switch (user.domain) {
    case 'outlook.jp':
      await page.click('#domain0');
      break;
    case 'outlook.com':
      await page.click('#domain1');
      break;
    case 'hotmail.com':
      await page.click('#domain2');
      break;
    default:
  }

  let error = null;

  await page.type('#MemberName', user.username, { delay: 40 });
  await delay(250);
  await page.click('#iSignupAction', { delay: 20 });

  await delay(1000);
  error = await page.$('#MemberNameError');

  if (error) {
    throw new Error('アカウントIDは既に使用されています。');
  }

  console.log(JSON.stringify(user, null, 2));

  // password
  // -------------------

  await page.waitFor('#Password', { visible: true });
  await delay(100);
  await page.type('#Password', user.password, { delay: 10 });
  await delay(100);
  await page.click('#iOptinEmail', { delay: 10 });
  await delay(100);
  await page.click('#iSignupAction', { delay: 30 });

  // first and last name
  // -------------------

  await page.waitFor('#FirstName', { visible: true });
  await delay(100);
  await page.type('#FirstName', user.firstName, { delay: 30 });
  await delay(120);
  await page.type('#LastName', user.lastName, { delay: 35 });
  await delay(260);
  await page.click('#iSignupAction', { delay: 25 });

  // birth date
  // ----------

  await page.waitFor('#BirthMonth', { visible: true });
  await delay(100);
  await page.select('#BirthMonth', user.birthday.month);
  await delay(120);
  await page.select('#BirthDay', user.birthday.day);
  await delay(260);
  await page.select('#BirthYear', user.birthday.year);
  await delay(220);
  await page.click('#iSignupAction', { delay: 8 });

  // captcha or sms validation
  // -------------------------

  await delay(1000);

  if (await page.$('#hipTemplateContainer')) {
    // captcha
    let isChaptchaError = true;
    await page.waitFor('#hipTemplateContainer img', { visible: true });

    // captcha clear
    do {
      // in case of left previous input
      await page.focus('#hipTemplateContainer input');
      const inputCaptcha = await page.$eval('#hipTemplateContainer input', elm => elm.value);
      if (inputCaptcha && inputCaptcha.length > 0) {
        await page.focus('#hipTemplateContainer input');
        for (let i = 0; i < inputCaptcha.length; ++i) {
          await page.keyboard.press('Backspace');
        }
      }
      const $img = await page.$('#hipTemplateContainer img');
      const captchaPath = tempy.file({ extension: 'png' });
      await $img.screenshot({
        path: captchaPath
      });

      console.log({ captchaPath });
      console.log(`Current directory: ${process.cwd()}`);
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
        confirmButtonText: '認証',
        allowOutsideClick: false
      })`);

      console.log(`input captcha:${captchaValue.value}`);

      await page.type('#hipTemplateContainer input', captchaValue.value, { delay: 40 });
      console.log('enter value');

      await page.click('#iSignupAction', { delay: 9 });

      console.log(`click next`);

      await delay(1000);
      console.log('wait 1sec');
      try {
        const newCaptcha = await page.waitFor('#hipTemplateContainer img', {
          timeout: 1000,
          visible: true
        });
        console.log('got captcha image again, you might enter wrong characters.');
      } catch (e) {
        console.log('you solved captcha');
        isChaptchaError = false;
      }
    } while (isChaptchaError);
  } else {
    // TODO: handle case of sms validation
    await page.waitForNavigation({ timeout: 0 });
  }
  console.log('resolved captcha');
  // main account page
  // -----------------

  await delay(500);
  await page.goto('https://www.outlook.com/?refd=account.microsoft.com&fref=home.banner.profile');

  console.log('nav to home.banner.profile');
  // inbox page first-run
  // --------------------

  await delay(800);

  // keep pressing next...
  while (true) {
    if (!await page.$('.dialog button.nextButton')) break;
    await page.click('.dialog button.nextButton', { delay: 5 });
    console.log('click next button');
    await delay(220);
  }

  // wait until "let's go" button appears...
  while (true) {
    await delay(1000);
    if (await page.$('.dialog button.primaryButton')) break;
  }
  console.log('click lets go button');

  await delay(120);
  await Promise.all([
    page.waitForNavigation(),
    page.click('.dialog button.primaryButton', { delay: 7 })
  ]);

  console.log('done');
  // should now be at https://outlook.live.com/mail/inbox
  // await page.close();
};

export default signup;
