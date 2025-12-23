const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new sdk.Client();
  const account = new sdk.Account(client);
  
  client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  try {
    const { action, email, password, userId, secret, passwordAgain } = JSON.parse(req.body || '{}');

    switch (action) {
      case 'login':
        const session = await account.createEmailPasswordSession(email, password);
        return res.json({ success: true, session });

      case 'register':
        const user = await account.create(sdk.ID.unique(), email, password);
        const loginSession = await account.createEmailPasswordSession(email, password);
        return res.json({ success: true, user, session: loginSession });

      case 'recovery':
        const { redirectUrl } = JSON.parse(req.body);
        await account.createRecovery(email, redirectUrl);
        return res.json({ success: true, message: 'Recovery email sent' });

      case 'resetPassword':
        await account.updateRecovery(userId, secret, password, passwordAgain);
        return res.json({ success: true, message: 'Password reset successful' });

      case 'getUser':
        const currentUser = await account.get();
        return res.json({ success: true, user: currentUser });

      default:
        return res.json({ success: false, error: 'Invalid action' });
    }
  } catch (err) {
    error('Auth proxy error:', err);
    return res.json({ 
      success: false, 
      error: err.message || 'Authentication failed',
      code: err.code || 500
    });
  }
};
