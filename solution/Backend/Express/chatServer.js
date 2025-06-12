// chatServer.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log(`🟢 Utente connesso: ${socket.id}`);

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`📥 ${socket.id} ha joinato la stanza ${room}`);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`📤 ${socket.id} ha lasciato la stanza ${room}`);
    });

    socket.on('chatMessage', ({ room, user, message }) => {
        const payload = {
            user,
            message,
            time: new Date().toISOString()
        };
        io.to(room).emit('message', payload);
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Utente disconnesso: ${socket.id}`);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`💬 Chat server attivo su http://localhost:${PORT}`);
});
