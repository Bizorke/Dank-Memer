const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['scare', 'jumpscare'],
  description: 'AHHHHH SCARY',

  existingConn: 'I only have one pet ghost, dude. Please wait until the current sound is done, you assbutt',
  dir: 'scares',
<<<<<<< Updated upstream:src/commands/soundCommands/scare.js
  ext: 'opus',
  ownerOnly: true
})
=======
  reaction: '👻',
  ext: 'opus'
});
>>>>>>> Stashed changes:scripts/soundCommands/scare.js
