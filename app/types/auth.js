// @flow
/**
 *  Auth型 app内での認証情報
 *  userId: DB内での一意なId
 *  mailAddress: 認証に使用するMailAddress
 *  password: 認証に使用するパスワード
 *  isLogInFailure: ログイン状態
 *  isLoadingIcon: ローディング・アイコンの状態
 *  errorMessage: エラーメッセージ
 */
export type AuthType = {
  userId: string,
  mailAddress: string,
  password: string,
  login: boolean,
  isLoginFailure: boolean,
  isLoadingIcon: boolean,
  errorMessage: string
};
