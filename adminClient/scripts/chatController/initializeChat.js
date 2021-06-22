const initializeChat = async (partnerId) => {
	localStorage.setItem('currentChat', partnerId);
	const chatsListWrapper = document.querySelector('.chats-list-wrapper');
	const currentUserId = JSON.parse(localStorage.getItem('userData')).email;
	document.querySelector('.messages-wrapper').innerHTML = null;
	document.querySelector('.chat-partner-id').innerHTML = partnerId;

	fetch(`http://localhost:8000/chats/${currentUserId}/${partnerId}`, {
		headers: new Headers({
			Authorization: 'Bearer ' + localStorage.getItem('jwt'),
		}),
	})
		.then(async (response) => {
			const messagesArray = (await response.json()).reverse();

			for (const message of messagesArray) {
				const senderDataObject = await fetch(
					`http://localhost:8000/users/${message.userId}`
				);
				const senderData = await senderDataObject.json();

				addMessage(
					message.data,
					message.userId,
					message.timestamp,
					senderData.avatar_link
				);
			}
		})
		.catch(function (error) {
			console.log('Messages could not be retrieved', error);
		})
		.finally(() => {
			setTimeout(
				() =>
					setInterval(() => {
						retrieveLastMessage();
					}, 3000),
				5000
			);
		});

	chatsListWrapper.style.display = 'none';
};
