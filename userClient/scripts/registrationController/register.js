const register = async () => {
	// luam datele pt register din input fields
	const email = document.querySelector('#email-field').value;
	const password = document.querySelector('#password-field').value;
	const name = document.querySelector('#name-field').value;
	const avatar = document.querySelector('#avatar-field').value;

	// field folosit pt a afisa eroare catre user in cazul in care lipsesc credentialele si se incearca login
	const fieldError = document.querySelector('.field-validation-error');

	// daca am date necompletate, afisez eroare
	if (!email || !password || !avatar || !name) {
		fieldError.classList.remove('invisible');
		fieldError.classList.add('visible');
	} else {
		fieldError.classList.remove('visible');
		fieldError.classList.add('invisible');
	}

	// daca userul a completat toate datele
	if (email && password && avatar && name) {
		fetch('http://localhost:8000/users', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password,
				name,
				avatar_link: avatar,
			}), // in body pun obiectul cu email, password, name si URL-ul la avatar
		})
			.then(function (response) {
				// dupa ce am primit raspunsul de la server
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response); // daca se returneaza alt status code decat 200 ok, eroare
			})
			.then(function (data) {
				// daca totul e ok, inregistrarea s-a facut cu succes
				console.log('Registration successful');

				// redirectionez user-ul catre login
				window.location.replace('/userClient/login.html');
			})
			.catch(function (error) {
				console.log('Registration error', error);
			});

		// pot sa dau clean la input fields
		document.querySelector('#email-field').value = '';
		document.querySelector('#password-field').value = '';
		document.querySelector('#name-field').value = '';
		document.querySelector('#avatar-field').value = '';
	}
};
