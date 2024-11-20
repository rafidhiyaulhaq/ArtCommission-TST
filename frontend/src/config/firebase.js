// frontend/src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAdUAye9UnqvYpRzfhEB3YEEKKS8IHvA1Y",
  authDomain: "artcommission-tst.firebaseapp.com",
  projectId: "artcommission-tst",
  storageBucket: "artcommission-tst.firebasestorage.app",
  messagingSenderId: "196397606832",
  appId: "1:196397606832:web:228b1da131298596efd875",
  measurementId: "G-LF8KB6J76M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;