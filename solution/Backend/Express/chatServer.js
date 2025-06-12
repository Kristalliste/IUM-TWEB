// chatServer.js

// Import the necessary modules
const express = require('express');        // Framework for creating web servers
const http = require('http');                           // HTTP Server Creation Module (Used by Express)
const socketIo = require('socket.io');                  // Library for WebSocket, real-time communication
const path = require('path');               // Module to manage file paths
const cors = require('cors'); // Allows requests from other domains (Cross-Origin)

// Create an Express Application
const app = express();

// Create an HTTP server from Express (required to use with socket.io)
const server = http.createServer(app);

// Initialize socket.io with the server, configuring CORS to accept connections from all domains
const io = socketIo(server, {
    cors: {
        origin: "*",                // Allows requests from any source
        methods: ["GET", "POST"]    // HTTP methods allowed
    }
});

// Middleware to handle CORS and JSON
app.use(cors());
app.use(express.json());


// Serve static files (like chat-test.html) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route to access directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat-test.html'));
});


/* ------------- Socket.io event handling ------------- */

// When a client connects, this function is executed
io.on('connection', (socket) => {
    console.log(`🟢 Utente connesso: ${socket.id}`);

    // Client can send "joinRoom" to join a specific room
    socket.on('joinRoom', ({ room, user }) => {
        socket.join(room);                      // Joins the client to the specified "room"
        socket.data.username = user;            // Save the username in the socket for future reference
        console.log(`📥 ${user} ha joinato la stanza ${room}`);
    });

    // Event to leave the room (optional)
    socket.on('leaveRoom', ({ room, user }) => {
        socket.leave(room);                 // Removes the client from the room
        console.log(`📤 ${socket.data.username || socket.id} ha lasciato la stanza ${room}`);
    });

    // Receives a chat message from a client and forwards it to everyone in the same room
    socket.on('chatMessage', ({ room, user, message }) => {
        const payload = {
            user,               // Name of the user who sent the message
            message,            // Contents of the message
            time: new Date().toISOString()  // Timestamp of the message
        };
        io.to(room).emit('message', payload);   // Send the message to everyone in the room
    });

    // Event executed when a user disconnects from the server
    socket.on('disconnect', () => {
        console.log(`🔴 ${socket.data.username || socket.id} si è disconnesso`);
    });
});

// Start the server on port 3001
const PORT = 3001;  // You can change the door if necessary
server.listen(PORT, () => {
    console.log(`💬 Chat server attivo su http://localhost:${PORT}`);
});
