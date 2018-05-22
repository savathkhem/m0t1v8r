console.log("Keys loaded");


exports.twilio = {
  twilio_account_id: process.env.ACCOUNT_SID,
  twilio_auth_token: process.env.AUTH_TOKEN
};


exports.firebase = {
  firebase_apiKey: process.env.API_KEY,
  firebase_authDomain: process.env.AUTH_DOMAIN,
  firebase_databaseURL: process.env.DATABASE_URL,
  firebase_projectId: process.env.PROJECT_ID,
  firebase_storageBucket: process.env.STORAGE_BUCKET,
  firebase_messagingSenderId: process.env.MESSAGING_SENDER_ID
}