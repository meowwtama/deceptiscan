const firebaseAdmin = require("firebase-admin");

// Initialize Firebase Admin if not already initialized.
// In case other files import authMiddleware before Admin is set up, guard it.
if (!firebaseAdmin.apps.length) {
  // We assume that `GOOGLE_APPLICATION_CREDENTIALS` was set in .env
  const serviceAccount = require("../firebase-service-account.json");
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
}

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  // Header format: "Bearer <token>"
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    res.status(401).json({ error: "Missing or malformed Authorization header" });
    return;
  }

  const idToken = match[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    // decodedToken has { uid, email, name, ... }
    req.user = decodedToken;
    return next();
  } catch (err) {
    console.error("Error verifying ID token:", err);
    res.status(401).json({ error: "Invalid or expired ID token" });
    return;
  }
}

module.exports = verifyToken;