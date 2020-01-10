const GameManager = require('./gameManager');

class Room {
    constructor (name, password) {
        this.name = name;
        this.password = password;
        this.capacity = 4;
        this.minimumPlayers = 2;
        this.readyToPlay = false;
        this.gm = new GameManager();
        this.players = [];
    }

    startGame () {
        if (this.players.length < this.minimumPlayers) {
            throw `Not enough players are ready (${this.minimumPlayers} needed).`;
        }
        if (this.gm.gameStarted) {
            throw `Game has already started`;
        }
        this.gm.startGame();
    }

    joinRoom (userName) {
        console.log(`${userName} is joining ${this.name}`);
        if (this.gm.gameStarted) {
            throw `Game has already started, get out.`;
        }
        if (this.players.length >= this.capacity) {
            throw `Game is full (maximum ${this.capacity} players).`;
        }
        if (!this.players.includes(userName)) {
            this.players.push(userName);
            this.gm.addMob(userName);
            console.log(`${userName} has been added to ${this.name}`);
        }
        if (this.players.length >= this.minimumPlayers) {
            console.log(`${this.name} now has enough players to begin.`);
            this.readyToPlay = true;
        }

        return this.gm.mobs[userName].name;
    }

    leaveRoom (userName) {
        this.gm.removeMob(userName);
        const playerIndex = this.players.indexOf(userName);
        if (playerIndex > -1) {
            this.players.splice(playerIndex, 1);
        }
        if (this.players.length < this.minimumPlayers) {
            this.readyToPlay = false;
        }
    }

    restartGame () {
        console.log('restarting game...');
        this.gm = new GameManager();
        if (this.players.length > 0) {
            this.players.forEach((player) => {
                this.gm.addMob(player);
            });
            if (!this.gm.gameStarted && this.readyToPlay) {
                this.gm.startGame();
            } else {
                throw `Not enough players available to start game. ${this.minimumPlayers} needed. Or game has already started.`;
            }
        }
    }

    getState () {
        const roomState = {
          name: this.name,
          capacity: this.capacity,
          minimumPlayers: this.minimumPlayers,
          readyToPlay: this.readyToPlay,
          players: this.players.map((player) => {
            return {
              userName: player,
              mobName: this.gm.mobs[player].name
            }
          })
        }
        console.log(roomState);
        return roomState;
    }
}

module.exports = Room;
