const JWT = require('jsonwebtoken');
const { createHash } = require('crypto');
const { getPostData, firestore } = require('./common');

async function loginUser(req, res) {
  const userData = await getPostData(req);

  try {
    if (!userData.password) throw new Error('Missing password');
    if (!userData.email) throw new Error('Missing email');
  } catch (e) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }

  const doc = (await firestore.collection('/users').doc(userData.email).get()).data();
  if (!doc) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'User with email ' + userData.email + " doesn't exist" }));
  }

  const hashedPassword = createHash('sha256').update(userData.password).digest('hex');
  if (doc.password !== hashedPassword) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid password' }));
  } else {
    delete doc.password;

    const jwt = JWT.sign({ ...doc }, process.env.JWT_SECRET);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ JWT: jwt }));
  }
}

module.exports = loginUser;
