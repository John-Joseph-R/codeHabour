import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_TUtf1uYkk_p0vPPYa1TIli8A0fmZ8Yc",
  authDomain: "codehabour.firebaseapp.com",
  projectId: "codehabour",
  storageBucket: "codehabour.firebasestorage.app",
  messagingSenderId: "788428689501",
  appId: "1:788428689501:web:9281806987fd37e70ebdb4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);