const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const payload = req.payload ? JSON.parse(req.payload) : {};
  const { email, code } = payload;
  if (!email || !code) return res.json({ success: false, error: 'email and code required' }, 400);

  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);
  const DB_ID = process.env.DB_ID;
  const COLLECTION_ID = process.env.COLLECTION_ID;

  try {
    const Query = sdk.Query;
    const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
      Query.equal('email', email),
      Query.equal('code', code),
      Query.orderDesc('$createdAt'),
      Query.limit(1)
    ]);

    const doc = response.documents && response.documents[0];
    if (!doc) return res.json({ success: false, error: 'invalid code' }, 400);

    const createdAt = new Date(doc.$createdAt).getTime();
    const ttlMs = (doc.ttl || 300) * 1000;
    if (Date.now() - createdAt > ttlMs) {
      await databases.deleteDocument(DB_ID, COLLECTION_ID, doc.$id);
      return res.json({ success: false, error: 'code expired' }, 400);
    }

    await databases.deleteDocument(DB_ID, COLLECTION_ID, doc.$id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, error: err.message }, 500);
  }
};
