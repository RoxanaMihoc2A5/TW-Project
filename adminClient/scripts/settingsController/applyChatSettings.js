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

	if (currentSettings.position === 'right') {
		chatWrapper.style.right = '16px';
		chatWrapper.style.left = 'auto';
		triggerButton.style.right = '16px';
		triggerButton.style.left = 'auto';
	} else {
		chatWrapper.style.left = '24px';
		chatWrapper.style.right = 'auto';
		triggerButton.style.left = '24px';
		triggerButton.style.right = 'auto';
	}
};

applyChatSettings();
