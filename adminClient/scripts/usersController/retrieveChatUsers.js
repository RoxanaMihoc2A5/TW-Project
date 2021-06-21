const retrieveChatUsers = () => {
	const currentUserId = JSON.parse(localStorage.getItem('userData')).email;

	fetch(`http://localhost:8000/chats/${currentUserId}`, {
		headers: new Headers({
			Authorization: 'Bearer ' + localStorage.getItem('jwt'),
		}),
	})
		.then(async (response) => {
			const usersArray = await response.json();

			localStorage.setItem('availableChats', usersArray);
			localStorage.setItem('currentChat', usersArray[0]);
			initializeChat(usersArray[0]);

			usersArray.forEach((user) => {
				fetch(`http://localhost:8000/users/${user}`, {
					headers: new Headers({
						Authorization: 'Bearer ' + localStorage.getItem('jwt'),
					}),
				}).then(async (response) => {
					const chatUserDetails = await response.json();

					fetch(
						`http://localhost:8000/chats/${currentUserId}/${user}?limit=1`,
						{
							headers: new Headers({
								Authorization: 'Bearer ' + localStorage.getItem('jwt'),
							}),
						}
					)
						.then(async (response) => {
							const lastMessage = (await response.json())[0];
							addChatToList(
								user,
								lastMessage,
								(userName = chatUserDetails.name),
								(usersvatar = chatUserDetails.avatar_link)
							);
						})
						.catch(function (error) {
							console.log('Users chats could not be retrieved', error);
						});
				});
			});
		})
		.catch(function (error) {
			console.log('Messages could not be retrieved', error);
		});
};

retrieveChatUsers();
