import { escapeHTML } from './utils.js';

// Socket.IO client instance
let socket = null;
// Current chat room ID
let currentRoom = null;
// Current user's username
let currentUsername = null;

export function renderUsernamePrompt(container, movieTitle, movieId) {
    currentRoom = movieId;
    container.innerHTML = `
        <div class="username-prompt">
            <p>Choose your username or join anonymously.</p>
            <input type="text" id="username-input" placeholder="Type your username..." maxlength="20">
            <div class="username-prompt-buttons">
                <button id="anonymous-chat-btn">Join anonymously</button>
                <button id="start-chat-btn">Start chatting</button>
            </div>
        </div>
    `;

    const startChatBtn = document.getElementById('start-chat-btn');
    const anonymousChatBtn = document.getElementById('anonymous-chat-btn');
    const usernameInput = document.getElementById('username-input');

    const handleStartChat = () => {
        const username = usernameInput.value.trim() || 'Anonymous';
        connectToChat(username, movieTitle, movieId);
    };

    startChatBtn.addEventListener('click', handleStartChat);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleStartChat();
    });

    anonymousChatBtn.addEventListener('click', () => {
        connectToChat('Anonymous', movieTitle, movieId);
    });
}

// Connects to chat server
function connectToChat(username, movieTitle, roomId) {
    // Close existing connections
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }

    currentUsername = username;
    socket = io('http://localhost:3001');

    socket.on('connect', () => {
        // Store username in socket session
        socket.emit('setUsername', username);

        // Join room
        socket.emit('joinRoom', {
            room: roomId,
            username: username
        });

        // Render chat interface
        if (roomId === 1) {
            renderChatInterface(document.getElementById('floating-chat-body'), movieTitle, username, roomId);
        } else {
            renderChatInterface(document.getElementById('chat-wrapper'), movieTitle, username, roomId);
        }
    });

    // Listen for chat messages
    socket.on('message', (data) => {
        if (data.room === currentRoom) {
            appendMessage(data.username, data.message, data.time);
        }
    });

    // Listen for system messages (join/leave notifications)
    socket.on('systemMessage', (data) => {
        if (data.room === currentRoom) {
            const systemMsg = document.createElement('p');
            systemMsg.className = 'chat-system';

            if (data.type === 'join') {
                // Don't show your join
                if (data.username !== currentUsername) {
                    systemMsg.textContent = `${data.username} joined the chat`;
                    document.getElementById('chat-messages').appendChild(systemMsg);
                    scrollToBottom();
                }
            } else if (data.type === 'leave') {
                systemMsg.textContent = `${data.username} left the chat`;
                document.getElementById('chat-messages').appendChild(systemMsg);
                scrollToBottom();
            }
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Disconnected from chat');
    });
}

export function renderChatInterface(container, movieTitle, username, roomId) {
    if (roomId === 1) {
        container.innerHTML = `
        <div class="chat-username-display">
            You're chatting as: <strong>${escapeHTML(username)}</strong> | 
            Chat: <strong>${escapeHTML(movieTitle)}</strong>
        </div>
        <div id="chat-messages" class="chat-messages">
            <p class="chat-system">Welcome to the main chat!</p>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Write something...">
            <button id="send-chat-btn">Send</button>
        </div>
        `;
    } else {
        container.innerHTML = `
        <div class="chat-username-display">
            You're chatting as: <strong>${escapeHTML(username)}</strong> | 
            Chat for: <strong>${escapeHTML(movieTitle)}</strong>
        </div>
        <div id="chat-messages" class="chat-messages">
            <p class="chat-system">Welcome to the chat for "${escapeHTML(movieTitle)}"!</p>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Write something...">
            <button id="send-chat-btn">Send</button>
        </div>
        `;
    }

    const sendBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');

    const handleSendMessage = () => {
        const message = chatInput.value.trim();
        if (message && socket && socket.connected) {
            // Send message
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

// Appends message to chat (now manages its messages better)
function appendMessage(username, message, timestamp) {
    const chatMessages = document.getElementById('chat-messages');
    const messageEl = document.createElement('p');

    const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // If the message contains "has left the conversation", it is a system message.
    if (message === 'has left the conversation') {
        messageEl.className = 'chat-system';
        messageEl.textContent = `${username} has left the conversation`;
    } else {
        // Normal message
        const displayName = (username === currentUsername) ? "Me" : username;
        messageEl.innerHTML = `
            <strong>${escapeHTML(displayName)}</strong>
            <span class="message-time">[${time}]</span>: 
            ${escapeHTML(message)}
        `;
    }

    chatMessages.appendChild(messageEl);
    scrollToBottom();
}

// Scrolls chat to bottom
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Disconnect from chat
export function disconnectChat() {
    if (socket && currentRoom && currentUsername) {
        socket.emit('leaveRoom', {
            room: currentRoom,
            username: currentUsername
        });
        socket.disconnect();
        socket = null;
        currentRoom = null;
        currentUsername = null;
    }
}

// Returns true if current room is general chat
export function isGeneralChat() {
    return currentRoom === 1;
}

// Cleanup on window close
window.addEventListener('beforeunload', () => {
    disconnectChat();
});