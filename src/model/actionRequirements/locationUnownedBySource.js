const Requirement = require('./requirement');


class LocationUnownedBySource extends Requirement {
  constructor () { super(); }

  isMet (location, sourceMob) {
    if (location && sourceMob && location.ownedBy !== sourceMob) {
      return true;
    }
    return false;
  }
}

module.exports = LocationUnownedBySource