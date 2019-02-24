class LocationInfluence {
  constructor (location, mob, startingAmount) {
    this.location = location;
    this.mob = mob;

    this.amount = 0;
    if (startingAmount) {
      this.amount = startingAmount;
    }
  }
}

module.exports = {
  LocationInfluence
}
