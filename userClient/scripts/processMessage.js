const processMessage = () => {
	const message = document.querySelector('#message-input').value;

	Object.keys(emojiMapping).forEach((key) => {
		if (message.includes(` ${key} `))
			document.querySelector('#message-input').value = message.replace(
				key,
				` ${emojiMapping[key]} `
			);
	});
};
