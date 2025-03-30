const admin = require('firebase-admin');
const path = require('path');

// --- IMPORTANT ---
// Make sure the path to your service account key file is correct.
// If you placed it directly in 'backend/services', this path should work.
// If you placed it elsewhere in 'backend', adjust the path accordingly.
const serviceAccountPath = {
    type: process.env.FIREBASE_ACCOUNT_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
} 

try {
  // Initialize Firebase Admin SDK
  const bucketUrl = process.env.BUCKET_URL;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    storageBucket: bucketUrl
  });

  // Get a reference to the storage service
  const bucket = admin.storage().bucket();

  console.log('Firebase Admin SDK initialized successfully.');

  module.exports = { admin, bucket };

} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  // Depending on your error handling strategy, you might want to exit the process
  // process.exit(1); 
  // Or provide fallback values / disable Firebase features
  module.exports = { admin: null, bucket: null }; 
} 