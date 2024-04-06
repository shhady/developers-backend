import express from 'express';
import mongoose from 'mongoose';
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import liveCodingRoutes from "./routes/liveCodingRoutes.js";
import http from 'http';
import dotenv from "dotenv";
import cors from "cors";
import { Server as SocketIOServer } from 'socket.io';
import cron from 'node-cron';
import LiveCoding from './models/liveCoding.js';
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
    console.log('A user connected: ' + socket.id);
  
    // Handle signaling data
    socket.on('signal', (data) => {
      // send signal to everyone except the sender
      socket.broadcast.emit('signal', data);
    });
     socket.on('chatMessage', (message) => {
    // Broadcast the received message to all clients (including the sender)
    io.emit('chatMessage', message);
  });
  });
  let serverStarted = false;

  async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully connected to MongoDB');
        // Proceed to start the server here if connection is successful
        if (!serverStarted) {
        server.listen(process.env.PORT || 8080, () => {
            console.log(`Server and Socket.IO running on port ${process.env.PORT || 8080}`);
        });
    }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // Handle failure (e.g., retry connection, exit process)
    }
}


app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', liveCodingRoutes);


async function deleteExpiredSessions() {
    const now = new Date();
    try {
      const result = await LiveCoding.deleteMany({
        date: { $lt: now }, // $lt selects those documents where the value of the field is less than (i.e., before) the specified date
      });
      console.log(`Deleted ${result.deletedCount} expired sessions.`);
    } catch (error) {
      console.error('Error deleting expired sessions:', error);
    }
  }
  
  // Connect to the database
  connectToDatabase();
  
  // Schedule the deletion task to run every day at midnight
  cron.schedule('0 0 * * *', deleteExpiredSessions);