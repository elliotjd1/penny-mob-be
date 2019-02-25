const _ = require('lodash');


class GameManager {
    constructor (mobs, locations) {
        this.turn = 0;
        this.activeMob = null;
        this.actionsTaken = 0;
        this.actionsLimit = 3;
        this.mobs = mobs;
        this.locations = locations;
    }

    startGame () {
        this.mobs = _.shuffle(this.mobs);
    }

    executeAction (location, action) {
        // TODO check that action is valid for current mob in this location
        this.actionsTaken++;
        if (this.actionsTaken > this.actionsLimit) {
            throw new Error('NO!');
        }
        // TODO get target if applicable
        action.execute(this.activeMob);
    }

    endTurn () {
        this.activeMob = this.mobs[this.turn % this.mobs.length];
        console.log('Turn ' + this.turn + '. Player: ' + this.activeMob.name);
        this.turn++;
        this.actionsTaken = 0;
    }
}


module.exports = GameManager;