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

// dicey will auto-accept friend requests
if (buddypond.me === 'Dicey') {
  desktop.on('Buddy::IncomingBuddyRequest', 'automaton-dicey-autoaccepts-buddyrequest', function (buddyrequest) {
    // will spam a little bit, we can fix this later but adding lock / concurrency to emitter
    buddypond.approveBuddy(buddyrequest.from, function (err, res) {
      console.log('buddypond.approveBuddy back', err, res);
    });
  });
}
