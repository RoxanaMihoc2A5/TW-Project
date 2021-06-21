const provideChatsModal = () => {
	const chatsListWrapper = document.querySelector('.chats-list-wrapper');
	if (
		chatsListWrapper.style.display === 'none' ||
		!chatsListWrapper.style.display
	) {
		chatsListWrapper.style.display = 'initial';
	} else {
		chatsListWrapper.style.display = 'none';
	}

	window.onclick = function (event) {
		if (event.target == chatsListWrapper) {
			chatsListWrapper.style.display = 'none';
		}
	};
};

const provideSettingsModal = async () => {
	const settingsWrapepr = document.querySelector('.settings-wrapper');

	if (
		settingsWrapepr.style.display === 'none' ||
		!settingsWrapepr.style.display
	) {
		const currentSettingsResponse = await fetch(
			'http://localhost:8000/chatSettings'
		);
		const currentSettings = await currentSettingsResponse.json();
		document.querySelector('#theme').value = currentSettings.theme;
		document.querySelector('#position').value = currentSettings.position;
		document.querySelector('#avatars').value = currentSettings.avatar;
		settingsWrapepr.style.display = 'initial';
	} else {
		settingsWrapepr.style.display = 'none';
	}

	window.onclick = function (event) {
		if (event.target == settingsWrapepr) {
			settingsWrapepr.style.display = 'none';
		}
	};
};
