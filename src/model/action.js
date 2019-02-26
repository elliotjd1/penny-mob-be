const _ = require('lodash');


class Action {
  constructor (name, description) {
    this.name = name;
    this.description = description;
    this.sourceMods = [];
    this.targetMods = [];

    this.requirements = [];
  }

  execute (location, sourceMob, targetMob) {
    console.log(sourceMob.name + ' performed ' + this.name + ' at ' + location.name + '!');

    if (!this.requirementsMet(location, sourceMob, targetMob)) {
      console.log(sourceMob.name + ' did not meet the requirements for this action and failed!');
      return;
    }

    _.forEach(this.sourceMods, mod => {
      mod.modify(sourceMob, location);
    });

    if (targetMob) {
      _.forEach(this.targetMods, mod => {
        mod.modify(targetMob, location);
      });
    }

  }

  requirementsMet (location, sourceMob, targetMob) {
    return _.every(this.requirements, requirement => {
      return requirement.isMet(location, sourceMob, targetMob);
    });
  }
}

module.exports = Action
