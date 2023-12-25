import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDu8ructemTmPG3kN5qhpBPVwcwLUd1Gl4",
  authDomain: "webtech-part-a.firebaseapp.com",
  projectId: "webtech-part-a",
  storageBucket: "webtech-part-a.appspot.com",
  messagingSenderId: "154774657389",
  appId: "1:154774657389:web:5852d9f143212c676f6264",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
