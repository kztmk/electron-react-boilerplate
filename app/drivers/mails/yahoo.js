import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const createYahoo = accountInfo => {
  puppeteer.launch(
    headless: false,
    slowMo: 200
  ).then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.yahoo.co.jp/');
  await page.setViewport({ width: 1200, height: 800 });
  await page.click('.Personalbox__noticeItem--mail > .Personalbox__noticeLink')
  await page.click('.MainVisual__box > .button--main')
  await page.click('#linkChangeRegMode > a')
  await page.type('#yid', accountInfo.accountId)
  await page.type('#passwd', accountInfo.password)
  await page.type('#chkShowPasswd', 'on')
  await page.type('#postCode', accountInfo.detailInfo.postalCode)
  await page.type('#birthday', accountInfo.detailInfo.birthDate)
  await page.type('#dispname', accountInfo.detailInfo.)
    if (accountInfo.gender === 0) {
      await page.click('#female', 'm')
  } else {
      await page.click('#female', 'f')
  }
  await page.select('select#pw_q', accountInfo.question)
  await page.type('#pw_a', accountInfo.answer)
  await page.type('#deliver', '1')
  await page.type('#nonexistence', 'chk_no_tcard')
  await screenshotDOMElement({

    selector: 'contents1',
    padding: 10
  })
  await page.type('#secword', )
  await page.click('#btnSubmit')
};

  /**
   * Takes a screenshot of a DOM element on the page, with optional padding.
   *
   * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
   * @return {!Promise<!Buffer>}
   */
  async function screenshotDOMElement(opts = {}) {
    const padding = 'padding' in opts ? opts.padding : 0;
    const path = 'path' in opts ? opts.path : null;
    const selector = opts.selector;
    const page = opts.page;

    if (!selector)
      throw Error('Please provide a selector.');

    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (!element)
        return null;
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);

    if (!rect)
      throw Error(`Could not find element that matches selector: ${selector}.`);

    return await page.screenshot({
      path,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    });
  }

  export createYahoo
