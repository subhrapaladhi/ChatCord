"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomUsers = exports.userLeave = exports.getCurrentUser = exports.userJoin = void 0;
const users = [];
// join user to chat
exports.userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
};
// Get current user
exports.getCurrentUser = (id) => {
    return users.find(user => user.id == id);
};
// User leaves chat
exports.userLeave = (id) => {
    const index = users.findIndex(user => user.id == id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return null;
};
// Get room users
exports.getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
};
