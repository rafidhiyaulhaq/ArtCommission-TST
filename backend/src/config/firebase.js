// backend/src/config/firebase.js
const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');
require('dotenv').config();

// Service account untuk Admin SDK
const serviceAccount = require('../../serviceAccountKey.json');

// Client config untuk Firebase client SDK
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// Initialize Firebase Client
const app = initializeApp(firebaseConfig);

// Get instances
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const clientAuth = getAuth(app);
const clientDb = getFirestore(app);
const clientStorage = getStorage(app);

module.exports = {
  admin,
  app,
  db,
  auth,
  storage,
  clientAuth,
  clientDb,
  clientStorage,
  firebaseConfig
};