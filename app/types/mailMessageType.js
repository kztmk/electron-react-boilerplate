// @flow
/**
 * mailparser
 */
type MailMessageType = {
  headers: Object,
  subject: string,
  from: MailAddressType,
  to: MailAddressType,
  cc: MailAddressType,
  bcc: MailAddressType,
  date: date,
  messageId: string,
  inReplyTo: string,
  replyTo: MailAddressType,
  references: Array<string>,
  html: string,
  text: string,
  textAsHtml: string,
  attachments: Array<MailAttachmentType>
};

export type MailAddressType = {
  value: MailAddressValueType,
  text: string,
  html: string
};

export type MailAddressValueType = {
  name?: string,
  address?: string,
  group?: string
};

export type MailAttachmentType = {
  filename: string,
  contentType: string,
  contentDispositions: string,
  checksum: string,
  size: string,
  headers: Object,
  content: string,
  contentId: string,
  cid: string,
  related: boolean
};

/**
 * emailjs-imap-client object
 */
export type MailEnvelopeType = {
  date: string,
  subject: string,
  from: Array<MailAddressType>,
  sender: Array<MailAddressType>,
  replyTo: Array<MailAddressType>,
  to: Array<MailAddressType>,
  cc: Array<MailAddressType>,
  bcc: Array<MailAddressType>,
  inReplyTo: Array<MailAddressType>,
  messageId: string
};

export type MailBoxArgsType = {
  path: string,
  sequence: string,
  query: string
};

export type MailBoxesType = {
  name: string,
  path: string,
  delimiter: string,
  listed: boolean,
  subscribed: boolean,
  specialUse?: string,
  specialUseFlag?: string,
  flags: Array<string | Object>,
  children: Array<MailBoxesType>
};

export type MailBoxInfoType = {
  exists: number,
  flags: Array<string>,
  permanentFlags: Array<string>,
  readOnly: boolean,
  uidValidity: number,
  uidNext: number,
  highestModseq: string
};

export type ImapManagerPropertyType = {
  mailBoxes: Array<MailBoxesType>,
  messages: Array<MailRowMessageType>,
  selectMailBoxPath: string,
  mailCount: number,
  unseenCount: number,
  seqFrom: number
};

export type ImapFlagsArgsType = {
  path: string,
  sequences: Array<number>,
  seqFrom: number,
  flagUpdateObject: Object,
  moveDestination: string
};

export type MailRowMessageType = {
  key: number,
  uid: number,
  flags: Array<string>,
  subject: string,
  date: string,
  from: MailAddressValueType,
  mime: Object
};
