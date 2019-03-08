const _ = require('lodash');
const LocationInfluence = require('./locationInfluence');

class Location {
  constructor (id, name, description, requiredInfluence, coordinates) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.requiredInfluence = requiredInfluence;

    this.influences = [];
    this.ownedBy = null;
    this.actions = {};

    this.coordinates = coordinates ? coordinates : []
  }

  addAction (action) {
    this.actions[action.id] = action;
  }

  getMobActions (mob) {
    return _.filter(this.actions, action => {
      return action.requirementsMet(this, mob);
    });
  }

  spreadInfluence (mob, amount) {
    const influence = this.getInfluence(mob);
    if (influence) {
      influence.amount += amount;
    } else {
      this.influences.push(new LocationInfluence(this, mob, amount));
    }

    this.recalculateInfluence();
  }

  getInfluence (mob) {
    return _.find(this.influences, ['mob', mob]);
  }

  // Check to see if any mobs can now control this location and set accordingly.
  recalculateInfluence () {
    const primaryInfluence = _.maxBy(this.influences, 'amount');
    let secondaryInfluence = _.maxBy(this.influences, influence => {
      if (influence !== primaryInfluence) {
        return influence.amount;
      }
    });

    // If no other mob has a claim, use a blank one.
    if (!secondaryInfluence) {
      secondaryInfluence = { amount: 0, mob: { locations: [] } };
    }

    // If required influence threshold is broken by another mob, set them as the owners.
    // Also add this location to that mobs locations list, and remove from the previous owner's list.
    // Design Note: this does not require the owner to maintain their lead, they will remain the owner until an opposing mob breaks the threshold.
    // Weird Case: Team A has 50pts, B has 15, and C has 10. RequiredInfluence is at 25
    // Team C climbs up to 70 pts (20/25 to lead). Team B gets to 80 (30/25 to lead)
    // Team B does not get ownership because Team C is in 2nd place and only 10pts behind (25 required)
    // Team A maintains control with their 50pts while B and C keep fighting. Is this desirable?
    if (
      (primaryInfluence.amount - secondaryInfluence.amount) >= this.requiredInfluence
      && this.ownedBy !== primaryInfluence.mob
    ) {
      console.log(primaryInfluence.mob.name+' now owns this place. Influence: '+primaryInfluence.amount+' vs '+secondaryInfluence.amount);
      this.ownedBy = primaryInfluence.mob;

      primaryInfluence.mob.locations.push(this);
      _.pull(secondaryInfluence.mob.locations, this);
    }
  }

}

module.exports = Location
