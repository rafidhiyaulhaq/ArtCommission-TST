const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');
require('dotenv').config();

// Service account configuration
const serviceAccount = {
  type: "service_account",
  project_id: "artcommission-tst",
  private_key_id: "86a99784454f3de251a280aa3deb844338660dba",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCbJ5C/nZlY4VN0\nQUV+DUDfTESkBdIS4nlnHunQMZJ7HXlw9N8YPTru5L7UJdaXTsT2hiNMgafYVOL5\nNeJNLjeBMjpnL+nqr+JwPfpn/Hit1lrtePs7hjBrrOdG1CziUXA5vnRvF2LHMBuv\nU+mKud5AIHf7bzT+PLbmAvKbJZTFjR9+FU22eFSnlWIjEMK7lDxy3iBD3NOLgGfk\nZgMBzUBatk/t8EoBJ3b20rFtOcpAc4jbx/Z+wr7qnozVUcPtIgPMIrmiXo175mbI\njd9ncFHXZ1dOXixAUuBPQwazwcRce771d1bzy/iE6aS9j2T7Exw2DPfVARMIS1RI\ni3tFwjD/AgMBAAECggEAR+qvf/oDjfynq6/jj7mB898MxACErsc2IbPlCeEodhOj\n6lU+oaQkEH6L65b8YFcdGe30J67Dh5VVPdGZq0+8X5DSHGlLokJTkdZQnumaYG2G\n6SMWRLF++TIEY8LOaTr5a3KZ0rKC0TQ96Odazbg4yf2iz7Ns21l2J6h/HqXtTyHQ\n8y/HqPW2YwtJzdZtx/hXErXj/kTknfxaugW4Dxeqp3L9yCv8Z0CCW4HZb3lfIZER\n4Azw6qiDp1jS4WP3R4Iz6Te/7ENdJzlj6jE3sldlChO6aDZuVED41X8pO5dO9xll\nLmflOF5Hg/NnuLklyc0m5yIX6ZoTc8/ZFQ1wS7JveQKBgQDYOleQQtAy3FCmy3Vv\nnQ31k3Kvmbbal+b9KnfOZ/s/nBO9QRpVlM9nxRawSeer1Hz+hLrtWalkyVeYkZoT\nOh+Z8GcT1NW7gysPpQ6r6lBdH+fYcy7v+UsSby9qMV9vdVhLrf28GyvE6aaFpzWC\no+xV8zAjkUH9CuYNMAmExUx8NwKBgQC3sWy0W1HgMrMInpEXy9KBaqwrG9ELDwFM\nXjZo6R+ZbNSC2OmV5G3sS/ZsQ1ENSQ0iavumhyawmXAYIit3lWEVB6eZE9qCxoE5\ngN7BQIx3eqRuttbHLtQ4UysLtI0psmskoy0JpErViPEilWOvWxMqqVjPoddoFuTh\nYzph/aDdeQKBgBRX+OETyC7g1525ysTDjAqs4r9uwOt0G0F6e2cqFVN4xcqqk2W1\n6IWk32uaqHdcOJ5hsoyeQPfAkcNC/7ILZ+m92pTdE3be8nA4YVb/Zqw8Uj3lKGdf\nlxaW62kcWBROgA4uwo6uJ8IREZ/FiZ1O+u9jQAY4pnK+UcKv4FVjkrylAoGBAJ/k\nEv/GQTVKTCYjh53T705w4J3BX6sli3bCxs94o+WzIiMm1eN/6uJ0mHFSAvnybTlZ\nL+Sa3WV4mWaYT4eOgeuBNzP6YQfV62N3Ne221s2k9f3croS/0T+ZvO06Ymk6ASLp\n2ej7lZva0DHPIO7g8oT+1OweLlZPHzjEW2wyDVTZAoGAOiaHwUxF9MlXA7TIUBfx\nWCftvSkyF2pDiq0Ar/0DC3l6y80xPl0rr7KOGOiPuALXh4dFx26Juzmta4slej3I\nB0BJnOhIQcnc6K9JmRi0TZ7rvCuQsuMO9QmN4vju3iXJiLzapnm185cZSdlQg1+O\n4K225Dm7HKYocIgvoRU3G6I=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-wdjrn@artcommission-tst.iam.gserviceaccount.com",
  client_id: "113699212174579639796",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wdjrn%40artcommission-tst.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

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