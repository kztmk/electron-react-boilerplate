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
  }
];

export default confirmMails;
