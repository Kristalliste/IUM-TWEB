import { escapeHTML } from './utils.js';

let socket = null;
let currentRoom = null;
let currentUsername = null;

export function renderUsernamePrompt(container, movieTitle, movieId) {
    currentRoom = movieId;
    container.innerHTML = `
        <div class="username-prompt">
            <p>Scegli il tuo nome per la chat o partecipa in modo anonimo.</p>
            <input type="text" id="username-input" placeholder="Inserisci il tuo username..." maxlength="20">
            <div class="username-prompt-buttons">
                <button id="anonymous-chat-btn">Entra come Anonimo</button>
                <button id="start-chat-btn">Inizia a chattare</button>
            </div>
        </div>
    `;

    const startChatBtn = document.getElementById('start-chat-btn');
    const anonymousChatBtn = document.getElementById('anonymous-chat-btn');
    const usernameInput = document.getElementById('username-input');

    const handleStartChat = () => {
        const username = usernameInput.value.trim() || 'Anonimo';
        connectToChat(username, movieTitle, movieId);
    };

    startChatBtn.addEventListener('click', handleStartChat);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleStartChat();
    });

    anonymousChatBtn.addEventListener('click', () => {
        connectToChat('Anonimo', movieTitle, movieId);
    });
}

function connectToChat(username, movieTitle, roomId) {
    // Chiudi connessione esistente se presente
    if (socket) {
        socket.removeAllListeners(); // Rimuovi tutti i listener
        socket.disconnect();
        socket = null;
    }

    currentUsername = username;
    socket = io('http://localhost:3001');

    socket.on('connect', () => {
        currentUsername = username;
        socket.emit('joinRoom', {
            room: roomId,
            username: username
        });
        if(roomId === 1){
            renderChatInterface(document.getElementById('floating-chat-body'), movieTitle, username, roomId);
        }else {
            renderChatInterface(document.getElementById('chat-wrapper'), movieTitle, username, roomId);
        }

    });

    socket.on('message', (data) => {
        // Solo se siamo nella stanza corretta
        if (data.room === currentRoom) {
            appendMessage(data.username, data.message, data.time);
        }
    });

    socket.on('systemMessage', (data) => {
        // Solo se siamo nella stanza corretta
        if (data.room === currentRoom) {
            const systemMsg = document.createElement('p');
            systemMsg.className = 'chat-system';

            if (data.type === 'join') {
                systemMsg.textContent = `${data.username} si è unito alla chat`;
            } else if (data.type === 'leave') {
                systemMsg.textContent = `${data.username} ha lasciato la chat`;
            }

            document.getElementById('chat-messages').appendChild(systemMsg);
            scrollToBottom();
        }
    });

    socket.on('disconnect', () => {
        console.log('Disconnesso dalla chat');
    });
}

export function renderChatInterface(container, movieTitle, username, roomId) {

    if(roomId === 1){
        container.innerHTML = `
        <div class="chat-username-display">
            Stai chattando come: <strong>${escapeHTML(username)}</strong> | 
            Chat: <strong>${escapeHTML(movieTitle)}</strong>
        </div>
        <div id="chat-messages" class="chat-messages">
            <p class="chat-system">Benvenuto nella chat generale!</p>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Scrivi un messaggio...">
            <button id="send-chat-btn">Invia</button>
        </div>
        `;
    } else {
        container.innerHTML = `
        <div class="chat-username-display">
            Stai chattando come: <strong>${escapeHTML(username)}</strong> | 
            Film: <strong>${escapeHTML(movieTitle)}</strong>
        </div>
        <div id="chat-messages" class="chat-messages">
            <p class="chat-system">Benvenuto nella chat per "${escapeHTML(movieTitle)}"!</p>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Scrivi un messaggio...">
            <button id="send-chat-btn">Invia</button>
        </div>
        `;
    }

    
    const sendBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');

    const handleSendMessage = () => {
        const message = chatInput.value.trim();
        if (message&& socket && socket.connected) {
            socket.emit('chatMessage', {
                room: roomId,
                message: message
            });
            chatInput.value = '';
        }
    };
    
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
    chatInput.focus();
}

function appendMessage(username, message, timestamp) {
    const chatMessages = document.getElementById('chat-messages');
    const messageEl = document.createElement('p');

    const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageEl.innerHTML = `
        <strong>${escapeHTML(username)}</strong>
        <span class="message-time">[${time}]</span>: 
        ${escapeHTML(message)}
    `;

    chatMessages.appendChild(messageEl);
    scrollToBottom();
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Cleanup quando si lascia la pagina
window.addEventListener('beforeunload', () => {
    if (socket) {
        socket.disconnect();
    }
});