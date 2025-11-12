import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBpxioSk5JfE7agXGkFIlSn3AxuswVRV4",
  authDomain: "openweatherapi-23c14.firebaseapp.com",
  projectId: "openweatherapi-23c14",
  storageBucket: "openweatherapi-23c14.firebasestorage.app",
  messagingSenderId: "196331063967",
  appId: "1:196331063967:web:4433078f5c4ae49406f0aa",
  measurementId: "G-YZVHLK42TQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider, signInWithPopup, signOut };