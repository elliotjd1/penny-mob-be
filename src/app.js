const io = require('socket.io')();
const Room = require('./model/room');
const room = new Room('room1', '1234'); // TODO support for multiple rooms

io.origins(['*:*']);


io.on('connection', client => { 
  const player = client.id;
  console.log(`establishing connection for ${player}...`);

  room.joinRoom(player);
  client.emit('state', {status: 'success', payload: room.gm.getState()});

  client.on('locationSelect', payload => {
    console.log('fetching location information')
    console.log(payload);
    
    try {
      const location = room.gm.getLocationDetail(player, payload.location);
      client.emit('locationServe', {status: 'success', payload: location});
    } catch (err) {
      console.log(err);
      client.emit('state', {status: 'error', payload: err});
    }
  });


  client.on('locationAction', payload => {
    console.log('trying to perform an action...');
    console.log(payload);

    try {
      room.gm.executeAction(player, payload.location, payload.action);
      io.emit('state', {status: 'success', payload: room.gm.getState()});
    } catch (err) {
      console.log(err);
      client.emit('state', {status: 'error', payload: err});
    }
  });


  client.on('endTurn', payload => {
    console.log(payload);

    try {
      room.gm.endTurn(player);
      io.emit('state', {status: 'success', payload: room.gm.getState()});
      // TODO tell the next person it is their turn?
    } catch (err) {
      console.log(err);
      client.emit('state', {status: 'error', payload: err});
    }
  });
});


io.listen(1612);
