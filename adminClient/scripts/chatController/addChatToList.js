const addChatToList = (
	userId,
	lastMessage,
	userName = 'Gina',
	userAvatar = 'https://media.healthyfood.com/wp-content/uploads/2017/03/Why-we-like-cherries--500x753.jpg'
) => {
	const chatsWrapper = document.querySelector('.chat-entry-list');
	const chatEntry = document.createElement('li');

	const messageSentMoment = new Date(lastMessage.timestamp);

	chatEntry.innerHTML = `
        <li class="chat-entry" onclick="initializeChat('${userId}')">
            <div class="chat-entry-box">
                <img class="message-avatar" src="${userAvatar}" />
                <div class="chat-text-data">
                    <p class="chat-entry-username">${userName}</p>
                    <p class="last-sent-message">${lastMessage.data}</p>
                </div>
                <p class="last-sent-message-timestamp">${`${messageSentMoment.getHours()}:${messageSentMoment.getMinutes()}`}</p>
            </div>
        </li>
    `;

	chatsWrapper.appendChild(chatEntry);
};
