import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCHM6e_pzVAIGuAjfY_YRQD8Wn1a2UOhms",
  authDomain: "rider-tracking-system-7a4c1.firebaseapp.com",
  projectId: "rider-tracking-system-7a4c1",
  storageBucket: "rider-tracking-system-7a4c1.appspot.com",
  messagingSenderId: "135642142270",
  appId: "1:135642142270:web:dd4dbbd7477ffa1f86636f",
  measurementId: "G-ZCFCJZE7QK",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const ts = firebase.firestore.Timestamp;

const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { auth, db, timestamp, ts };
