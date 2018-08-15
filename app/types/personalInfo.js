// @flow
import type MailAccountType from './mailAccount';

type PersonalInfoType = {
  lastName: string,
  firstName: string,
  lastNameKana: string,
  firstNameKana: string,
  lastNameKatakana: string,
  firstNameKatakana: string,
  lastNameHepburn: string,
  firstNameHepburn: string,
  gender: number,
  birthDate: string,
  postalCode: string,
  prefecture: string,
  address1: string,
  useDefault: boolean,
  mailAccount: MailAccountType
};

export default PersonalInfoType;
