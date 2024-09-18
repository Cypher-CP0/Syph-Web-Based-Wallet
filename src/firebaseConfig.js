// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBCV4pc1N0xfIkAzUKHJc4rOmoLTuNco7Y",
    authDomain: "web-wallet-e4672.firebaseapp.com",
    projectId: "web-wallet-e4672",
    storageBucket: "web-wallet-e4672.appspot.com",
    messagingSenderId: "844776964710",
    appId: "1:844776964710:web:a69fcc151dec403de4a3a7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; // Export both auth and db
export const googleProvider = new GoogleAuthProvider();