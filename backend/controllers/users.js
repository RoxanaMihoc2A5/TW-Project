const { createHash } = require('crypto');
const { getPostData, firestore } = require('./common');

function validateUserData(userData) {
  // fail if required attributes are missing
  if (!userData.email) throw new Error('Missing email');
  if (!userData.avatar_link) throw new Error('Missing avatar_link');
  if (!userData.name) throw new Error('Missing name');
  if (!userData.password) throw new Error('Missing password');
  // delete other attributes
  for (const field in userData) {
    if (!['email', 'name', 'avatar_link', 'password'].includes(field)) {
      delete userData[field];
    }
  }
  return userData;
}

async function handleUsersRequest(req, res) {
  if (req.url_paths[1]) {
    // URL is /users/{userId}
    switch (req.method) {
      case 'GET':
        await getUser(req, res);
        break;

      case 'PUT':
        await putUser(req, res);
        break;

      case 'DELETE':
        await deleteUser(req, res);
        break;

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route.' }));
    }
  } else {
    // URL is /users
    switch (req.method) {
      case 'GET':
        await getUsers(req, res);
        break;

      case 'POST':
        await postUsers(req, res);
        break;

      case 'DELETE':
        await deleteUsers(req, res);
        break;

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route.' }));
    }
  }
}

async function getUser(req, res) {
  const userId = req.url_paths[1];
  const doc = firestore.doc('/users/' + userId);
  try {
    const userData = await (await doc.get()).data();
    userData.id = userId;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userData));
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'User with id ' + userId + ' does not exist' }));
  }
}

async function getUsers(req, res) {
  const collection = firestore.collection('/users');
  const users = (await collection.get()).docs.map((user) => user.data());

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
}

async function postUsers(req, res) {
  let userData;
  // format and validate received data
  try {
    userData = validateUserData(await getPostData(req));
    const hashedPassword = createHash('sha256').update(userData.password).digest('hex');
    userData.password = hashedPassword;

    const doc = firestore.collection('/users').doc(userData.email);
    if ((await doc.get()).data()) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User with email ' + userData.email + ' already exists' }));
    } else {
      await doc.set(userData);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userData));
    }
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function deleteUsers(req, res) {
  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Delete on a collection not allowed.' }));
}

async function putUser(req, res) {
  const userId = req.url_paths[1];

  let userData;
  // format and validate received data
  try {
    userData = validateUserData(await getPostData(req));
    const hashedPassword = createHash('sha256').update(userData.password).digest('hex');
    userData.password = hashedPassword;
    userData.email = req.url_paths[1];

    const doc = firestore.collection('/users').doc(userId);
    await doc.set(userData);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userData));
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function deleteUser(req, res) {
  const userId = req.url_paths[1];
  const doc = await firestore.doc('/users/' + userId);
  await doc.delete();

  res.writeHead(204, { 'Content-Type': 'application/json' });
  res.end();
}

module.exports = handleUsersRequest;
