// @flow
/**
 *  Mail Account型
 */
export type MailAccountType = {
  accountId: string,
  password: string,
  mailAddress: string,
  provider: string,
  baseMailAddress: string,
  createDate: number,
  lastLogin?: number,
  tags: string,
  remark: string
};
