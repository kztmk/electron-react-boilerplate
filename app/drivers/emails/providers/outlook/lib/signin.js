import delay from 'delay';

const signin = async (user, opts) => {
  const { browser } = opts;

  const page = await browser.newPage();
  await page.goto('https://login.live.com/');

  await page.waitFor('input[type=email]', { visible: true });
  await page.type('input[type=email]', user.email);
  await page.click('input[type=submit]');

  await page.waitFor('input[type=password]', { visible: true });
  await page.type('input[type=password]', user.password);

  await page.waitFor('input[type=checkbox]', { visible: true });
  await page.click('input[type=checkbox]');

  await Promise.all([
    page.waitForNavigation(),
    page.click('input[type=submit]')
  ]);

  await page.waitFor('.c-action-menu');
  await delay(500);
  console.log('click drop down');

  await page.click('.c-action-menu > .c-action-trigger');
  await page.waitFor('.mee-icon-Mail', { timeout: 500 });
  await page.click('.mee-icon-Mail');

  // should now be at
  // https://account.microsoft.com/?lang=en-US&refd=account.live.com&refp=landing

  // await page.close()
};

export default signin;
