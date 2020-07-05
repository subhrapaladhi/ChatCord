import { userData } from "../Interfaces/userData";

const users: userData[] = [];

// join user to chat
export const userJoin = (id:string, username:string, room:string) => {
    const user: userData = {id, username, room};

    users.push(user);
    return user
}

// Get current user
export const getCurrentUser = (id: string) => {
    return users.find(user => user.id == id)
}

// User leaves chat
export const userLeave = (id: string) => {
    const index = users.findIndex(user => user.id == id)

    if(index !== -1){
        return users.splice(index,1)[0];
    }
    return null
}

// Get room users
export const getRoomUsers = (room: string) => {
    return users.filter(user => user.room === room);
}