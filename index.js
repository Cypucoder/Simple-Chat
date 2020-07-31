var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//Used for demo purposes to temporarily save nicknames to server
var nicknames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var socket; //via advice from Spyri

io.on('connection', function(socket){
  console.log('a user connected');
    
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
   socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', {msg: msg, nick: socket.nickname});
  });

    //used in updating temporary nicknames
  socket.on('new user', function(data, callback){
    if (nicknames.indexOf(data) != -1){
        callback(false);
    } else{
        callback(true);
        socket.nickname = data;
        nicknames.push(socket.nickname);
        io.emit('usernames', nicknames);
        updateNicknames();
    }
  });
    
    function updateNicknames() {
        io.sockets.emit('usernames', nicknames);        
    }
    
      socket.on('disconnect', function(data){
          if(!socket.nickname) return;
          nicknames.splice(nicknames.indexOf(socket.nickname), 1);
          updateNicknames();
  });
    
});


http.listen(2999, function(){
  console.log('listening on *:2999');
});