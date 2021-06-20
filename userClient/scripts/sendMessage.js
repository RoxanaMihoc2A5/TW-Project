const sendMessage = () => {
	const message = document.querySelector('#message-input').value;
	document.querySelector('#message-input').value = '';
	if (message.length > 0) {
		addMessage(message, 'self_id', String(new Date()).slice(0, 21)); 
	}
};
