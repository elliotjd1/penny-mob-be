const _ = require('lodash');

class Action {
  constructor (name, description) {
    this.name = name;
    this.description = description;
    this.sourceMods = [];
    this.targetMods = [];
  }

  execute (sourceMob, targetMob) {
    console.log(sourceMob.name + ' is ' + this.name + 'ing ' + targetMob.name + '!');

    _.forEach(this.sourceMods, mod => {
      mod.modifyResources(sourceMob);
    });
    _.forEach(this.targetMods, mod => {
      mod.modifyResources(targetMob);
    });
  }
}

module.exports = {
  Action
}
