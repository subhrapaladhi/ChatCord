// IMPORTS
import express from "express";
import http from "http";
import socketio from "socket.io";
import {formatMessage} from "./Services/messages";
import {userJoin, getCurrentUser, userLeave, getRoomUsers} from "./Services/users";
import {userData} from "./Interfaces/userData";


// DECLARATIONS
export const app: express.Application = express();
const server = http.createServer(app);
const io = socketio(server);
const botname = "ChatCord Bot";

// SET STATIC FOLDER
app.use(express.static(`./Public`))

// SOCKET SETUP
io.on("connection", (socket: socketio.Socket) => {
    socket.on('joinRoom', ({username, room})=> {
        console.log(username,room);
        const user: userData = userJoin(socket.id, username,room);
        console.log(user)
        socket.join(user.room);

        // welcome the current user
        socket.emit("message", formatMessage(botname, 'Welcome to ChatCord'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit(
            "message", 
            formatMessage(botname, `${user.username} has joined the chat`)
        );

        // Send user and room info
        io.to(user.room).emit('roominfo', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        const user: userData|undefined = getCurrentUser(socket.id);
        if(user){
            io.emit('message', formatMessage(user.username, msg));
        } else {
            io.emit('message', formatMessage('user not found', msg));
        }
    })

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit(
                'message', 
                formatMessage(botname, `${user.username} has left the chat`)
            );
            io.to(user.room).emit('roominfo', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    })
})

// START SERVER
const PORT = process.env.PORT||3000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`))