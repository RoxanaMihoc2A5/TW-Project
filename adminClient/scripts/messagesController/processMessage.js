// functie care verifica mesajul dat ca input si verifica daca ultimul cuvant scris este cheie in dictionarul emojiMapping
// daca ultimul cuvant scris este cheie a dictionarului, atunci va fi disponibil butonul cu emoji-ul aferent pe care se va putea da click pentru substituire

const processMessage = () => {
	const message = document.querySelector('#message-input').value;

	const messageWords = message.split(' '); // obtinem un array de cuvinte
	const lastWrittenWord = messageWords[messageWords.length - 1].toLowerCase(); // extragem ultimul cuvant din array si aplicam toLowerCase
	if (Object.keys(emojiMapping).includes(lastWrittenWord)) {
		// daca ultimul cuvant scris se regaseste in lista de emoji
		document.querySelector('.emoji-suggestion-button').style.display = 'block'; // afisam butonul
		document.querySelector('.emoji-suggestion-button').innerHTML =
			emojiMapping[lastWrittenWord]; // in buton vom pune emoji-ul pt ca userul sa stie cu ce poate inlocui
	} else {
		document.querySelector('.emoji-suggestion-button').style.display = 'none'; // daca ultimul cuvant scris nu apare in lista de emoji-uri, ascundem butonul
	}
};

// functie care inlocuieste ultimul cuvant scris cu emoji-ul aferent atunci cand se apasa pe butunol disponibil
const replaceLastWordWithEmoji = () => {
	const message = document.querySelector('#message-input').value;
	const messageWords = message.split(' '); // obtinem un array de cuvinte
	const lastWrittenWord = messageWords[messageWords.length - 1]; // extragem ultimul cuvant din array

	const indexOfLastWord = messageWords.lastIndexOf(lastWrittenWord); // luam indexul din array al ultimului cuvant

	messageWords.splice(
		indexOfLastWord,
		1,
		emojiMapping[lastWrittenWord.toLowerCase()]
	); // substituim ultimul cuvant cu emoji-ul aferent => splice va inlocui cuvantul care incepe la indexul [indexOfLastWord] cu emoji-ul corespunzator

	document.querySelector('#message-input').value = messageWords.join(' '); // refacem textul => concatenam la loc elementele din array pt a reface stringul original cu ultimul cuvant inlocuit
	document.querySelector('.emoji-suggestion-button').style.display = 'none'; // ascundem butonul pt emoji
	document.querySelector('#message-input').focus(); // focusam automat la loc inputul pt ca atunci cand am apasat pe buton, s-a pierdut
};
