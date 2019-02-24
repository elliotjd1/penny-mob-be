const Requirement = require('./requirement').Requirement;


class LocationOwnedBySource extends Requirement {
  constructor () { super(); }

  isMet (location, sourceMob) {
    if (location && sourceMob && location.ownedBy === sourceMob) {
      return true;
    }
    return false;
  }
}

module.exports = { LocationOwnedBySource }
