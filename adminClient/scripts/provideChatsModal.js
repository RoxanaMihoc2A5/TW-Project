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
