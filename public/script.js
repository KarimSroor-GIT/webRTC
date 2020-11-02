const { PeerServer } = require("peer");

const socket = io('/');
const vedioGrid = document.getElementById('vedio-grid');
const myVedio = document.createElement('video');
myVedio.muted = true;
const peers = {};
const myPeer = new Peer(undefined,{
host:'/',
port:'3001'
});

navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true  }).then(stream=>{
    addVedioStream(myVedio,stream)

    myPeer.on('call',call => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream',uservedioStream=> {
        addVedioStream(vedio,uservedioStream)
      })
    })
    socket.on('user-connected',(userId)=>{
      connectToNewUser(userId,stream)
    })  
  });

  socket.on('user-disconnected',(userId)=>{
  if (peers[userId]) peers[userId].close();
  });

myPeer.on('open', id => {
  socket.emit('join-room',ROOM_ID,id);
})





function addVedioStream(vedio,stream){
  vedio.srcObject = stream;
  vedio.addEventListener('loadedmetadata',()=>{
    vedio.play()
  });  
  vedioGrid.append(vedio);
}

function connectToNewUser(userId,stream){
  const call = myPeer.call(userId,stream);
  const video = document.createElement('video');

  call.on('stream',uservedioStream =>{
    addVedioStream(uservedioStream);
  });

  call.on('close',()=>{
    video.remove();
  });

  peers[userId]=call;
}