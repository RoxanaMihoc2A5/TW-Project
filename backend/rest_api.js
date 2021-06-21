const http = require('http');
const handleUsersRequest = require('./controllers/users');
const handleLoginRequest = require('./controllers/login');
const handleChatsRequest = require('./controllers/chats');
const handleChatSettingsRequest = require('./controllers/chatSettings');
const { URL } = require('url');

const server = http.createServer(async (req, res) => {
	// setari pentru CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Header', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, DELETE, PATCH'
	);
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}

	const url = new URL(req.url, `http://${req.headers.host}`);
	// retinem search/query parameters in req.search_parameters
	req.search_parameters = url.searchParams;
	// retinem path-urile la care s-a apelat request-ul in req.url_paths
	req.url_paths = url.pathname.split('/').filter((path) => path !== '');

	try {
		switch (req.url_paths[0]) {
			case 'users':
				// URL-ul incepe cu /users
				await handleUsersRequest(req, res);
				break;

			case 'chats':
				// URL-ul incepe cu /chats
				await handleChatsRequest(req, res);
				break;

			case 'login':
				// URL-ul incepe cu /login
				await handleLoginRequest(req, res);
				break;

			case 'chatSettings':
				// URL-ul incepe cu /chatSettings
				await handleChatSettingsRequest(req, res);
				break;

			default:
				// URL-ul nu incepe cu /users, /chats sau /login => ruta invalida
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: 'Invalid route.' }));
		}
	} catch (e) {
		// in caz de sunt erori care tin de cod, se va ajunge aici
		console.error(e);
		res.writeHead(500, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: e.message }));
	}
});

module.exports = server;
