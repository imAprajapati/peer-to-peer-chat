const express = require('express');
const {Server}  = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors: {origin: "*"}}); 
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
} );

let connectedUsers = new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.query?.userId;
  if(userId){
    connectedUsers.set(userId,socket.id);
  }
  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);   
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});     

server.listen(3000, () => {
  console.log('listening on *:3000');
});


