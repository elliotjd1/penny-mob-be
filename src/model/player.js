class Player {
  constructor (socketId, name, password) {
    this.name = name;
    this.password = password;
    this.socketId = socketId;
    this.level = 0;
  }
}

module.exports = Player;
