/* eslint-disable no-await-in-loop */
import delay from 'delay';
import log from 'electron-log';

const open = async (blogInfo, opts) => {
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

  log.info('--------->open top page--------->');
  log.info('-----------user----------');
  log.info(blogInfo);
  log.info('-------------------------');
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 748 });

  log.info('create: browser page');
  try {
    // Fc2 login/signup page
    // await page.goto(blogInfo.url, { waitUntil: 'load' });
    await page.goto('https://www.ninja.co.jp/register/input/hash/1114e567fa1c79f49ca07752be4e5ab0f331ba9a', { waitUntil: 'load'});
    log.info(`access: ${blogInfo.url}`);

    await page.addScriptTag({ path: notyJsPath });
    await page.addStyleTag({ path: notyCssPath });
    await page.addStyleTag({ path: notyThemePath });
    await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'忍者ブログ トップページアクセス完了' 
      }).show();
    `);

      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'利用規約に同意を選択開始' 
      }).show();
    `);
      await page.click('#registerInputRule');
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'利用規約に同意を選択完了' 
      }).show();
    `);

      log.info('click: 利用規約に同意')
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'個人情報の取扱に同意を選択開始' 
      }).show();
    `);

      await page.click('#registerInputPrivacy');
      await page.evaluate(`
    new Noty({
        type: 'success',
        layout: 'topLeft',
        text:'個人情報の取扱に同意を選択完了' 
      }).show();
    `);

      log.info('click: 個人情報の取扱に同意')

    await page.evaluate(`Noty.closeAll();`);

     await page.focus('#registerInputSend > input');
     await delay(3000);
    // button
    const submit = await page.$('#registerInputSend > input');
    const {x, y, width, height} = await submit.boundingBox();
    console.log(`x:${x}, y:${y}, w:${width}, h:${height}`);
    // await submit.click();
    await page.mouse.click(x+10, y+10);
    console.log('click');
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

export default open;
