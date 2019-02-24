class ResourceModifier {
  constructor ({
    lootMod = 0,
    powerMod = 0,
    heatMod = 0,
    thugsMod = 0,
    urchinsMod = 0,
    connectionsMod = 0
  }) {
    this.lootMod = lootMod;
    this.powerMod = powerMod;
    this.heatMod = heatMod;

    this.thugsMod = thugsMod;
    this.urchinsMod = urchinsMod;
    this.connectionsMod = connectionsMod;
  }

  // Design Note: This allows potentially for negative resources.
  // If desired this could represent debt or a bad reputation.
  modifyResources (mob) {
    mob.loot += this.lootMod;
    mob.power += this.powerMod;
    mob.heat += this.heatMod;
    mob.thugs += this.thugsMod;
    mob.urchins += this.urchinsMod;
    mob.connections += this.connectionsMod;
  }
}


module.exports = {
  ResourceModifier
}
