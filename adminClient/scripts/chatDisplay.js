const openChat = () => {
	const chatWrapper = document.querySelector('.chat-wrapper');
	const chatHeader = document.querySelector('.chat-header');
	const triggerButton = document.querySelector('.start-chat-button');

	chatWrapper.classList.remove('invisible');
	chatWrapper.classList.add('visible');
	triggerButton.classList.remove('visible');
	triggerButton.classList.add('invisible');
	chatHeader.classList.remove('invisible');
	chatHeader.classList.add('visible');
};
