const io = require('socket.io')();
io.on('connection', client => { 
  console.log('something is happening...');
  console.log(client);
});
io.listen(1612);

io.emit('connection', {context: 'hey'});