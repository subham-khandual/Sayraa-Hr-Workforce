import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDmJYG-2SJ8qbb7Ukhkuw3TmIRbJwn0kA0",
  authDomain: "sayraa-19df7.firebaseapp.com",
  projectId: "sayraa-19df7",
  storageBucket: "sayraa-19df7.firebasestorage.app",
  messagingSenderId: "73455508153",
  appId: "1:73455508153:web:799955665660eb405ed968",
  measurementId: "G-NMVKJ1VMF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGooglePopup = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export default app;
