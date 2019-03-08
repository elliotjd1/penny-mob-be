const io = require('socket.io')();
const tesLoader = require('../data/testLoader');


io.on('connection', client => { 
  console.log('connecting is happening...');

  const gm = tesLoader.getGameManager();
  gm.startGame();

  client.emit('state', gm.getState());

  client.on('locationSelect', payload => {
    console.log(payload);
    const location = gm.getLocationDetail(payload.location);
    client.emit('locationServe', location);
  });

  client.on('something', payload => {
    console.log('the payload');
    console.log(payload);
  });

});


io.listen(1612);
