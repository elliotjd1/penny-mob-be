const Requirement = require('./requirement').Requirement;


class LocationUnownedBySource extends Requirement {
  constructor () { super(); }

  isMet (location, sourceMob) {
    if (location && sourceMob && location.ownedBy !== sourceMob) {
      return true;
    }
    console.log('Requirement not met. Source owns this location.');
    return false;
  }
}

module.exports = { LocationUnownedBySource }
