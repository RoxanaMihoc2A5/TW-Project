const login = async () => {
	const email = document.querySelector('#email-field').value;
	const password = document.querySelector('#password-field').value;

	const fieldError = document.querySelector('.field-validation-error');

	if (!email || !password) {
		fieldError.classList.remove('invisible');
		fieldError.classList.add('visible');
	} else {
		fieldError.classList.remove('visible');
		fieldError.classList.add('invisible');
	}

	if (email && password) {
		fetch('http://localhost:8000/login', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then(function (response) {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then(function (data) {
				localStorage.setItem('jwt', data['JWT']);

				try {
					const decodedToken = atob(data['JWT'].split('.')[1]); // decodez tokenul ca sa iau informatiile despre user
					localStorage.setItem('userData', decodedToken); // pun datele in localstorage ca sa am acces la ele
				} catch (e) {
					return;
				}

				console.log('Authentication successful');
				window.location.replace('/adminClient/index.html');
			})
			.catch(function (error) {
				console.log('Authentication error', error);
			});

		document.querySelector('#email-field').value = '';
		document.querySelector('#password-field').value = '';
	}
};
