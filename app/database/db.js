import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAcS_ssguOdKN_rN45SkmGM_OkZhyWElNI',
  authDomain: 'yoriki5-prod.firebaseapp.com',
  databaseURL: 'https://yoriki5-prod.firebaseio.com',
  projectId: 'yoriki5-prod',
  storageBucket: 'yoriki5-prod.appspot.com',
  messagingSenderId: '971790993081'
};

firebase.initializeApp(config);

// ------------------------------------
// Database method
// ------------------------------------

// ------------------------------------
// Auth
//------------------------------------
/**
 * Email, passwordでLogin
 * @param email
 * @param password
 * @returns {Promise<any>}
 */
const firebaseSignInWithEmailAndPassword = ({ email, password }) =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(error => {
      throw error;
    });

/**
 * passwordリセット用URLリクエスト
 * @param email
 * @returns {Promise<any>}
 */
const firebaseSendPasswordResetEmail = email =>
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .catch(error => {
      throw error;
    });

/**
 * ログアウト
 * @returns {Promise<any>}
 */
const firebaseSignOut = () =>
  firebase
    .auth()
    .signOut()
    .catch(error => {
      throw error;
    });

/**
 * User object の email変更
 * @param newEmail
 * @returns {Promise<T>}
 */
const firebaseUpdateEmail = newEmail =>
  firebase
    .auth()
    .currentUser.updateEmail(newEmail)
    .catch(error => {
      throw error;
    });

/**
 * User password の変更
 * @param newPassword
 * @returns {Promise<T>}
 */
const firebaseUpdatePassword = newPassword =>
  firebase
    .auth()
    .currentUser.updatePassword(newPassword)
    .catch(error => {
      throw error;
    });
// ------------------------------------
// CRUD
//------------------------------------

const firebaseDbInsert = ({ path, value }) =>
  firebase
    .database()
    .ref(path)
    .push({ value })
    .catch(error => {
      throw error;
    });

/**
 * Database fetch data
 * @param path
 * @returns {Promise<any>}
 */
const firebaseDbRead = path =>
  firebase
    .database()
    .ref(path)
    .once('value')
    .catch(error => {
      throw error;
    });

// ------------------------------------
// Export
//------------------------------------

export {
  firebase,
  firebaseSignInWithEmailAndPassword,
  firebaseSendPasswordResetEmail,
  firebaseSignOut,
  firebaseUpdateEmail,
  firebaseUpdatePassword,
  firebaseDbInsert,
  firebaseDbRead
};
