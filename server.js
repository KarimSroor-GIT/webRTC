const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4 : uuidv} = require('uuid');

// setup
app.set('view engine','ejs');
app.use(express.static('public'));

//routes
app.get('/',(req,res)=>{
  res.redirect(`/${uuidv()}`);
});

app.get('/:room',(req,res)=>{
  res.render('room',{roomId:req.params.room});
});

io.on('connection',(socket)=>{
socket.on('join-room',(roomId,userId)=>{
      socket.join(roomId);
      socket.to(roomId).broadcast.emit('user-connected',userId);
  });

socket.on('disconnect',()=>{
  socket.to(roomId).broadcast.emit('user-disconnected',userId);
});
});
server.listen(3000,()=>{console.log('server listening on port 3000')});
