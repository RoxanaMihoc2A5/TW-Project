// functie care verifica daca utilizatorul este logat pt a sti daca i se permite accesul spre index.html
// verificam in localstorage daca exista jwt si e valid
// daca da, inseamna ca utilizatorul este logat si nu facem nimic
// daca nu, inseamna ca utilizatorul nu e logat si il redirectionam catre pagina de login

const checkLoggedIn = () => {
	if (!localStorage.getItem('jwt')) {
		console.log('Not logged in, redirecting');
		window.location.replace('/adminClient/login.html');
	}
	try {
		const decodedToken = atob(localStorage.getItem('jwt').split('.')[1]);
	} catch (e) {
		window.location.replace('/adminClient/login.html'); // daca nu am putut decoda token-ul, inseamna ca e nevalid => redirect la login
	}
};

checkLoggedIn(); // aceasta functie se va executa inainte de incarcarea paginii
