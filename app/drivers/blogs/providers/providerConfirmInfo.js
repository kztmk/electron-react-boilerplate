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
  }
];

export default confirmMails;
