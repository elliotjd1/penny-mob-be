const io = require('socket.io')();
const config = require('config');
const Room = require('./model/room');
const defaultRoom = 'waitingRoom';
const rooms = {
  testRoom: new Room('testRoom', '1234')
}


io.origins(['*:*']);
io.on('connection', client => { 
  const player = {
    id: client.id,
    room: defaultRoom,
    mobName: null
  }
  console.log(`Establishing connection for ${player.id}...`);
  emitPersonalNotification(`Welcome!`);
  
  // In testing mode, automatically start the game as soon as enough players are ready.
  if (config.bypassLobbyBrowser) {
    try {
      joinRoom('testRoom');
      if (rooms.testRoom.readyToPlay) {
        console.log('Automatically starting test game...');
        rooms[player.room].startGame();
      }
      emitState();
    } catch (err) {
      emitError(err);
    }
  } else {
    client.join(defaultRoom);
    emitRoomNotification(`${player.mobName} has joined the room!`);
    emitState();
  }

  client.on('createRoom', payload => {
    if (Object.keys(rooms).includes(payload.room)) {
      emitError(`Room "${payload.room} already exists."`);
      return;
    }
    console.log(`${player.id} is creating room ${payload.room}...`);

    rooms[payload.room] = new Room(payload.room, payload.password);
    joinRoom(payload.room);
  });

  client.on('joinRoom', payload => {
    if (!Object.keys(rooms).includes(payload.room)) {
      emitError(`Room "${payload.room} does not exist."`);
      return;
    }

    console.log(`${player.id} is joining room ${payload.room}...`);
    joinRoom(payload.room);
  });

  client.on('leaveRoom', payload => {
    rooms[player.room].leaveRoom(player.id);
    client.join(defaultRoom);
    player.room = defaultRoom;
    emitRoomNotification(`${player.mobName} has left the room.`);
    emitPersonalNotification(`You have left the room.`);
  });

  client.on('startGame', payload => {
    try {
      rooms[player.room].startGame();
      emitRoomNotification(`Game has started.`);
    } catch (err) {
      emitError(err);
    }
  });

  client.on('restartGame', payload => {
    try {
      rooms[player.room].restartGame();
      emitRoomNotification(`Game has been restarted.`);
    } catch (err) {
      emitError(err);
    }
  });


  client.on('locationSelect', payload => {
    console.log('fetching location information')
    console.log(payload);
    
    try {
      const location = rooms[player.room].gm.getLocationDetail(player.id, payload.location);
      client.emit('locationServe', {status: 'success', payload: location});
    } catch (err) {
      emitError(err);
    }
  });


  client.on('locationAction', payload => {
    console.log('trying to perform an action...');
    console.log(payload);

    try {
      rooms[player.room].gm.executeAction(player.id, payload.location, payload.action);
      emitState();
    } catch (err) {
      emitError(err);
    }
  });


  client.on('endTurn', payload => {
    console.log(payload);

    try {
      rooms[player.room].gm.endTurn(player.id);
      emitState();
      // TODO tell the next person it is their turn? or that should be up to the FE to render?
    } catch (err) {
      emitError(err);
    }
  });


  function joinRoom (room) {
    try {
      player.mobName = rooms[room].joinRoom(player.id);
      player.room = room;
      emitRoomNotification(`${player.mobName} has joined the room!`, room);
      emitPersonalNotification(`You have joined ${room}, along with ${rooms[room].gm.mobNameList().filter(n => n != player.mobName).join(', ')}`);
      client.join(player.room);
    } catch (err) {
      console.error(err);
      console.error(`${player.id} could not join room ${room}...`);
      emitError(err);
    }
  }

  function emitPersonalNotification (message) {
    client.emit('notification', {payload: message});
  }

  function emitRoomNotification (message, room) {
    if (!room) {
      room = player.room;
    }
    io.in(room).emit('notification', {payload: message});
  }

  // TODO this should work for not only game state, but lobby browser and lobby states
  function emitState () {
    io.in(player.room).emit('state', {status: 'success', payload: rooms[player.room].gm.getState()});
  }

  function emitError (message) {
    console.error(message);
    client.emit('state', {status: 'error', payload: message});
  }
});


io.listen(1612);
