/* adauga un nou mesaj in chat, avand ca parametri:
@param messageText: mesajul propriu-zis
@param userId: id-ul utilizatorului care a scris mesajul
@param timestamp: UNIX timestamp reprezentand data si ora la care a fost trimis mesajul
*/

const addMessage = (
	messageText,
	userId,
	timestamp,
	avatarUrl = 'https://media.healthyfood.com/wp-content/uploads/2017/03/Why-we-like-cherries--500x753.jpg'
) => {
	const messagesWrapper = document.querySelector('.messages-wrapper');
	const message = document.createElement('div');

	const avatarType = JSON.parse(localStorage.getItem('chatSettings')).avatar;
	const themeType = JSON.parse(localStorage.getItem('chatSettings')).theme;

	localStorage.setItem('lastMessageTimestamp', timestamp);
	const currentMoment = new Date(timestamp);

	// mesajul propriu se va afla in dreapta, iar mesajul clientului in stanga
	if (userId === JSON.parse(localStorage.getItem('userData')).email) {
		message.innerHTML = `
		<li class="single-message-wrapper">
			<div class="text-wrapper admin">
				<img class="message-avatar ${avatarType}" src="${avatarUrl}" />
				<div class="message admin-message ${themeType}"">
					<p>${messageText}</p>
					<label class="message-timestamp">${`${currentMoment.getHours()}:${currentMoment.getMinutes()}`}</label>
				</div>
			</div>
		</li>
		`;
	} else {
		message.innerHTML = `
		<li class="single-message-wrapper">
			<div class="text-wrapper">
				<img class="message-avatar ${avatarType}" src="${avatarUrl}" />
				<div class="message ${themeType}">
					<p>${messageText}</p>
					<label class="message-timestamp">${`${currentMoment.getHours()}:${currentMoment.getMinutes()}`}</label>
				</div>
			</div>
		</li>
		`;
	}
	messagesWrapper.appendChild(message); // adauga efectiv corpul mesajului in DOM
	document.querySelector('.chat-wrapper').classList.add(themeType);
	document.querySelector('.user-info').classList.add(themeType);
};
