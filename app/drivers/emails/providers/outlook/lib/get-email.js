import delay from 'delay';
import parseEmail from 'mailparser-mit';

const getEmail = async page => {
  // view original message source from the email overflow options menu
  await page.waitFor('.ms-OverflowSet-overflowButton button', { visible: true });
  await page.click('.ms-OverflowSet-overflowButton button');
  await page.waitFor('button[name~=View]', { visible: true });
  await page.click('button[name~=View]');

  await page.waitFor('[role=dialog] .allowTextSelection', { visible: true });
  await delay(1000);
  const content = await page.$eval('[role=dialog] .allowTextSelection', $el => $el.textContent);
  await page.click('[role=dialog] button');
  await delay(1000);

  try {
    const email = await parseEmail(content);
    return email;
  } catch (err) {
    return null;
  }
};

export default getEmail;
