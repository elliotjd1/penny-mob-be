const _ = require('lodash');

const GameManager = require('./src/model/gameManager');
const Mob = require('./src/model/mob');
const Location = require('./src/model/location');
const Action = require('./src/model/action');
const ResourceModifier = require('./src/model/resourceModifier');
const InfluenceModifier = require('./src/model/influenceModifier');

const LocationUnownedBySource = require ('./src/model/actionRequirements/locationUnownedBySource');
const LocationOwnedBySource = require ('./src/model/actionRequirements/locationOwnedBySource');
const SourceHasMinResource = require ('./src/model/actionRequirements/sourceHasMinResource');


console.log('\n\n\n=======Welcome to Penny Mob=====');

const mobbo = new Mob('Mobbo');
const theLads = new Mob('The Lads');

console.log('Creating new mob: ' + mobbo.name);
console.log('Creating new mob: ' + theLads.name);

const digs = new Location('Digs', 'Where you live.', 10);
console.log('Creating new Location: ' + digs.name);



manage();
function manage () {
    gm = new GameManager ([
        new Mob('Mobbo'),
        new Mob('The Lads'),
        new Mob('Gregor\'s Gits')
    ]);
    gm.startGame();
    for (let i = 0; i < 1; i++) {
        gm.endTurn();
        gm.executeAction(digs, new Action('Do it!', null, digs));
    }
}


// doSomeThings();
function doSomeThings() {
    console.log('\n\n\n=======Spreading Influence=======');
    digs.spreadInfluence(mobbo, 5);
    digs.spreadInfluence(mobbo, 5);
    digs.spreadInfluence(theLads, 5);
    digs.spreadInfluence(mobbo, 5);
    digs.spreadInfluence(theLads, 5);
    digs.spreadInfluence(theLads, 5);
    digs.spreadInfluence(theLads, 5);
    digs.spreadInfluence(theLads, 5);

    console.log('Mobbo owns ' + mobbo.locations.length + ' locations');
    _.forEach(mobbo.locations, loc => {console.log('--' + loc.name);});
    console.log('The Lads own ' + theLads.locations.length + ' locations');
    _.forEach(theLads.locations, loc => {console.log('--' + loc.name);});
    console.log('Mobbos Influence: ' + digs.getInfluence(mobbo).amount);
    console.log('The Lads Influence: ' + digs.getInfluence(theLads).amount);


    console.log('\n\n\n=======Distributing Loot=======');
    mobbo.loot = 30;
    theLads.loot = 30;
    console.log('-Mobbos Loot: ' + mobbo.loot);
    console.log('-The Lads Loot: ' + mobbo.loot);


    console.log('\n\n\n=======Actions=======');
    // Create Heist
    const heist = new Action('~Heist~', 'Steal a bit of loot, sell it at a ridiculous markup.');
    heist.sourceMods.push(new ResourceModifier({lootMod: 10}));
    heist.targetMods.push(new ResourceModifier({lootMod: -5}));
    heist.requirements.push(new LocationUnownedBySource());
    heist.requirements.push(new SourceHasMinResource('loot', 10));
    digs.addAction(heist);

    // Create Production
    const produce = new Action('~Brew Bathtub Gin~', 'Maybe give it a good scrub first, eh?');
    produce.sourceMods.push(new ResourceModifier({lootMod: 5}));
    produce.sourceMods.push(new InfluenceModifier(2));
    produce.requirements.push(new LocationOwnedBySource());
    produce.requirements.push(new SourceHasMinResource('loot', 25));
    digs.addAction(produce);

    // Spread Influence
    const infl = new Action('~Buy the lads a round~', 'Share a pint and a few stories and people will pay attention.');
    infl.sourceMods.push(new ResourceModifier({lootMod: -1}));
    infl.sourceMods.push(new InfluenceModifier(5));
    infl.targetMods.push(new InfluenceModifier(-1));
    infl.requirements.push(new LocationUnownedBySource());
    digs.addAction(infl);

    // Super spread Influence
    const infl2 = new Action('~Put on a puppet show~', 'Not sure why everyone seems to enjoy these so much.');
    infl2.sourceMods.push(new ResourceModifier({lootMod: -15}));
    infl2.sourceMods.push(new InfluenceModifier(30));
    produce.requirements.push(new SourceHasMinResource('loot', 15));
    digs.addAction(infl2);

    let mobboActions = digs.getMobActions(mobbo);
    let theLadsActions = digs.getMobActions(theLads);
    console.log('Mobbo actions: ' + mobboActions.length);
    _.forEach(mobboActions, action => {console.log('--' + action.name);});
    console.log('The Lads actions: ' + theLadsActions.length);
    _.forEach(theLadsActions, action => {console.log('--' + action.name);});

    console.log('\n===Round1 - Getting in the Door===');
    infl.execute(mobbo, theLads);
    console.log('-Mobbos Loot: ' + mobbo.loot);
    console.log('-The Lads Loot: ' + theLads.loot);
    console.log('Mobbos Influence: ' + digs.getInfluence(mobbo).amount);
    console.log('The Lads Influence: ' + digs.getInfluence(theLads).amount);

    console.log('\n===Round2 - The Celebration===');
    produce.execute(theLads, mobbo);
    console.log('-Mobbos Loot: ' + mobbo.loot);
    console.log('-The Lads Loot: ' + theLads.loot);
    console.log('Mobbos Influence: ' + digs.getInfluence(mobbo).amount);
    console.log('The Lads Influence: ' + digs.getInfluence(theLads).amount);

    console.log('\n===Round3 - The Heist===');
    heist.execute(mobbo, theLads);
    console.log('-Mobbos Loot: ' + mobbo.loot);
    console.log('-The Lads Loot: ' + theLads.loot);
    console.log('Mobbos Influence: ' + digs.getInfluence(mobbo).amount);
    console.log('The Lads Influence: ' + digs.getInfluence(theLads).amount);

    console.log('\n===Round4 - The Lads Accidentally Click End Turn A Bit Prematurely===');

    console.log('\n===Round5 - The Puppet Show===');
    infl2.execute(mobbo, theLads);
    console.log('-Mobbos Loot: ' + mobbo.loot);
    console.log('-The Lads Loot: ' + theLads.loot);
    console.log('Mobbo owns ' + mobbo.locations.length + ' locations');
    _.forEach(mobbo.locations, loc => {console.log('--' + loc.name);});
    console.log('The Lads own ' + theLads.locations.length + ' locations');
    _.forEach(theLads.locations, loc => {console.log('--' + loc.name);});
    console.log('Mobbos Influence: ' + digs.getInfluence(mobbo).amount);
    console.log('The Lads Influence: ' + digs.getInfluence(theLads).amount);

    mobboActions = digs.getMobActions(mobbo);
    theLadsActions = digs.getMobActions(theLads);
    console.log('\nNew Actions:')
    console.log('Mobbo actions: ' + mobboActions.length);
    _.forEach(mobboActions, action => {console.log('--' + action.name);});
    console.log('The Lads actions: ' + theLadsActions.length);
    _.forEach(theLadsActions, action => {console.log('--' + action.name);});
}