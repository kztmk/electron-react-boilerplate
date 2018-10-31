const confirmMails = [
  {
    provider: 'fc2',
    sender: 'noreply@id.fc2.com',
    link: 'https://secure.id.fc2.com/signup.php',
    regx: 'https:\\/\\/secure\\.id\\.fc2\\.com\\/signup.*$'
  },
  {
    provider: 'livedoor',
    sender: 'pre@livedoor.fm',
    link: 'http://member.livedoor.com/email_auth/commit',
    regx: 'http:\\/\\/member\\.livedoor\\.com\\/email_auth\\/commit.*$'
  },
  {
    provider: 'seesaa',
    sender: 'info@account.seesaa.jp',
    link: 'https://ssl.seesaa.jp/pages/my/member/email/activate?key=',
    regx: 'https:\\/\\/ssl\\.seesaa\\.jp\\/pages\\/my\\/member\\/email\\/activate.*$'
  },
  {
    provider: 'ameba',
    sender: 'info@ameba.jp',
    link: 'https://user.ameba.jp/regist/registerInput.do?ekey',
    regx: 'https:\\/\\/user\\.ameba\\.jp\\/regist\\/registerInput\\.do\\?ekey.*$'
  },
  {
    provider: 'ninjya',
    sender: 'oshirase@shinobi.jp',
    link: 'https://www.ninja.co.jp/register/input/hash/',
    regx: 'https:\\/\\/www\\.ninja\\.co\\.jp\\/register\\/input\\/hash.*$'
  },
  {
    provider: 'kokolog',
    sender: 'nifty-info@nifty.com',
    link: 'https://signup.nifty.com/users/cgi-bin/msignup_cclg.cgi',
    regx: 'https:\\/\\/signup\\.nifty\\.com\\/users\\/cgi-bin\\/msignup_cclg\\.cgi.*$'
  },
  {
    provider: 'yaplog',
    sender: 'upport@yaplog.jp',
    link: 'https://www.yaplog.jp/userRegistration/JoinCheck.blog?id',
    regx: 'https:\\/\\/www\\.yaplog\\.jp\\/userRegistration\\/JoinCheck.*$'
  },
  {
    provider: 'hatena',
    sender: 'register@hatena.ne.jp',
    link: 'http://www.hatena.ne.jp/r?k=',
    regx: 'http:\\/\\/www\\.hatena\\.ne\\.jp\\/r\\?k=.*$'
  },
  {
    provider: 'webryblog',
    sender: 'blog@bcs.biglobe.ne.jp',
    link: 'https://bblog.sso.biglobe.ne.jp/ap/tool/invite.do',
    regx: 'https:\\/\\/bblog\\.sso\\.biglobe\\.ne\\.jp\\/ap\\/tool\\/invite\\.do.*$'
  },
  {
    provider: 'goo',
    sender: 'info@goo.ne.jp',
    link: 'https://login.mail.goo.ne.jp/id/portal/RegUserProfile?MailKey',
    regx: 'https:\\/\\/login\\.mail\\.goo\\.ne\\.jp\\/id\\/portal\\/RegUserProfile\\?MailKey.*$'
  },
  {
    provider: 'webnode',
    sender: 'no-reply@webnode.com',
    link: 'https://www.webnode.com/ver/?h=',
    regx: 'https:\\/\\/www\\.webnode\\.com\\/ver\\/\\?h=.*$'
  },
  {
    provider: 'wpcom',
    sender: 'donotreply@wordpress.com',
    link: 'https://public-api.wordpress.com/bar/?stat=groovemails-events&bin=wpcom_email_click',
    regx: 'https:\\/\\/public-api\\.wordpress\\.com\\/bar\\/\\?stat=groovemails-events&bin=wpcom_email_click.*$'
  }
];

export default confirmMails;
