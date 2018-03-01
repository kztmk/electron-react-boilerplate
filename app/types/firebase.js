// @flow
export type FirebaseUserMetadataType = {
  creationTime: ?string,
  lastSignInTime: ?string
};

export type FirebaseUserType = {|
  displayName: string,
  email: string,
  emailVerified: boolean,
  isAnonymous: boolean,
  metadata: FirebaseUserMetadataType,
  phoneNumber: ?string,
  photoURL: any,
  providerData: any,
  refreshToken: string,
  uid: string
|};

export type FirebaseErrorType = {
  code: ?string,
  message: ?string
};
