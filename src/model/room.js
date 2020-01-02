const GameManager = require('./gameManager');

class Room {
    constructor (name, password) {
        this.name = name;
        this.password = password;
        this.gm = new GameManager();
        this.players = [];
    }

    joinRoom (userName) {
        if (this.gm.gameStarted) {
            console.log(`Game has already started, ${userName}, get out.`);
        }
        if (!this.players.includes(userName)) {
            this.players.push(userName);
            this.gm.addMob(userName);
        }
        if (!this.gm.gameStarted && this.players.length > 1) {
            this.gm.startGame();
        }
    }
}

module.exports = Room;