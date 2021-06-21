const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../resc-93fd1-firebase-adminsdk-6pujt-de0ece71b5.json');
const firestore = firebaseAdmin
  .initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) })
  .firestore();

async function getPostData(req) {
  return new Promise((resolve, reject) => {
    let postData = '';

    req.on('data', (data) => {
      postData += data;
    });

    req.on('end', () => {
      if (!postData) {
        reject(new Error('Missing body.'));
      } else {
        postData = JSON.parse(postData.toString());
        resolve(postData);
      }
    });
  });
}

module.exports = { getPostData, firestore };
