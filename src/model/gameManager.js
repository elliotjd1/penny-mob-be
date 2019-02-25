const _ = require('lodash');

const actionLimit = 3;


class GameManager {
    constructor (mobs, locations) {
        this.turn = 0;
        this.actionsTaken = 0;
        this.mobs = mobs;
        this.locations = locations;
    }

    startGame () {
        this.mobs = _.shuffle(this.mobs);
    }

    endTurn () {
        this.turn++;
    }
}


module.exports = GameManager;