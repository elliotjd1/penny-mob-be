const _ = require('lodash');
const DataLoader = require('../../data/dataLoader');
const Mob = require('./mob');


class GameManager {
    constructor () {
        this.turn = 0;
        this.gameStarted = false;
        this.activePlayer = null;
        this.turnOrder = [];
        this.actionsTaken = 0;
        this.actionsLimit = 3;

        this.data = new DataLoader();
        this.locations = this.data.locations;
        this.mobs = {};
    }

    startGame () {
        console.log('Starting new game...');
        console.log(`Players: ${this.mobNameList().join(', ')}`)
        this.gameStarted = true;
        const players = Object.keys(this.mobs);
        this.turnOrder = _.shuffle(players);
        this.endTurn();
    }

    addMob (player) {
        const mob = new Mob(this.data.getRandomMobName(this.mobNameList()));
        mob.id = player;
        this.mobs[player] = mob;
    }

    executeAction (sourcePlayer, locationId, actionId) {
        if (this.activePlayer && sourcePlayer != this.activePlayer.id) {
            console.log(`${sourcePlayer} tried to action on ${this.activePlayer.id}'s turn`);
            throw 'It is not your turn, you cannot perform any action';
        }
        this.actionsTaken++;
        if (this.actionsTaken > this.actionsLimit) {
            throw 'Exceeded maximum number of actions for this turn.';
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
        
        action.execute(location, this.activePlayer);
    }

    endTurn (sourcePlayer) {
        if (this.activePlayer && sourcePlayer != this.activePlayer.id) {
            throw 'It is not your turn, you cannot perform any action';
        }
        const nextMob = this.turnOrder[this.turn % this.turnOrder.length];
        this.activePlayer = this.mobs[nextMob];
        this.turn++;
        this.actionsTaken = 0;
        console.log(`Turn ${this.turn} Player: ${this.activePlayer.name}`);
    }

    getLocationDetail (sourcePlayer, id) {
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
            availableActions: loc.getMobActions(this.activePlayer),
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
            gameStarted: this.gameStarted,
            turn: this.turn,
            activePlayer: this.activePlayer ? this.activePlayer.id : null,
            actionsTaken: this.actionsTaken,
            actionLimit: this.actionsLimit,
            mobs: mobs,
            locations: locations
        }

        return gameState;
    }

    mobNameList () {
        return _.map(this.mobs, (mob) => { return mob.name; });
    }
}


module.exports = GameManager;