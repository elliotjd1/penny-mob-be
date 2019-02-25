class InfluenceModifier {
  constructor (amount) {
    this.amount = amount;
  }

  modify (mob, location) {
    location.spreadInfluence(mob, this.amount);
  }
}


module.exports = InfluenceModifier
