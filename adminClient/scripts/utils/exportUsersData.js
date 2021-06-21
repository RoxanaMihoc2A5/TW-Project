const exportUsersData = async () => {
	const currentUserId = JSON.parse(localStorage.getItem('userData')).email;
	const currentChat = localStorage.getItem('currentChat');

	const messages = await fetch(
		`http://localhost:8000/chats/${currentUserId}/${currentChat}`,
		{
			headers: new Headers({
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			}),
		}
	);
	const messagesJsonArray = await messages.json();

	exportCSVFile(convertJsonArrayToCsv(messagesJsonArray), 'chatExport');
};
