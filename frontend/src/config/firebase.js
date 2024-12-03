// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfimYcg28cq-yib660O6MD_5WNCjlS9AY",
  authDomain: "website-ac80d.firebaseapp.com",
  databaseURL: "https://website-ac80d-default-rtdb.firebaseio.com",
  projectId: "website-ac80d",
  storageBucket: "website-ac80d.appspot.com",
  messagingSenderId: "521805503237",
  appId: "1:521805503237:web:e2d06eb372b36396ea756c",
  measurementId: "G-PKYRJXFECB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();

const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export const db = getDatabase();