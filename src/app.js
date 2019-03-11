const io = require('socket.io')();
const tesLoader = require('../data/testLoader');

io.origins(['*:*']);

io.on('connection', client => { 
  console.log('connecting is happening...');

  const gm = tesLoader.getGameManager();
  gm.startGame();

  client.emit('state', gm.getState());

  client.on('locationSelect', payload => {
    console.log(payload);
    const location = gm.getLocationDetail(payload.location);
    client.emit('locationServe', location);
    io.emit('state', gm.getState());
  });

  client.on('locationAction', payload => {
    console.log('doing an action');
    console.log(payload);
    gm.executeAction(payload.location, payload.action);
    io.emit('state', gm.getState());
  });

});


io.listen(1612);
