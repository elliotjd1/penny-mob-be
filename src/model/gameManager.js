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
        action.execute(this.locations[location], this.activeMob);
    }

    endTurn () {
        this.activeMob = this.mobs[this.turn % this.mobs.length];
        console.log('Turn ' + this.turn + '. Player: ' + this.activeMob.name);
        this.turn++;
        this.actionsTaken = 0;
    }

    getLocationDetail (id) {
        const loc = this.locations[id];
        if (!loc) {
            return null;
        }
        return {
            id: id,
            name: loc.name,
            description: loc.description,
            requiredInfluence: loc.requiredInfluence,
            ownedBy: loc.ownedBy ? loc.ownedBy.name : null,
            availableActions: loc.getMobActions(this.activeMob),
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
    }

    getLocationGeneral (id) {
        const loc = this.locations[id];
        if (!loc) {
            return null;
        }
        return {
            id: id,
            name: loc.name,
            coordinates: loc.coordinates,
            ownedBy: loc.ownedBy ? loc.ownedBy.name : null
        }
    }

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
                    return loc.id
                })
            }
        });

        const locations = {};
        _.forEach(this.locations, (loc, id) => {
            locations[id] = this.getLocationGeneral(id);
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