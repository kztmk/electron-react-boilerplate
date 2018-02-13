// @flow
/**
 *  userAccount型
 *   userId: FirebaseでのUserID
 *   mailAddresss: ログイン用メールアドレス
 *   password: ログイン用パスワード
 *   expireDate: 次回更新日
 *   paymentMethod: 支払い方法 py:paypal年 pm:paypal月 by:銀行振込年 bm:銀行振込月
 */
export type UserAccountType = {
  userId: string,
  mailAddress: string,
  password: string,
  expireDate: number,
  paymentMethod: string
};
