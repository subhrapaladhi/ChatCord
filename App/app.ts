// IMPORTS
import express from "express";
import http from "http";
import socketio from "socket.io";
import {formatMessage} from "./Utils/messages";

// DECLARATIONS
const app: express.Application = express();
const server = http.createServer(app);
const io = socketio(server);
const botname = "ChatCord Bot";

// SET STATIC FOLDER
app.use(express.static(`./Public`))

// SOCKET SETUP
io.on("connection", socket => {
    // welcome the current user
    socket.emit("message", formatMessage(botname, 'Welcome to ChatCord'));

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botname, "A user has joined the chat"));

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage('USER', 'A user has left the chat'));
    })

    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    })
})

// START SERVER
const PORT = process.env.PORT||3000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`))