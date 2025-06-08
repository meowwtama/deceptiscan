const admin = require("firebase-admin");
const path = require("path");

function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    // The .env should have GOOGLE_APPLICATION_CREDENTIALS=firebase-service-account.json
    const serviceAccountPath = path.resolve(
      __dirname,
      "../firebase-service-account.json"
    );
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

module.exports = { admin, initializeFirebaseAdmin };