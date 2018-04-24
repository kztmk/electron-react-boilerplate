import firebase from 'firebase';

// Initialize Firebase
const config = {
  // dev
  // apiKey: 'AIzaSyAFM-Po4j1BLUuvWKNq6duDoVZrkhcVoUA',
  // authDomain: 'yoriki5-dev.firebaseapp.com',
  // databaseURL: 'https://yoriki5-dev.firebaseio.com',
  // projectId: 'yoriki5-dev',
  // storageBucket: 'yoriki5-dev.appspot.com',
  // messagingSenderId: '732832144609'
  // apiKey: 'AIzaSyAcS_ssguOdKN_rN45SkmGM_OkZhyWElNI',
  // authDomain: 'yoriki5-prod.firebaseapp.com',
  // databaseURL: 'https://yoriki5-prod.firebaseio.com',
  // projectId: 'yoriki5-prod',
  // storageBucket: 'yoriki5-prod.appspot.com',
  // messagingSenderId: '971790993081'
  // ja
  apiKey: 'AIzaSyDiTEdWyom-AnrGC8-WhdTIm-G8-LJsfyw',
  authDomain: 'yoriki5-ja.firebaseapp.com',
  databaseURL: 'https://yoriki5-ja.firebaseio.com',
  projectId: 'yoriki5-ja',
  storageBucket: 'yoriki5-ja.appspot.com',
  messagingSenderId: '523115901223'
};

firebase.initializeApp(config);
const database = firebase.database();

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

const firebaseDbInsert = (path, value) =>
  database
    .ref(path)
    .push(value)
    .catch(error => {
      throw error;
    });

/**
 * Database fetch data
 * @param path
 * @returns {Promise<any>}
 */
const firebaseDbRead = path =>
  database
    .ref(path)
    .once('value')
    .catch(error => {
      throw error;
    });

/**
 * Database update data
 * @param path
 * @param value
 * @returns {Promise<any>}
 */
const firebaseDbUpdate = (path, value) =>
  database
    .ref(path)
    .update(value)
    .catch(error => {
      throw error;
    });

/**
 * Databse delete data
 * @param path
 * @returns {Promise<any>}
 */
const firebaseDbDelete = path =>
  database
    .ref(path)
    .remove()
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
  firebaseDbRead,
  firebaseDbUpdate,
  firebaseDbDelete
};
