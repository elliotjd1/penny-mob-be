const _ = require('lodash');


class GameManager {
    constructor (locations) {
        this.turn = 0;
        this.activeMob = null;
        this.turnOrder = [];
        this.actionsTaken = 0;
        this.actionsLimit = 3;
        this.mobs = {};
        this.locations = locations;
    }

    startGame () {
        const players = Object.keys(this.mobs);
        this.turnOrder = _.shuffle(players);
        this.endTurn();
    }

    addMob (mob) {
        const id = 'player' + Object.keys(this.mobs).length;
        mob.id = id;
        this.mobs[id] = mob;
    }

    executeAction (locationId, actionId) {
        this.actionsTaken++;
        if (this.actionsTaken > this.actionsLimit) {
            throw ('Exceeded maximum number of actions for this turn.');
        }

        // TODO get target if applicable

        const location = this.locations[locationId];
        const action = location.actions[actionId];
        if (!location) {
            throw 'Location not found';
        }
        if (!action) { // TODO check that action is valid for current mob in this location
            throw 'Action is not valid for this location/mob.';
        }
        
        action.execute(location, this.activeMob);
    }

    endTurn () {
        const nextMob = this.turnOrder[this.turn % this.turnOrder.length];
        this.activeMob = this.mobs[nextMob];
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
            ownedBy: loc.ownedBy ? loc.ownedBy.id : null,
            availableActions: loc.getMobActions(this.activeMob),
            allActions: _.map(loc.actions, action => {
                return action.id;
            }),
            influences: _.map(loc.influences, inf => {
                return {
                    mob: inf.mob.id,
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
            ownedBy: loc.ownedBy ? loc.ownedBy.id : null
        }
    }

    getMobDetail (id) {
        const mob = this.mobs[id];
        if (!mob) {
            return null;
        }
        return {
            id: mob.id,
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
    }

    getState () {
        const mobs = {};
        _.forEach(this.mobs, (mob, id) => {
            mobs[id] = this.getMobDetail(id);
        });

        const locations = {};
        _.forEach(this.locations, (loc, id) => {
            locations[id] = this.getLocationGeneral(id);
        });

        const gameState = {
            turn: this.turn,
            activeMob: this.activeMob.id,
            actionsTaken: this.actionsTaken,
            actionLimit: this.actionsLimit,
            mobs: mobs,
            locations: locations
        }

        return gameState;
    }
}


module.exports = GameManager;