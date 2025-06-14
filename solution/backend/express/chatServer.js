// chatServer.js

// Import the necessary modules
const express = require('express');        // Framework for creating web servers
const http = require('http');                           // HTTP Server Creation Module (Used by express)
const socketIo = require('socket.io');                  // Library for WebSocket, real-time communication
const path = require('path');               // Module to manage file paths
const cors = require('cors'); // Allows requests from other domains (Cross-Origin)

// Create an express Application
const app = express();

// Create an HTTP server from express (required to use with socket.io)
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


// Serve static files (like demo.html) from the "client_server" folder
app.use(express.static(path.join(__dirname, '../../frontend/client_server')));

// Default route to access directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/client_server', 'demo.html'));
});

// Gestione delle stanze per film
const movieRooms = new Map();

/* ------------- Socket.io event handling ------------- */

// When a client connects, this function is executed
io.on('connection', (socket) => {
    console.log(`🟢 Utente connesso: ${socket.id}`);

    // Client can send "joinRoom" to join a specific room
    socket.on('joinRoom', ({ room, username }) => {
        socket.join(room);                      // Joins the client to the specified "room"
        socket.data = { room, username };

        // Notifica l'ingresso nella chat
        io.to(room).emit('systemMessage', {
            type: 'join',
            username,
            room, // Include the room in the system message
            time: new Date().toISOString()
        });
    });

    // Receives a chat message from a client and forwards it to everyone in the same room
    socket.on('chatMessage', ({ room, message }) => {
        // Invia il messaggio SOLO alla stanza specificata
        io.to(room).emit('message', {
            username: socket.data.username,
            message,
            room, // Include the room in the message
            time: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        if (socket.data?.room && socket.data?.username) {
            // Notifica l'uscita dalla chat
            io.to(socket.data.room).emit('systemMessage', {
                type: 'leave',
                username: socket.data.username,
                room: socket.data.room, // Include the room in the system message
                time: new Date().toISOString()
            });
        }
    });
});

// Start the server on port 3001
const PORT = 3001;  // You can change the door if necessary
server.listen(PORT, () => {
    console.log(`💬 Chat server attivo su http://localhost:${PORT}`);
});