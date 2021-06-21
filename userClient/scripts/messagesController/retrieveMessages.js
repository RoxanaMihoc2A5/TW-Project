const retrieveMessages = (limit = 9999) => {
	const currentUserId = JSON.parse(localStorage.getItem('userData')).email;
	fetch(
		`http://localhost:8000/chats/${adminId}/${currentUserId}?limit=${limit}`,
		{
			headers: new Headers({
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			}),
		}
	)
		.then(async (response) => {
			const messagesArray = (await response.json()).reverse();
			if (limit !== 1) {
				for (const message of messagesArray) {
					const senderDataObject = await fetch(
						`http://localhost:8000/users/${message.userId}`,
						{
							headers: new Headers({
								Authorization: 'Bearer ' + localStorage.getItem('jwt'),
							}),
						}
					);
					const senderData = await senderDataObject.json();

					addMessage(
						message.data,
						message.userId,
						message.timestamp,
						senderData.avatar_link
					);
				}
			} else {
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
			}
		})
		.catch(function (error) {
			console.log('Messages could not be retrieved', error);
		});
};

retrieveMessages();
// setInterval(() => retrieveMessages((limit = 1)), 3000);
