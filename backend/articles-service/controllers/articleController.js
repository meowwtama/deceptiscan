const { admin } = require('../middleware/firebaseAdmin');
const model = require('../models/articleModel');
const { FieldValue } = admin.firestore;

exports.list = async (req, res) => {
  const page  = parseInt(req.query.page, 10)  || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const snapshot = await model.list(limit, (page - 1) * limit);
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json({ items, total: items.length });
};

exports.get = async (req, res) => {
  const doc = await model.get(req.params.id);
  if (!doc.exists) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ id: doc.id, ...doc.data() });
};

exports.create = async (req, res) => {
  const data = {
    ...req.body,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  const ref = await model.create(data);
  res.status(201).json({ id: ref.id });
};

exports.update = async (req, res) => {
  const updates = {
    ...req.body,
    updatedAt: FieldValue.serverTimestamp(),
  };
  await model.update(req.params.id, updates);
  res.sendStatus(204);
};

exports.remove = async (req, res) => {
  await model.remove(req.params.id);
  res.sendStatus(204);
};
