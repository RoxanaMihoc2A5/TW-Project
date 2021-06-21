const http = require('http');
const handleUsersRequest = require('./users');
const handleLogin = require('./login');
const handleChatsRequest = require('./chats');

const server = http.createServer(async (req, res) => {
  req.url_paths = req.url.split('/').filter((path) => path !== '');
  console.log('🚀  -> file: rest_api.js  -> line 6  -> url_paths', req.url_paths);

  try {
    switch (req.url_paths[0]) {
      case 'users':
        // URL starts with /users
        await handleUsersRequest(req, res);
        break;

      case 'login':
        // URL starts with /login
        if (req.url_paths.length === 1) {
          // if URL is only /login
          await handleLogin(req, res);
        } else {
          // if URL is not only /login
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid route' }));
        }
        break;

      case 'chats':
        // URL starts with /chats
        await handleChatsRequest(req, res);
        break;

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route.' }));
    }
  } catch (e) {
    console.log('🚀  -> file: rest_api.js  -> line 24  -> e', e);
    console.dir(e);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }
});

module.exports = server;
