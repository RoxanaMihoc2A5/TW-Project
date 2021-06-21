const JWT = require('jsonwebtoken');
const { createHash } = require('crypto');
const { getPostData, firestore } = require('./common');

async function handleLoginRequest(req, res) {
  // URL-ul incepe cu /login
  if (req.url_paths.length === 1) {
    // daca URL-ul este doar /login
    await loginUser(req, res);
  } else {
    // daca URL-ul nu este doar /login
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid route' }));
  }
}

async function loginUser(req, res) {
  // s-a apelat POST /login

  // preluare data din body-ul request-ului si validarea datelor
  let userData;
  try {
    userData = await getPostData(req);
    if (!userData.password) throw new Error('Missing password');
    if (!userData.email) throw new Error('Missing email');
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
    return; // opreste executia aici
  }

  // luam utilizator-ul cu email-ul userData.email din baza de date
  const documentReference = firestore.doc(`/users/${userData.email}`);
  const document = (await documentReference.get()).data();
  if (!document) {
    // nu exista un utilizator cu email-ul userData.email
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `User with email ${userData.email} doesn't exist` }));
  } else {
    // exista un utilizator cu email-ul userData.email

    // verificam parola prin compararea hash-urilor
    // construim hash-ul parolei specificate in userData.password
    const hashedPassword = createHash('sha256').update(userData.password).digest('hex');
    if (document.password !== hashedPassword) {
      // hash-ul parolei din userData.password nu este egal cu hash-ul din baza de date
      // => parola nu este corecta
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid password' }));
    } else {
      // parola este corecta
      // sterge hash-ul parolei din document
      delete document.password;

      // creare JWT
      const jwt = JWT.sign(document, process.env.JWT_SECRET);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ JWT: jwt }));
    }
  }
}

module.exports = handleLoginRequest;
