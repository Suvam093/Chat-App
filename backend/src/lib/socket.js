import express from 'express'; 
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',    
    },
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId]; //this will return the socket id of the userId passed to it
}

const userSocketMap = {}     //used to store all teh online users

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    const userId = socket.handshake.query.userId;   // Get the userId from the query parameter sent from the frontend when connecting to the socket
    if(userId){
        userSocketMap[userId] = socket.id;      //{userId: socket.id}
    }

    //io.emit is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('A Client disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { server, app, io };