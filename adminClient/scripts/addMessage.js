const addMessage = (messageText, userId, timestamp = '12:45') => {
	const messagesWrapper = document.querySelector('.messages-wrapper');
	const message = document.createElement('div');
	if (userId === 'admin') {
		message.innerHTML = `
		<li class="single-message-wrapper">
			<div class="text-wrapper admin">
				<img class="message-avatar" src="images/avatarMock.PNG" />
				<div class="message admin-message">
					<p>${messageText}</p>
					<label class="message-timestamp">${timestamp}</label>
				</div>
			</div>
		</li>
		`;
	} else {
		message.innerHTML = `
		<li class="single-message-wrapper">
			<div class="text-wrapper">
				<img class="message-avatar" src="images/avatarMock4.PNG" />
				<div class="message">
					<p>${messageText}</p>
					<label class="message-timestamp">${timestamp}</label>
				</div>
			</div>
		</li>
		`;
	}
	messagesWrapper.appendChild(message); 
};
