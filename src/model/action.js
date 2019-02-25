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
    console.log(sourceMob.name + ' performed ' + this.name + ' on ' + targetMob.name + '!');

    if (!this.requirementsMet(sourceMob, targetMob)) {
      console.log(sourceMob.name + ' did not meet the requirements for this action and failed!');
      return;
    }

    _.forEach(this.sourceMods, mod => {
      mod.modify(sourceMob, this.location);
    });
    _.forEach(this.targetMods, mod => {
      mod.modify(targetMob, this.location);
    });
  }

  requirementsMet (sourceMob, targetMob) {
    return _.every(this.requirements, requirement => {
      return requirement.isMet(this.location, sourceMob, targetMob);
    });
  }
}

module.exports = Action
