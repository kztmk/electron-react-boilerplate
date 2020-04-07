const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

const clickByText = async (page, text) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};

export const clickByTextInTagName= async (page, text, tagName) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//${tagName}[contains(text(), ${escapedText})]`);
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found in Tag: ${tagName} : ${text}`);
  }
};


export default clickByText;
