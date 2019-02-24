class Mob {
  constructor (name) {
    this.name = name;

    this.loot = 0;
    this.power = 0;
    this.heat = 0;

    this.thugs = 0;
    this.urchins = 0;
    this.connections = 0;

    this.locations = [];
    this.heroes = [];
  }

  executeAction (action) {

  }
}

module.exports = {
  Mob
}
