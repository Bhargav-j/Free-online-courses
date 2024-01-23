import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9n25eDIKW-xiBJ5V-n3ypgW5AV7yG-pY",
  authDomain: "free-online-courses-f232c.firebaseapp.com",
  projectId: "free-online-courses-f232c",
  storageBucket: "free-online-courses-f232c.appspot.com",
  messagingSenderId: "869000335228",
  appId: "1:869000335228:web:60b266689025397adf1ef9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider(app);

export { auth, googleProvider, db };
