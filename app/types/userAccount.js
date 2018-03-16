// @flow
/**
 *  userAccount型 DBで管理
 *   userId: FirebaseでのUserID
 *   mailAddresss: ログイン用メールアドレス
 *   password: ログイン用パスワード
 *   expireDate: 次回更新日
 *   paymentMethod: 支払い方法 py:paypal年 pm:paypal月 by:銀行振込年 bm:銀行振込月
 *   registoredMailAddress: 決済時のメールアドレス(mailAddress, passwordの両方紛失時のKey)
 */
export type UserAccountType = {
  key: string,
  userId: string,
  mailAddress: string,
  password: string,
  expireDate: ?number,
  paymentMethod: string,
  registeredMailAddress: string,
  isLoadingIcon: boolean,
  isFailure: boolean,
  errorMessage: string,
  isFirstProfile: boolean
};
