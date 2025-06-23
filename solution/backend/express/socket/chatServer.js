// chatServer.js

// Import the necessary modules
import express from 'express'; // Framework for creating web servers
import { createServer } from 'http'; // HTTP Server Creation Module (Used by express)
import { Server } from 'socket.io'; // Library for WebSocket, real-time communication
import path from 'path'; // Module to manage file paths
import cors from 'cors'; // Allows requests from other domains (Cross-Origin)
import { fileURLToPath } from 'url'; // Allows requests from other domains (Cross-Origin)

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an express Application
const app = express();

// Create an HTTP server from express (required to use with socket.io)
const server = createServer(app);

// Initialize socket.io with the server, configuring CORS to accept connections from all domains
const io = new Server(server, {
    cors: {
        origin: "*",                // Allows requests from any source
        methods: ["GET", "POST"]    // HTTP methods allowed
    }
});

// Middleware to handle CORS and JSON
app.use(cors());
app.use(express.json());


// Serve static files (like mainView.html) from the "client_server" folder
app.use(express.static(path.join(__dirname, '../../../frontend/client_server')));

// Default route to access directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/client_server', 'mainView.html'));
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
        console.log('User disconnected:', socket.id);
    });
});

// Start the server on port 3001
const PORT = 3001;  // You can change the door if necessary
server.listen(PORT, () => {
    console.log(`💬 Chat server attivo su http://localhost:${PORT}`);
});