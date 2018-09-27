const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['sfx'],
  description: 'A FREE soundboard!',

  reaction: '🔊',
  existingConn: 'I only have one voice, dude. Please wait until the current sound is done, you assbutt',
  dir: 'sfx',
  cooldown: 3000,
  donorCD: 1000,
  ext: 'opus',
<<<<<<< Updated upstream:src/commands/soundCommands/sfx.js
  soundboard: true,
  ownerOnly: true
})
=======
  soundboard: true
});
>>>>>>> Stashed changes:scripts/soundCommands/sfx.js
