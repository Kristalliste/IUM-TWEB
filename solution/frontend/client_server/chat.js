import { escapeHTML } from './utils.js';

export function renderUsernamePrompt(container, movieTitle) {
    container.innerHTML = `
        <div class="username-prompt">
            <p>Scegli il tuo nome per la chat o partecipa in modo anonimo.</p>
            <input type="text" id="username-input" placeholder="Inserisci il tuo username..." maxlength="20">
            <div class="username-prompt-buttons">
                <button id="start-chat-btn">Inizia a chattare</button>
                <button id="anonymous-chat-btn">Entra come Anonimo</button>
            </div>
        </div>
    `;

    const startChatBtn = document.getElementById('start-chat-btn');
    const anonymousChatBtn = document.getElementById('anonymous-chat-btn');
    const usernameInput = document.getElementById('username-input');

    const handleStartChat = () => {
        const name = usernameInput.value.trim();
        if (name) {
            chatUsername = name;
            renderChatInterface(container, movieTitle);
        } else {
            usernameInput.style.borderColor = 'red';
            usernameInput.focus();
        }
    };

    startChatBtn.addEventListener('click', handleStartChat);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleStartChat();
        }
    });

    anonymousChatBtn.addEventListener('click', () => {
        chatUsername = 'Anonimo';
        renderChatInterface(container, movieTitle);
    });
}

export function renderChatInterface(container, movieTitle) {
    container.innerHTML = `
        <div class="chat-username-display">Stai chattando come: <strong>${escapeHTML(chatUsername)}</strong></div>
        <div id="chat-messages" class="chat-messages">
            <p class="chat-system">Benvenuto nella chat per "${movieTitle}"!</p>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Scrivi un messaggio...">
            <button id="send-chat-btn">Invia</button>
        </div>
    `;
    
    const sendBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    const handleSendMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
            const messageEl = document.createElement('p');
            messageEl.innerHTML = `<strong>${escapeHTML(chatUsername)}:</strong> ${escapeHTML(message)}`;
            chatMessages.appendChild(messageEl);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
            chatInput.focus();
        }
    };
    
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    chatInput.focus();
}

export let chatUsername = null;

