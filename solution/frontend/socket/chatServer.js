import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create express application
const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "http://localhost:63342",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public/html')));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html', 'mainView.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join room event
    socket.on('joinRoom', ({ room, username }) => {
        socket.join(room);
        // Broadcast join message to all users in the room
        io.to(room).emit('systemMessage', {
            type: 'join',
            username: username,
            room: room,
            time: new Date().toISOString()
        });
    });

    // Chat message event
    socket.on('chatMessage', ({ room, message }) => {
        const username = socket.username || 'Anonymous';
        // Broadcast message to all users in room
        io.to(room).emit('message', {
            username: username,
            message: message,
            room: room,
            time: new Date().toISOString()
        });
    });

    // Leave room event
    socket.on('leaveRoom', ({ room, username }) => {
        // Broadcast leave message
        io.to(room).emit('message', {
            username: username,
            message: 'has left the conversation',
            room: room,
            time: new Date().toISOString()
        });
        socket.leave(room);
    });

    // Store username when user joins (to maintain consistency)
    socket.on('setUsername', (username) => {
        socket.username = username;
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        // If we had stored room and username, send a disconnect message
        if (socket.room && socket.username) {
            io.to(socket.room).emit('systemMessage', {
                type: 'leave',
                username: socket.username,
                room: socket.room,
                time: new Date().toISOString()
            });
        }
    });
});

// Start server
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Chat server listening on http://localhost:${PORT}`);
});