class Mob {
  constructor (name) {
    this.id = null;
    this.name = name;

    // Your mob
    this.thugs = 0;
    this.urchins = 0;
    this.heroes = [];

    // What you want
    this.loot = 0;  // For purchases and bribes
    this.muscle = 0; // For operations and skirmishes
    this.influence = 0; // For infiltration and persuasion

    // What you don't want
    this.heat = 0;  // Attention from the authorities
    this.dissent = 0; // Attention from your lieutenants
  }

  executeAction (action) {

  }
}

module.exports = Mob

