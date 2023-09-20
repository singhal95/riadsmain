import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

// const firebaseConfig = {
//   apiKey: 'AIzaSyBZDrCitSFXiAtcyGfvBfkpBuYa-S2dcgc',
//   authDomain: 'riads-2db45.firebaseapp.com',
//   projectId: 'riads-2db45',
//   storageBucket: 'riads-2db45.appspot.com',
//   messagingSenderId: '164572104707',
//   appId: '1:164572104707:web:fc2a738d2b1c721a032636',
//   measurementId: 'G-EPG2LGKGDK',
// };

// Use this when Quota finishes
const firebaseConfig = {
  apiKey: "AIzaSyBfRKxADMLtXQksinZdAxIZm4pJfqu1DqE",
  authDomain: "riads-842d3.firebaseapp.com",
  projectId: "riads-842d3",
  storageBucket: "riads-842d3.appspot.com",
  messagingSenderId: "444318262936",
  appId: "1:444318262936:web:b83b595fbf4e72449c12ed",
  measurementId: "G-LD7B243DTE"
};


const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export default app;
