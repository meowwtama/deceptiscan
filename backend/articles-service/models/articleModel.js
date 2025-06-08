const { admin } = require('../middleware/firebaseAdmin');
const db = admin.firestore();
const collection = db.collection('articles');

module.exports = {
  list: (limit, offset) =>
    collection.orderBy('createdAt', 'desc').offset(offset).limit(limit).get(),
  get: id => collection.doc(id).get(),
  create: data => collection.add(data),
  update: (id, data) => collection.doc(id).update(data),
  remove: id => collection.doc(id).delete(),
};
