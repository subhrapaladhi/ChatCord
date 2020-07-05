"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const messages_1 = require("./Utils/messages");
// DECLARATIONS
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
const botname = "ChatCord Bot";
// SET STATIC FOLDER
app.use(express_1.default.static(`./Public`));
// SOCKET SETUP
io.on("connection", socket => {
    // welcome the current user
    socket.emit("message", messages_1.formatMessage(botname, 'Welcome to ChatCord'));
    // Broadcast when a user connects
    socket.broadcast.emit('message', messages_1.formatMessage(botname, "A user has joined the chat"));
    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', messages_1.formatMessage('USER', 'A user has left the chat'));
    });
    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', messages_1.formatMessage('USER', msg));
    });
});
// START SERVER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
