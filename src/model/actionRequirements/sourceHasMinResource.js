const Requirement = require('./requirement').Requirement;


class SourceHasMinResource extends Requirement {
  constructor (resourceType, amount) {
    super();
    if (!resourceType) {
      throw new Error('Must specify resource type! (loot, power, etc.)');
    }
    if (!amount) {
      throw new Error('Must specify minimum amount of resource!');
    }

    this.resourceType = resourceType;
    this.amount = amount;
  }

  isMet (location, sourceMob) {
    if (sourceMob[this.resourceType] >= this.amount) {
      return true;
    }
    return false;
  }
}

module.exports = { SourceHasMinResource }
