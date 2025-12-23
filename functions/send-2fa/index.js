const sdk = require('node-appwrite');
const nodemailer = require('nodemailer');

module.exports = async function (req, res) {
  const payload = req.payload ? JSON.parse(req.payload) : {};
  const email = payload.email;
  if (!email) return res.json({ success: false, error: 'email required' }, 400);

  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);
  const DB_ID = process.env.DB_ID;
  const COLLECTION_ID = process.env.COLLECTION_ID;

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const ttlSeconds = Number(process.env.TTL_SECONDS || 300);

  try {
    await databases.createDocument(DB_ID, COLLECTION_ID, sdk.ID.unique(), { email, code, ttl: ttlSeconds });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mail = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Your 2FA code',
      text: `Your verification code is ${code}. It expires in ${ttlSeconds/60} minutes.`,
      html: `<p>Your verification code is <b>${code}</b>. It expires in ${ttlSeconds/60} minutes.</p>`
    };

    await transporter.sendMail(mail);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, error: err.message }, 500);
  }
};
