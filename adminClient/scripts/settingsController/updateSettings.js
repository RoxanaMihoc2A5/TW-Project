const updateSettings = async () => {
	const theme = document.querySelector('#theme').value;
	const position = document.querySelector('#position').value;
	const avatar = document.querySelector('#avatars').value;

	const payload = {
		avatar,
		position,
		theme,
	};

	await fetch('http://localhost:8000/chatSettings', {
		method: 'PUT',
		headers: new Headers({
			Authorization: 'Bearer ' + localStorage.getItem('jwt'),
		}),
		body: JSON.stringify(payload),
	}).catch((e) => console.log('Chat settings update failed', e));

	document.querySelector('.settings-wrapper').style.display = 'none';
};
