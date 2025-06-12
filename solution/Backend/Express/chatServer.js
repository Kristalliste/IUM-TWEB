// chatServer.js

// Importa i moduli necessari
const express = require('express');        // Framework per creare server web
const http = require('http');                           // Modulo per creare server HTTP (usato da Express)
const socketIo = require('socket.io');                  // Libreria per WebSocket, real-time communication
const path = require('path');               // Modulo per gestire i percorsi dei file
const cors = require('cors'); // Permette richieste da altri domini (Cross-Origin)

// Crea un'applicazione Express
const app = express();

// Crea un server HTTP a partire da Express (necessario per usarlo con socket.io)
const server = http.createServer(app);

// Inizializza socket.io con il server, configurando CORS per accettare connessioni da tutti i domini
const io = socketIo(server, {
    cors: {
        origin: "*",                // Permette richieste da qualsiasi origine
        methods: ["GET", "POST"]    // Metodi HTTP ammessi
    }
});

// Middleware per gestire CORS e JSON
app.use(cors());
app.use(express.json());


// Servi file statici (come chat-test.html) dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rotta di default per accedere direttamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat-test.html'));
});


/* ------------- Gestione degli eventi socket.io ------------- */

// Quando un client si connette, viene eseguita questa funzione
io.on('connection', (socket) => {
    console.log(`🟢 Utente connesso: ${socket.id}`);

    // Il client può inviare "joinRoom" per entrare in una stanza specifica
    socket.on('joinRoom', ({ room, user }) => {
        socket.join(room);                      // Unisce il client alla "stanza" specificata
        socket.data.username = user;            // Salva il nome utente nel socket per riferimenti futuri
        console.log(`📥 ${user} ha joinato la stanza ${room}`);
    });

    // Evento per uscire dalla stanza (opzionale)
    socket.on('leaveRoom', ({ room, user }) => {
        socket.leave(room);                 // Rimuove il client dalla stanza
        console.log(`📤 ${socket.data.username || socket.id} ha lasciato la stanza ${room}`);
    });

    // Riceve un messaggio di chat da un client e lo inoltra a tutti nella stessa stanza
    socket.on('chatMessage', ({ room, user, message }) => {
        const payload = {
            user,               // Nome dell'utente che ha inviato il messaggio
            message,            // Contenuto del messaggio
            time: new Date().toISOString()  // Timestamp del messaggio
        };
        io.to(room).emit('message', payload);   // Invia il messaggio a tutti nella stanza
    });

    // Evento eseguito quando un utente si disconnette dal server
    socket.on('disconnect', () => {
        console.log(`🔴 ${socket.data.username || socket.id} si è disconnesso`);
    });
});

// Avvia il server sulla porta 3001
const PORT = 3001;  // Puoi cambiare la porta se necessario
server.listen(PORT, () => {
    console.log(`💬 Chat server attivo su http://localhost:${PORT}`);
});
