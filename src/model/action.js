const _ = require('lodash');


class Action {
  constructor (name, description, location) {
    this.name = name;
    this.description = description;
    this.location = location;
    this.sourceMods = [];
    this.targetMods = [];

    this.requirements = [];
  }

  execute (sourceMob, targetMob) {
    console.log(sourceMob.name + ' is ' + this.name + 'ing ' + targetMob.name + '!');

    if (!this.requirementsMet(sourceMob, targetMob)) {
      console.log('Action could not be performed');
      return;
    }

    _.forEach(this.sourceMods, mod => {
      mod.modifyResources(sourceMob);
    });
    _.forEach(this.targetMods, mod => {
      mod.modifyResources(targetMob);
    });
  }

  requirementsMet (sourceMob, targetMob) {
    return _.every(this.requirements, requirement => {
      return requirement.isMet(this.location, sourceMob, targetMob);
    });
  }
}

module.exports = {
  Action
}
