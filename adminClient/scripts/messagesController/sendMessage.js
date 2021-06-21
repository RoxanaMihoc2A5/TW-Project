const sendMessage = () => {
	const message = document.querySelector('#message-input').value;
	document.querySelector('#message-input').value = '';
	const currentUserId = JSON.parse(localStorage.getItem('userData')).email;
	const currentChat = localStorage.getItem('currentChat');
	if (message.length > 0) {
		const currentDateTime = Date.now();
		fetch(`http://localhost:8000/chats/${currentUserId}/${currentChat}`, {
			method: 'POST',
			body: JSON.stringify({
				userId: currentUserId,
				data: message,
				timestamp: currentDateTime,
			}),
			headers: new Headers({
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			}),
		}).catch(function (error) {
			console.log('Message could not be sent', error);
		});
	}
};
