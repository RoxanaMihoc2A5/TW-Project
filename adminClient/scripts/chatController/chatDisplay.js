/* incarca chat-ul in pagina atunci cand un utilizator face log in cu succes

inlocuieste clasa "invisible" de pe wrapper-ul chatului cu clasa "visible" 
care schimba din display:none in display:flex pentru incarcare
*/
const openChat = () => {
	const chatWrapper = document.querySelector('.chat-wrapper');
	const chatHeader = document.querySelector('.chat-header');
	const triggerButton = document.querySelector('.start-chat-button');

	chatWrapper.classList.remove('invisible');
	chatWrapper.classList.add('visible');

	chatHeader.classList.remove('invisible');
	chatHeader.classList.add('visible');

	triggerButton.classList.remove('visible-block');
	triggerButton.classList.add('invisible');
};
