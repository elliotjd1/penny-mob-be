const io = require('socket.io')();
const config = require('config');
const Room = require('./model/room');
const defaultRoom = config.bypassLobbyBrowser ? 'testRoom' : 'waitingRoom';
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
  client.join(defaultRoom);

  // In testing mode, automatically start the game as soon as enough players are ready.
  if (config.bypassLobbyBrowser) {
    try {
      player.mobName = rooms.testRoom.joinRoom(player.id);
      if (rooms[player.room].readyToPlay) {
        console.log('Automatically starting test game...');
        rooms[player.room].startGame();
      }
    } catch (err) {
      emitError(err);
    }
  }

  emitPersonalNotification(`Welcome ${player.mobName}`);
  emitState();
  emitRoomNotification(`${player.mobName} has joined the room!`);

  client.on('createRoom', payload => {
    if (Object.keys(rooms).includes(payload.room)) {
      emitError(`Room "${payload.room} already exists."`);
      return;
    }
  });

  client.on('joinRoom', payload => {
    if (!Object.keys(rooms).includes(payload.room)) {
      emitError(`Room "${payload.room} does not exist."`);
      return;
    }
    console.log(`${player.id} is joining room ${payload.room}...`);
    try {
      player.mobName = rooms[payload.room].joinRoom(player.id);
      player.room = payload.room;
      client.join(player.room);
      emitRoomNotification(`${player.mobName} has joined the room!`);
    } catch (err) {
      console.error(`${player.id} could not join room ${payload.room}...`);
      emitError(err);
    }

    
  });

  client.on('leaveRoom', payload => {
    rooms[player.room].leaveRoom(player.id);
    client.join(defaultRoom);
    player.room = defaultRoom;
  });

  client.on('startGame', payload => {

  });

  client.on('restartGame', payload => {
    rooms[player.room].restartGame();
    emitRoomNotification(`Game has been restarted`);
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

  function emitPersonalNotification (message) {
    client.emit('notification', {payload: message});
  }

  function emitRoomNotification (message) {
    io.in(player.room).emit('notification', {payload: message});
  }

  function emitState () {
    io.in(player.room).emit('state', {status: 'success', payload: rooms[player.room].gm.getState()});
  }

  function emitError (message) {
    console.error(err);
    client.emit('state', {status: 'error', payload: message});
  }
});


io.listen(1612);
