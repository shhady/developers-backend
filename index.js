import express from 'express';
import mongoose from 'mongoose';
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import liveCodingRoutes from "./routes/liveCodingRoutes.js";
import http from 'http';
import dotenv from "dotenv";
import cors from "cors";
import { Server as SocketIOServer } from 'socket.io';
import { roomHandler } from './roomHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server.

const io = new SocketIOServer(server, {
    cors: {
        origin: '*', // Adjust this to match your frontend if needed
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());


let screenShareState = { isActive: false, sharerId: null, offer: null };
let userSocketMap = {}; 
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
    socket.on('registerUserSocket', (userId) => {
        if (userSocketMap[userId]) {
            userSocketMap[userId].push(socket.id);
        } else {
            userSocketMap[userId] = [socket.id];
        }

        // Clean up on disconnect
        socket.on('disconnect', () => {
            userSocketMap[userId] = userSocketMap[userId].filter(id => id !== socket.id);
            if (userSocketMap[userId].length === 0) {
                delete userSocketMap[userId];
            }
        });
    });
    if (screenShareState.isActive) {
        socket.emit('screenShareActive', screenShareState);
    }

    socket.on('startScreenShare', (data) => {
        screenShareState = { isActive: true, sharerId: socket.id, offer: data.offer };
        socket.broadcast.emit('screenShareActive', screenShareState);
    });

    socket.on('stopScreenShare', () => {
        screenShareState = { isActive: false, sharerId: null, offer: null };
        socket.broadcast.emit('screenShareStopped');
    });

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Use server.listen here, not app.listen
        server.listen(process.env.PORT || 8080, () => {
            console.log(`Server and Socket.IO running on port ${process.env.PORT || 8080}`);
        });
    })
    .catch(err => console.error(err));

app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', liveCodingRoutes);
