const retrieveLastMessage = () => {
	const currentUserId = JSON.parse(localStorage.getItem('userData')).email;
	const partnerId = localStorage.getItem('currentChat');
	fetch(`http://localhost:8000/chats/${currentUserId}/${partnerId}?limit=1`, {
		headers: new Headers({
			Authorization: 'Bearer ' + localStorage.getItem('jwt'),
		}),
	})
		.then(async (response) => {
			const messagesArray = (await response.json()).reverse();

			if (
				parseInt(localStorage.getItem('lastMessageTimestamp')) !==
				messagesArray[0].timestamp
			) {
				const senderDataObject = await fetch(
					`http://localhost:8000/users/${messagesArray[0].userId}`,
					{
						headers: new Headers({
							Authorization: 'Bearer ' + localStorage.getItem('jwt'),
						}),
					}
				);
				const senderData = await senderDataObject.json();
				addMessage(
					messagesArray[0].data,
					messagesArray[0].userId,
					messagesArray[0].timestamp,
					senderData.avatar_link
				);
			}
		})
		.catch(function (error) {
			console.log('Messages could not be retrieved', error);
		});
};
