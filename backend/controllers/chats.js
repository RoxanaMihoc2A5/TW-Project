const {
	verifyAndValidateAdminAuthorization,
	getPostData,
	firestore,
} = require('./common');

function validateMessageData(message) {
	// arunca eroare daca nu avem userId/mesaj/timestamp
	if (!message.userId) throw new Error('Missing message userId');
	if (!message.data) throw new Error('Missing message data');
	if (!message.timestamp) throw new Error('Missing message timestamp');

	// stergem celelalte atribute in afara de cele de mai sus
	for (const field in message) {
		if (!['userId', 'data', 'timestamp'].includes(field)) {
			delete message[field];
		}
	}
	return message;
}

async function handleChatsRequest(req, res) {
	req.adminId = req.url_paths[1];
	req.clientId = req.url_paths[2];
	req.messageId = req.url_paths[3];

	// if JWT is invalid stop execution here
	if (!(await verifyAndValidateAdminAuthorization(req, res, false))) return;
	// daca utilizatorul care acceseaza aceasta resursa nu are id-ul req.adminId sau req.clientId, opreste executia aici
	if (![req.adminId, req.clientId].includes(req.jwtPayload.email)) {
		res.writeHead(403, { 'Content-Type': 'application/json' });
		res.end(
			JSON.stringify({
				error: 'You are not a participant of this conversation',
			})
		);
	}

	if (req.messageId) {
		// URL-ul este /chats/{adminId}/{clientId}/{messageId}
		switch (req.method) {
			case 'GET':
				await getChats_adminId_clientId_messageId(req, res);
				break;

			case 'PUT':
				await putChats_adminId_clientId_messageId(req, res);
				break;

			case 'DELETE':
				await deleteChats_adminId_clientId_messageId(req, res);
				break;

			default:
				res.writeHead(405, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: 'Invalid route.' }));
				break;
		}
		return;
	}

	if (req.clientId) {
		// URL-ul este /chats/{adminId}/{clientId}
		switch (req.method) {
			case 'GET':
				await getChats_adminId_clientId(req, res);
				break;

			case 'POST':
				await postChats_adminId_clientId(req, res);
				break;

			default:
				res.writeHead(405, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: 'Invalid route.' }));
				break;
		}
		return;
	}

	if (req.adminId) {
		// URL-ul este /chats/{adminId}
		switch (req.method) {
			case 'GET':
				await getChats_adminId(req, res);
				break;

			case 'POST':
				await postChats_adminId(req, res);
				break;

			default:
				res.writeHead(405, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: 'Invalid route.' }));
				break;
		}
		return;
	}
}

async function getChats_adminId_clientId_messageId(req, res) {
	// s-a apelat GET /chats/{adminId}/{clientId}/{messageId}
	// returneaza informatiile mesajului cu ID {messageId} din conversatia dintre {adminId} si {clientId}
	const documentReference = firestore.doc(
		`/chats/${req.adminId}/${req.clientId}/${req.messageId}`
	);
	const document = await documentReference.get();
	const message = document.data();
	if (!message) {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(
			JSON.stringify({
				error: `Message with path /chats/${req.adminId}/${req.clientId}/${req.messageId} does not exist`,
			})
		);
	} else {
		message.id = document.id;
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(message));
	}
}

async function putChats_adminId_clientId_messageId(req, res) {
	// s-a apelat PUT /chats/{adminId}/{clientId}/{messageId}
	// modifica informatiile mesajului cu ID {messageId} din conversatia dintre {adminId} si {clientId}
	try {
		// preluare data din body-ul request-ului si validarea datelor
		const messageData = validateMessageData(await getPostData(req));
		const documentReference = firestore.doc(
			`/chats/${req.adminId}/${req.clientId}/${req.messageId}`
		);
		const document = (await documentReference.get()).data();
		if (!document) {
			// mesajul nu exista, il cream si returnam HTTP status code 201
			res.writeHead(201, { 'Content-Type': 'application/json' });
		} else {
			// mesajul exista, il modificam si returnam HTTP status code 200
			res.writeHead(200, { 'Content-Type': 'application/json' });
		}
		await documentReference.set(messageData);
		res.end(JSON.stringify(messageData));
	} catch (e) {
		res.writeHead(400, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: e.message }));
	}
}

async function deleteChats_adminId_clientId_messageId(req, res) {
	// s-a apelat DELETE /chats/{adminId}/{clientId}/{messageId}
	// sterge mesajul cu ID {messageId} din conversatia dintre {adminId} si {clientId}
	const documentReference = firestore.doc(
		`/chats/${req.adminId}/${req.clientId}/${req.messageId}`
	);
	const document = (await documentReference.get()).data();
	if (!document) {
		// mesajul nu exista
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(
			JSON.stringify({
				error: `Message with path /chats/${req.adminId}/${req.clientId}/${req.messageId} does not exist`,
			})
		);
	} else {
		// mesajul exista, il stergem
		await documentReference.delete();
		res.writeHead(204, { 'Content-Type': 'application/json' });
		res.end();
	}
}

async function getChats_adminId_clientId(req, res) {
	// s-a apelat GET /chats/{adminId}/{clientId}
	// returneaza mesajele din conversatia dintre {adminId} si {clientId}

	// paginare
	const offset = parseInt(req.search_parameters.get('offset')) || 0; // default 0
	const limit = parseInt(req.search_parameters.get('limit')) || 20; // default 20

	const collectionReference = firestore
		.collection(`/chats/${req.adminId}/${req.clientId}`)
		.orderBy('timestamp', 'desc')
		.offset(offset)
		.limit(limit);
	const collection = await collectionReference.get();
	const messagesArray = collection.docs.map((doc) => {
		const message = doc.data();
		message.id = doc.id;
		return message;
	});

	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(messagesArray));
}

async function postChats_adminId_clientId(req, res) {
	// s-a apelat POST /chats/{adminId}/{clientId}
	// adauga un mesaj in conversatia dintre {adminId} si {clientId}
	try {
		const messageData = validateMessageData(await getPostData(req));
		const collectionReference = firestore.collection(
			`/chats/${req.adminId}/${req.clientId}`
		);
		const documentId = (await collectionReference.add(messageData)).id;
		messageData.id = documentId;
		res.writeHead(201, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(messageData));
	} catch (e) {
		res.writeHead(400, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: e.message }));
	}
}

async function getChats_adminId(req, res) {
	// s-a apelat GET /chats/{adminId}
	// returneaza un array de ID-uri ale clientilor cu care admin-ul cu ID {adminId} are mesaje
	const documentReference = firestore.doc(`/chats/${req.adminId}`);
	const documentCollections = await documentReference.listCollections();
	const userIds = documentCollections.map((collection) => collection.id);
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(userIds));
}

module.exports = handleChatsRequest;
