const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['hey', 'HEYYEYAAEYAAAEYAEYAA'],
  description: 'HEYYEYAAEYAAAEYAEYAA I SAID HEY',

  existingConn: 'I can only talk so much my dude, wait until I\'m done with whatever sound is playing before trying',
  reaction: '👍',
  dir: 'hey',
  ext: 'opus',
<<<<<<< Updated upstream:src/commands/soundCommands/hey.js
  files: 'hey',
  ownerOnly: true
})
=======
  files: 'hey'
});
>>>>>>> Stashed changes:scripts/soundCommands/hey.js
