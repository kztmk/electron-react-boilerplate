// @flow
/**
 *  Mail Account型
 */
type MailAccountType = {
  key: string,
  accountId: string,
  password: string,
  mailAddress: string,
  provider: string,
  createDate: number,
  lastLogin: ?number,
  tags: string,
  detailInfo: ?Array<string>
};

export default MailAccountType;
