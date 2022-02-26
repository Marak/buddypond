desktop.app.automaton.automatons.dicey = {};

//
// each method exported on an `Automaton` is expected to be an `Action`
//

// simple dice roll math
desktop.app.automaton.automatons.dicey.roll = function diceyRoll (max) {
  if (typeof max === 'undefined') {
    max = 20;
  }
  let roll = Math.floor(Math.random() * max);
  return roll;
};