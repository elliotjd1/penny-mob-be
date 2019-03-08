const io = require('socket.io')();

const GameManager = require('./model/gameManager');
const Mob = require('./model/mob');
const Location = require('./model/location');

io.on('connection', client => { 
  console.log('connecting is happening...');
  const gm = loadTestGameManager();
  gm.startGame();

  // TODO send the state
  client.emit('state', gm.getState());

  client.on('locationSelect', payload => {
    console.log('welcome to the location, we got fun but have run out of games');
    console.log('payload');
    client.emit('locationServe', {location: 'your mom'});
  });

  client.on('something', payload => {
    console.log('the payload');
    console.log(payload);
  });
  
  // TODO on click territory, get the location and whatever thingers are available
});


io.listen(1612);


function loadTestGameManager() {
  return new GameManager([
    new Mob('Mobbo'),
    new Mob('The Lads')
  ], {
    digs: new Location('digs', 'Digs', 'Where you live.', 10),
    docks: new Location('docks', 'Docks', 'Boats \'n hoes', 5)
  });
}