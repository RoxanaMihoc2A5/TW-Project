const { createHash } = require('crypto');
const { verifyAndValidateAdminAuthorization, getPostData, firestore } = require('./common');

function validateUserData(userData) {
  // arunca eroare daca nu avem email/avatar_link/name/password
  if (!userData.email) throw new Error('Missing email');
  if (!userData.avatar_link) throw new Error('Missing avatar_link');
  if (!userData.name) throw new Error('Missing name');
  if (!userData.password) throw new Error('Missing password');

  // stergem celelalte atribute in afara de cele de mai sus
  for (const field in userData) {
    if (!['email', 'name', 'avatar_link', 'password'].includes(field)) {
      delete userData[field];
    }
  }
  return userData;
}

async function handleUsersRequest(req, res) {
  req.userId = req.url_paths[1];

  if (req.userId) {
    // URL-ul este /users/{userId}

    // in functie de metoda request-ului apelam functia corespunzatoare
    switch (req.method) {
      case 'GET':
        await getUser(req, res);
        break;

      case 'PUT':
        // restrict to admin only
        if (await verifyAndValidateAdminAuthorization(req, res)) await putUser(req, res);
        break;

      case 'DELETE':
        // restrict to admin only
        if (await verifyAndValidateAdminAuthorization(req, res)) await deleteUser(req, res);
        break;

      default:
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route.' }));
    }
  } else {
    // URL-ul este /users

    // in functie de metoda request-ului apelam functia corespunzatoare
    switch (req.method) {
      case 'GET':
        await getUsers(req, res);
        break;

      case 'POST':
        await postUsers(req, res);
        break;

      case 'DELETE':
        // restrict to admin only
        if (await verifyAndValidateAdminAuthorization(req, res)) await deleteUsers(req, res);
        break;

      default:
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route.' }));
    }
  }
}

async function getUser(req, res) {
  // s-a apelat GET /users/{userId}
  const documentReference = firestore.doc(`/users/${req.userId}`);
  const document = (await documentReference.get()).data();
  if (!document) {
    // nu exista user cu id-ul req.userId
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `User with id ${req.userId} does not exist` }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // stergem hash-ul parolei din document inainte sa trimitem raspunsul
    delete document.password;
    res.end(JSON.stringify(document));
  }
}

async function putUser(req, res) {
  // s-a apelat PUT /users/{userId}
  try {
    // preluare data din body-ul request-ului si validarea datelor
    const userData = validateUserData(await getPostData(req));
    // inlocuieste email-ul din body cu cel din URL
    userData.email = req.userId;

    // daca s-a ajuns aici atunci datele din userData sunt valide
    const hashedPassword = createHash('sha256').update(userData.password).digest('hex');
    userData.password = hashedPassword;

    const documentReference = firestore.doc(`/users/${req.userId}`);

    // vedem daca exista deja un utilizator cu id-ul req.userId doar pentru a sti daca returnam 200 sau 201
    const document = (await documentReference.get()).data();

    // upload-are in baza de date ale datelor noi
    await documentReference.set(userData);
    if (!document) {
      res.writeHead(201, { 'Content-Type': 'application/json' });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify(userData));
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function deleteUser(req, res) {
  // s-a apelat DELETE /users/{userId}
  const documentReference = firestore.doc(`/users/${req.userId}`);

  // vedem daca exista deja un utilizator cu id-ul req.userId doar pentru a sti daca returnam 204 sau 404
  const document = (await documentReference.get()).data();
  if (!document) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `User with email ${req.userId} doesn't exist` }));
  } else {
    // stergere document
    await documentReference.delete();
    res.writeHead(204, { 'Content-Type': 'application/json' });
    res.end();
  }
}

async function getUsers(req, res) {
  // s-a apelat GET /users
  const collectionReference = firestore.collection('/users');
  const collection = await collectionReference.get();
  const users = collection.docs.map((user) => {
    const userData = user.data();
    delete userData.password;
    return userData;
  });

  // returnam o lista cu date despre toti utilizatorii
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
}

async function postUsers(req, res) {
  // s-a apelat POST /users
  // se inregistreaza un utilizator
  try {
    // preluare data din body-ul request-ului si validarea datelor
    const userData = validateUserData(await getPostData(req));

    // daca s-a ajuns aici atunci datele din userData sunt valide
    const hashedPassword = createHash('sha256').update(userData.password).digest('hex');
    userData.password = hashedPassword;

    const documentReference = firestore.doc(`/users/${userData.email}`);
    const document = (await documentReference.get()).data();
    if (document) {
      // deja exista un user cu emailul userData.email
      res.writeHead(409, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `User with email ${userData.email} already exists` }));
    } else {
      // nu exista un user cu emailul userData.email

      // upload-are in baza de date ale datelor
      await documentReference.set(userData);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userData));
    }
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function deleteUsers(req, res) {
  // s-a apelat DELETE /users

  // nu dorim sa avem comportamentul de a sterge toti utilizatorii din colectie
  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Delete on a collection not allowed.' }));
}

module.exports = handleUsersRequest;
