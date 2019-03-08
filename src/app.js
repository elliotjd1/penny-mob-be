const io = require('socket.io')();

const GameManager = require('./model/gameManager');


io.on('connection', client => { 
  console.log('connecting is happening...');
  const gm = loadTestGameManager();
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


function loadTestGameManager() {
  const Mob = require('./model/mob');
  const Location = require('./model/location');
  return new GameManager([
    new Mob('Mobbo'),
    new Mob('The Lads')
  ], {
    digs: new Location('digs', 'Digs', 'Where you live.', 10),
    docks: new Location('docks', 'Docks', 'Boats \'n hoes', 5)
  });
}