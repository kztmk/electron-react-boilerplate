/* eslint-disable no-useless-escape */
const text2Html = text => {
  const htmlHeader = `<!DOCTYPE html>
<html lang="ja">
<head>
    <title>---</title>
    <meta charset="UTF-8">
</head>
<body>`;

  const htmlFooter = `</body>
</html>`;

  // 1. plain text search
  let txt = text.replace(/&/g, '&amp;');
  txt = txt.replace(/</g, '&lt;');
  txt = txt.replace(/>/g, '&gt;');

  // 2. line breaks
  txt = txt.replace(/\r\n?|\n/g, '<br>');

  // url convert to a tag
  const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  txt = txt.replace(exp, '<a href=\'$1\' target="_blank">$1</a>');
  const exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  txt = txt.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');

  // 3. paragraphs
  txt = txt.replace(/<br>\s*<br>/g, '</p><p>');

  // 4. wrap in paragraph tags
  txt = `<p>${txt}</p>`;

  return `${htmlHeader}${txt}${htmlFooter}`;
};

export default text2Html;
