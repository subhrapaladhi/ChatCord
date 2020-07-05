"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// IMPORTS
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const messages_1 = require("./Services/messages");
const users_1 = require("./Services/users");
// DECLARATIONS
exports.app = express_1.default();
const server = http_1.default.createServer(exports.app);
const io = socket_io_1.default(server);
const botname = "ChatCord Bot";
// SET STATIC FOLDER
exports.app.use(express_1.default.static(`./Public`));
// SOCKET SETUP
io.on("connection", (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        console.log(username, room);
        const user = users_1.userJoin(socket.id, username, room);
        console.log(user);
        socket.join(user.room);
        // welcome the current user
        socket.emit("message", messages_1.formatMessage(botname, 'Welcome to ChatCord'));
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit("message", messages_1.formatMessage(botname, `${user.username} has joined the chat`));
        // Send user and room info
        io.to(user.room).emit('roominfo', {
            room: user.room,
            users: users_1.getRoomUsers(user.room)
        });
    });
    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = users_1.getCurrentUser(socket.id);
        if (user) {
            io.emit('message', messages_1.formatMessage(user.username, msg));
        }
        else {
            io.emit('message', messages_1.formatMessage('user not found', msg));
        }
    });
    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = users_1.userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', messages_1.formatMessage(botname, `${user.username} has left the chat`));
            io.to(user.room).emit('roominfo', {
                room: user.room,
                users: users_1.getRoomUsers(user.room)
            });
        }
    });
});
// START SERVER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
