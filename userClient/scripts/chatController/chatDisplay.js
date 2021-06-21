/* incarca chat-ul in pagina atunci cand un utilizator face log in cu succes

inlocuieste clasa "invisible" de pe wrapper-ul chatului cu clasa "visible" 
care schimba din display:none in display:flex pentru incarcare
*/
const openChat = async () => {
	const chatWrapper = document.querySelector('.chat-wrapper');
	const triggerButton = document.querySelector('.start-chat-button');

	chatWrapper.classList.remove('invisible');
	chatWrapper.classList.add('visible');
	triggerButton.classList.remove('visible-block');
	triggerButton.classList.add('invisible');
};

/* ascunde chat-ul din pagina */
const closeChat = () => {
	const chatWrapper = document.querySelector('.chat-wrapper');
	const triggerButton = document.querySelector('.start-chat-button');

	chatWrapper.classList.remove('visible');
	chatWrapper.classList.add('invisible');
	triggerButton.classList.remove('invisible');
	triggerButton.classList.add('visible-block');
};
