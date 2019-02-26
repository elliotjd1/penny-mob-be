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
        this.endTurn();
    }

    executeAction (location, action) {
        // TODO check that action is valid for current mob in this location
        this.actionsTaken++;
        if (this.actionsTaken > this.actionsLimit) {
            throw new Error('NO!');
        }
        // TODO get target if applicable
        action.execute(location, this.activeMob);
    }

    endTurn () {
        this.activeMob = this.mobs[this.turn % this.mobs.length];
        console.log('Turn ' + this.turn + '. Player: ' + this.activeMob.name);
        this.turn++;
        this.actionsTaken = 0;
    }

    // TODO some kind of id system would work better than referencing names/titles
    getState () {
        const mobs = _.map(this.mobs, mob => {
            return {
                name: mob.name,
                loot: mob.loot,
                power: mob.power,
                heat: mob.heat,
                thugs: mob.thugs,
                urchins: mob.urchins,
                connections: mob.connections,
                locations: _.map(mob.locations, loc => {
                    return loc.name
                })
            }
        });

        const locations = _.map(this.locations, loc => {
            return {
                name: loc.name,
                description: loc.description,
                requiredInfluence: loc.requiredInfluence,
                ownedBy: loc.ownedBy ? loc.ownedBy.name : null,
                availableActions: _.map(loc.getMobActions(this.activeMob), action => {
                    return action.name;
                }),
                allActions: _.map(loc.actions, action => {
                    return action.name;
                }),
                influences: _.map(loc.influences, inf => {
                    return {
                        mob: inf.mob.name,
                        amount: inf.amount
                    }
                })
            }
        });

        const gameState = {
            turn: this.turn,
            activeMob: this.activeMob.name,
            actionsTaken: this.actionsTaken,
            actionLimit: this.actionsLimit,
            mobs: mobs,
            locations: locations
        }

        return gameState;
    }
}


module.exports = GameManager;