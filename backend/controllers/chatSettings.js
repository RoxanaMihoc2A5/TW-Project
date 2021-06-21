const {
	verifyAndValidateAdminAuthorization,
	getPostData,
	firestore,
} = require('./common');

async function handleChatSettingsRequest(req, res) {
	// URL-ul incepe cu /chatSettings
	if (req.url_paths.length === 1) {
		// daca URL-u este doar /chatSettings
		switch (req.method) {
			case 'GET':
				await getChatSettings(req, res);
				break;

			case 'PUT':
				if (!(await verifyAndValidateAdminAuthorization(req, res))) return; // daca utilizatorul nu e admin, nu facem nimic
				await putChatSettings(req, res);
				break;
		}
	} else {
		// daca URL-u nu este doar /chatSettings
		res.writeHead(400, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: 'Invalid route' }));
	}
}

async function getChatSettings(req, res) {
	// s-a apelat GET /chatSettings
	const documentReference = firestore.doc('chatSettings/settings');
	const document = (await documentReference.get()).data(); // luam din db setarile

	if (!document) {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: 'No chat settings found' }));
	} else {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(document));
	}
}
async function putChatSettings(req, res) {
	// s-a apelat PUT /chatSettings

	// preluare data din body-ul request-ului si validarea datelor
	let chatSettings;
	try {
		chatSettings = await getPostData(req);
		// arunca eroare daca nu avem theme/position/avatar
		if (!chatSettings.theme) throw new Error('Missing theme');
		if (!chatSettings.position) throw new Error('Missing position');
		if (!chatSettings.avatar) throw new Error('Missing avatar');

		// stergem celelalte atribute in afara de cele de mai sus
		for (const field in chatSettings) {
			if (!['theme', 'position', 'avatar'].includes(field)) {
				delete message[field];
			}
		}
	} catch (e) {
		res.writeHead(400, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: e.message }));
		return; // opreste executia aici
	}

	const documentReference = firestore.doc('chatSettings/settings');
	const document = (await documentReference.get()).data();

	if (!document) {
		// daca nu exista setarile atunci le cream si returnam 201
		res.writeHead(201, { 'Content-Type': 'application/json' });
	} else {
		// daca exista setarile atunci le modificam si returnam 200
		res.writeHead(200, { 'Content-Type': 'application/json' });
	}

	await documentReference.set(chatSettings);
	res.end(JSON.stringify(chatSettings));
}

module.exports = handleChatSettingsRequest;
