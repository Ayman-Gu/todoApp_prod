const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const tasksRoutes = require('./apis/tasks');

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api', tasksRoutes);


// Start server
server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

// Socket event listener (optional)
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});
