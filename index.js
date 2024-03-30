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

io.on('connection', (socket) => {
    console.log('A user connected');
    roomHandler(socket)
    // Example of handling an event
    socket.on('disconnect', () => {
        console.log('User disconnected');
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
