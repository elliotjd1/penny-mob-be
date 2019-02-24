class Requirement {
  constructor () {}

  isMet (location, sourceMob, targetMob) {
    throw new Error('isMet location needs to be implement and return a boolean value');
  }
}

module.exports = { Requirement }
