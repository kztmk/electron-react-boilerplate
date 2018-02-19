// @flow
import { firebase } from './db';
import type { AuthType } from '../types/auth';
import type { FirebaseUserType } from '../types/firebase';

/**
 * Handles the sign in/out
 */
const toggleSignIn = (authInfo: AuthType) => {
  const result = { ...authInfo };
  if (firebase.auth().currentUser) {
    // [START sign out]
    firebase.auth().signOut();
    // [END sign out]
  } else {
    const email = authInfo.mailAddress;
    const pass = authInfo.password;

    // Sign in with email and pass.
    // [START auth with email]
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(user => {
        console.log(user);
        const loginUser = { ...authInfo };
        loginUser.userId = user.uid;
        return loginUser;
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          result.errorMessage = 'パスワードが一致しません。';
        } else {
          result.errorMessage = errorMessage;
        }
        return result;
      });
  }
};

export default toggleSignIn;
