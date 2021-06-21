const JWT = require('jsonwebtoken');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../resc-93fd1-firebase-adminsdk-6pujt-de0ece71b5.json');
const firestore = firebaseAdmin
	.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) })
	.firestore();

async function verifyAndValidateAdminAuthorization(
	req,
	res,
	checkAdmin = false
) {
	try {
		// preluam jwt-ul din header pentru a vedea daca utilizatorul este autorizat
		const jwt = req.headers['authorization'].split(' ')[1];
		// verificam daca e in regula, verify ne va returna payload-ul din jwt care contine informatiile despre utilizatorul care a facut request-ul
		const payload = JWT.verify(jwt, process.env.JWT_SECRET);
		req.jwtPayload = payload;
		if (checkAdmin && !req.jwtPayload.admin) {
			// daca utilizatorul nu este admin, atunci nu ii vom da acces
			res.writeHead(403, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ error: "You're not an admin" }));
			return false;
		}
		return true; // daca este admin, atunci ii vom da acces
	} catch (e) {
		res.writeHead(401, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: 'Error verifying JWT' }));
		return false;
	}
}

async function getPostData(req) {
	// citire body in caz ca metoda este POST/PUT
	return new Promise((resolve, reject) => {
		let postData = '';

		req.on('data', (data) => {
			postData += data;
		}); // refacem body-ul request-ului si il returnam daca totul e ok

		req.on('end', () => {
			if (!postData) {
				reject(new Error('Missing body.'));
			} else {
				try {
					postData = JSON.parse(postData);
				} catch (e) {
					reject(new Error('Invalid JSON.'));
				}
				resolve(postData);
			}
		});
	});
}

module.exports = {
	verifyAndValidateAdminAuthorization,
	getPostData,
	firestore,
};
