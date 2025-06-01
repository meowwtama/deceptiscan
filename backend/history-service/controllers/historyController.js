const firebaseAdmin = require("firebase-admin");

// Initialize Firebase Admin (if not already done)
// This ensures that if this file is imported before app.js, the SDK is still initialized.
if (!firebaseAdmin.apps.length) {
  const serviceAccount = require("../firebase-service-account.json");
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
}

// Get Firestore client
const db = firebaseAdmin.firestore();

/**
 * Helper: get a reference to the user's service subcollection.
 * @param {string} uid - The authenticated user's UID.
 * @param {string} service - The service name (name of subcollection).
 * @returns Reference to that subcollection.
 */
function getUserServiceCollection(uid, service) {
  return db.collection("history").doc(uid).collection(service);
}

/**
 * Create a new history entry under a specific service subcollection for the authenticated user.
 * POST /history/:service
 * Body: { data: object }
 */
async function createHistory(req, res) {
  const { data } = req.body;
  const uid = req.user.uid;
  const service = req.params.service;

  if (!service) {
    res.status(400).json({ error: "Service name (URL param) is required" });
    return;
  }
  if (!data) {
    res.status(400)
      .json({ error: "data (object) is required" });
    return;
  }

  try {
    // Ensure the user field exists in the "history" collection
    const userDocRef = db.collection("history").doc(uid);
    await userDocRef.set({}, { merge: true });

    // Now add a new document under the service subcollection
    const subcolRef = getUserServiceCollection(uid, service);
    const docRef = await subcolRef.add({
      ...data, 
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error("Error writing to Firestore:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

/**
 * Get all history entries for a given service subcollection, for the authenticated user.
 * GET /history/:service
 */
async function getAllHistory(req, res) {
  const uid = req.user.uid;
  const service = req.params.service;

  if (!service) {
    res.status(400).json({ error: "Service name (URL param) is required" });
    return;
  }

  try {
    // Query the service subcollection under the user's doc
    const subcolRef = getUserServiceCollection(uid, service);
    const snapshot = await subcolRef.orderBy("createdAt", "desc").get();

    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return res.json(results);
  } catch (err) {
    console.error("Error reading from Firestore:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

/**
 * Get a single history entry by ID (within a specific service subcollection), for the authenticated user.
 * GET /history/:service/:id
 */
async function getHistoryById(req, res) {
  const uid = req.user.uid;
  const service = req.params.service;
  const recordId = req.params.id;

  if (!service || !recordId) {
    res.status(400).json({ error: "Service name and record ID are required" });
    return;
  }

  try {
    const docRef = getUserServiceCollection(uid, service).doc(recordId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).json({ error: "History entry not found" });
      return;
    }

    return res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (err) {
    console.error("Error fetching document:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

/**
 * Update a history entry (within a service subcollection) if it belongs to this user.
 * PUT /history/:service/:id
 * Body: { action?: string }
 */
async function updateHistory(req, res) {
  const uid = req.user.uid;
  const service = req.params.service;
  const recordId = req.params.id;
  const { data } = req.body;

  if (!service || !recordId) {
    res.status(400).json({ error: "Service name and record ID are required" });
    return;
  }
  if (data === undefined ) {
    return res
      .status(400)
      .json({ error: "data has to be provided for update" });
  }

  try {
    const docRef = getUserServiceCollection(uid, service).doc(recordId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).json({ error: "History entry not found" });
      return;
    }

    // Merge the provided data payload into the existing document
    await docRef.update({
      ...data,
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });
    return res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error("Error updating document:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

/**
 * Delete a history entry (within a service subcollection) if it belongs to this user.
 * DELETE /history/:service/:id
 */
async function deleteHistory(req, res) {
  const uid = req.user.uid;
  const service = req.params.service;
  const recordId = req.params.id;

  if (!service || !recordId) {
    res.status(400).json({ error: "Service name and record ID are required" });
    return;
  }

  try {
    const docRef = getUserServiceCollection(uid, service).doc(recordId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).json({ error: "History entry not found" });
      return;
    }

    await docRef.delete();
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting document:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createHistory,
  getAllHistory,
  getHistoryById,
  updateHistory,
  deleteHistory,
};
