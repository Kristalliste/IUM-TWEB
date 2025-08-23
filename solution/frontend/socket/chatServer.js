import express from 'express';
import { createServer } from 'http'; // HTTP Server Creation Module (Used by express)
import { Server } from 'socket.io';
import path from 'path'; // Module to manage file paths
import { fileURLToPath } from 'url';
import {methods} from "express/lib/utils.js";
import cors from "cors"; // Used to get the current file path

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an express Application
const app = express();

// Create an HTTP server from express (required to use with socket.io)
const server = createServer(app);

// Initialize socket.io with the server,
const io = new Server(server, {
    cors: {
        origin: "http://localhost:63342", // Add your frontend origin
        methods: ["GET", "POST"]
    }
});

// Middleware to handle CORS and JSON
app.use(express.json());

// Serve static files (like mainView.html) from the "client_server" folder
app.use(express.static(path.join(__dirname, '../public/html')));

// Default route to access directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html', 'mainView.html'));
});

// Map to keep track of movie rooms and their users (currently unused, can be used for room management)
const movieRooms = new Map();

// Socket.io event handling
io.on('connection', (socket) => {
    console.log(` User connected: ${socket.id}`);

    // Client can send "joinRoom" to join a specific room
    socket.on('joinRoom', ({ room, username }) => {
        socket.join(room); // Join the specified room
        socket.data = { room, username }; // Store user data in the socket instance

        // Notification when entering the chat
        io.to(room).emit('systemMessage', {
            type: 'join',
            username,
            room, // Include the room in the system message
            time: new Date().toISOString()
        });
    });

    // Receives a chat message from a client and forwards it to everyone in the same room
    socket.on('chatMessage', ({ room, message }) => {
        io.to(room).emit('message', {
            username: socket.data.username, // Sender's username
            message,
            room,
            time: new Date().toISOString()
        });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        if (socket.data?.room && socket.data?.username) {
            // Notify chat exit
            io.to(socket.data.room).emit('systemMessage', {
                type: 'leave',
                username: socket.data.username,
                room: socket.data.room,
                time: new Date().toISOString()
            });
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Chat server started on http://localhost:${PORT}`);
});