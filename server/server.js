// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

const app = express();

// CORS configuration for Vercel
// This allows requests from your Vercel deployment URL and from localhost for development.
app.use(cors({
  origin: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  methods: ["GET", "POST", "PUT"]
}));

app.use(express.json());

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Connection error', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/surveys', require('./routes/surveys'));

// --- Local Development Server Setup ---
// This block will only run when you are NOT in a production environment like Vercel.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  const server = http.createServer(app);
  
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT"]
    }
  });
  
  // Make io accessible to routes
  app.set('socketio', io);
  
  io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);
    socket.on('disconnect', () => console.log('User disconnected:', socket.id));
  });
  
  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

// For Vercel, we export the Express app object. Vercel will handle the server creation.
module.exports = app;
