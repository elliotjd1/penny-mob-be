const io = require('socket.io')();
const tesLoader = require('../data/testLoader');

io.origins(['*:*']);


io.on('connection', client => { 
  console.log('connecting is happening...');


  const gm = tesLoader.getGameManager();
  gm.startGame();
  client.emit('state', {status: 'success', payload: gm.getState()});


  client.on('locationSelect', payload => {
    console.log('fetching location information')
    console.log(payload);
    
    try {
      const location = gm.getLocationDetail(payload.location);
      client.emit('locationServe', {status: 'success', payload: location});
    } catch (err) {
      console.log(err);
      client.emit('state', {status: 'error', payload: err});
    }
  });


  client.on('locationAction', payload => {
    console.log('doing an action');
    console.log(payload);

    try {
      gm.executeAction(payload.location, payload.action);
      io.emit('state', {status: 'success', payload: gm.getState()});
    } catch (err) {
      console.log(err);
      client.emit('state', {status: 'error', payload: err});
    }
  });


  client.on('endTurn', payload => {
    console.log('ending the turn');
    console.log(payload);

    try {
      gm.endTurn();
      io.emit('state', {status: 'success', payload: gm.getState()});
      // TODO tell the next person it is their turn?
    } catch (err) {
      console.log(err);
      client.emit('state', {status: 'error', payload: err});
    }
  });
});


io.listen(1612);
