const fs = require('fs');

const serviceAccountPath = "C:\\Users\\sanik\\Downloads\\pop-art-generator-firebase-adminsdk-fbsvc-d6e368c495.json";

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  const privateKey = serviceAccount.private_key;
  const escapedPrivateKey = privateKey.replace(/\n/g, '\\n');

  console.log('✅ Paste this in your .env.local file:');
  console.log(`FIREBASE_PRIVATE_KEY="${escapedPrivateKey}"`);
} catch (error) {
  console.error('❌ Error processing key:', error);
}
