async function handleChatsRequest(req, res) {
  if (req.url_paths[2]) {
    // URL-ul este /chats/{id-utilizator}/{id-mesaj}
    switch (req.method) {
      case 'GET':
        await getChatMessage(req, res);
        break;

      case 'POST':
        await postChatMessage(req, res);
        break;

      case 'PUT':
        await putChatMessage(req, res);
        break;

      case 'DELETE':
        await deleteChatMessage(req, res);
        break;

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route.' }));
    }
  } else if (req.url_paths[1]) {
    // URL-ul este /chats/{id-utilizator}
    switch (req.method) {
      case 'GET':
        await getChat(req, res);
        break;

      case 'POST':
        await postChat(req, res);
        break;

      case 'DELETE':
        await deleteChat(req, res);
        break;

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route.' }));
    }
  } else {
    // URL-ul este /chats
    switch (req.method) {
      case 'GET':
        await getChats(req, res);
        break;

      case 'POST':
        await postChats(req, res);
        break;

      case 'DELETE':
        await deleteChats(req, res);
        break;

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route.' }));
    }
  }
}

async function getChatMessage(req, res) {}
async function putChatMessage(req, res) {}
async function postChatMessage(req, res) {}
async function deleteChatMessage(req, res) {}

async function getChat(req, res) {}
async function postChat(req, res) {}
async function deleteChat(req, res) {}

async function getChats(req, res) {
    console.log('hello there');
}
async function postChats(req, res) {}
async function deleteChats(req, res) {}

module.exports = handleChatsRequest;
