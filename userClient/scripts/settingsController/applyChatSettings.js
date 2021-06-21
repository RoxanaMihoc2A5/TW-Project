const applyChatSettings = async () => {
	const triggerButton = document.querySelector('.start-chat-button');
	const avatar = document.querySelector('.message-avatar');
	const chatWrapper = document.querySelector('.chat-wrapper');
	const message = document.querySelector('.message');

	const currentSettingsResponse = await fetch(
		'http://localhost:8000/chatSettings'
	);
	const currentSettings = await currentSettingsResponse.json();

	localStorage.setItem('chatSettings', JSON.stringify(currentSettings));
	chatWrapper.classList.add(currentSettings.position);
	triggerButton.classList.add(currentSettings.position);
};

applyChatSettings();
