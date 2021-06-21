// functia care face xecuta un POST request catre API in momentul in care se apasa pe butonul de login

const login = async () => {
	// luam credentialele din input field
	const email = document.querySelector('#email-field').value;
	const password = document.querySelector('#password-field').value;

	// field folosit pt a afisa eroare catre user in cazul in care lipsesc credentialele si se incearca login
	const fieldError = document.querySelector('.field-validation-error');

	// daca am credentiale necompletate, afisez eroare
	if (!email || !password) {
		fieldError.classList.remove('invisible');
		fieldError.classList.add('visible');
	} else {
		fieldError.classList.remove('visible');
		fieldError.classList.add('invisible');
	}

	// daca am credentiale, pot face request-ul
	if (email && password) {
		fetch('http://localhost:8000/login', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password,
			}), // in body pun obiectul cu email si password
		})
			.then(function (response) {
				// dupa ce am primit raspunsul de la server
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response); // daca se returneaza alt status code decat 200 ok, eroare
			})
			.then(function (data) {
				// daca totul e ok, pun in localstorage JWT-ul primit
				localStorage.setItem('jwt', data['JWT']);

				try {
					const decodedToken = atob(data['JWT'].split('.')[1]); // decodez tokenul ca sa iau informatiile despre user
					localStorage.setItem('userData', decodedToken); // pun datele in localstorage ca sa am acces la ele
				} catch (e) {
					console.log('Error decoding JWT', e);
					return;
				}

				console.log('Authentication successful');
				// redirectionez user-ul catre index
				window.location.replace('/userClient/index.html');
			})
			.catch(function (error) {
				console.log('Authentication error', error);
			});

		// pot sa dau clean la input fields
		document.querySelector('#email-field').value = '';
		document.querySelector('#password-field').value = '';
	}
};
