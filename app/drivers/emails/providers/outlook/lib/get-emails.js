const delay = require('delay');
const pMap = require('p-map');

const getEmail = require('./get-email');

const getEmails = async opts => {
  const { browser, query } = opts;

  const page = await browser.newPage();
  await page.goto('https://outlook.live.com/mail/inbox');

  // search for an input query to narrow down email results
  // TODO: don't require a search query
  await page.waitFor('input[aria-label=Search]', { visible: true });
  await page.type('input[aria-label=Search]', query);
  await page.click('[data-click-source=search_box] [data-icon-name=Search]');
  await delay(4000);

  const $emails = await page.$$('[data-convid] > div > div');

  // fetch and parse individual emails
  const emails = await pMap(
    $emails,
    async $email => {
      await Promise.all([page.waitForNavigation(), $email.click()]);

      return getEmail(page);
    },
    {
      concurrency: 1
    }
  );

  await page.close();
  return emails;
};

export default getEmails;
