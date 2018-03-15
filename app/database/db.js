import firebase from 'firebase';
import ReduxSagaFirebase from 'redux-saga-firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAcS_ssguOdKN_rN45SkmGM_OkZhyWElNI',
  authDomain: 'yoriki5-prod.firebaseapp.com',
  databaseURL: 'https://yoriki5-prod.firebaseio.com',
  projectId: 'yoriki5-prod',
  storageBucket: 'yoriki5-prod.appspot.com',
  messagingSenderId: '971790993081'
};
const firebaseApp = firebase.initializeApp(config);
// const database = firebase.database();

const rsf = new ReduxSagaFirebase(firebaseApp);

export default rsf;
// export { firebase, database as default };
