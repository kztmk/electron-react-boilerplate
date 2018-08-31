// @flow
export type GmailSequenceType = {
  key: string,
  sequence: number,
  sequenceDigit: number,
  prefix: string,
  suffix: string
};

type GmailType = {
  accountId: string,
  domain: string,
  password: string,
  random: boolean,
  sequences: Array<GmailSequenceType>
};

export default GmailType;
