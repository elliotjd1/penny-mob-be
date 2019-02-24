const Mob = require('./src/model/mob').Mob;
const Location = require('./src/model/location').Location;
const Action = require('./src/model/action').Action;
const ResourceModifier = require('./src/model/resourceModifier').ResourceModifier;


const mobbo = new Mob('Mobbo');
const theLads = new Mob('The Lads');
mobbo.loot = 20;
theLads.loot = 20;

const digs = new Location('Digs', 'Where you live.', 10);
digs.actions.push(new Action('get money', 'bitches hoes cash money'));

digs.spreadInfluence(mobbo, 5);
digs.spreadInfluence(mobbo, 5);
digs.spreadInfluence(theLads, 5);
digs.spreadInfluence(mobbo, 5);
digs.spreadInfluence(theLads, 5);
digs.spreadInfluence(theLads, 5);
digs.spreadInfluence(theLads, 5);
digs.spreadInfluence(theLads, 5);
digs.spreadInfluence(theLads, 5);

console.log('Mobbos Influence: ' + digs.getInfluence(mobbo).amount);
console.log('The Lads Influence: ' + digs.getInfluence(theLads).amount);

console.log('Mobbos Loot: ' + mobbo.loot);
console.log('The Lads Loot: ' + mobbo.loot);

console.log('Mobbo owns ' + mobbo.locations.length + ' locations');
console.log('The Lads own ' + theLads.locations.length + ' locations');

const lootBoost = new ResourceModifier({lootMod: 12});
const lootLoss = new ResourceModifier({lootMod: -5});
const heist = new Action('Heist', 'Steal a bit of loot, sell it a ridiculous markup.');
heist.sourceMods.push(lootBoost);
heist.targetMods.push(lootLoss);

heist.execute(theLads, mobbo);
console.log('Mobbos Loot: ' + mobbo.loot);
console.log('The Lads Loot: ' + theLads.loot);