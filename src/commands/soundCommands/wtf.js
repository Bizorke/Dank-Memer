const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['wtf'],
  description: 'the fuck??',

  existingConn: 'I can only talk so much my dude, wait until I\'m done with whatever sound is playing before trying',
  reaction: '❓',
  dir: 'wtf',
  ext: 'opus',
<<<<<<< Updated upstream:src/commands/soundCommands/wtf.js
  files: 'wtf',
  ownerOnly: true
})
=======
  files: 'wtf'
});
>>>>>>> Stashed changes:scripts/soundCommands/wtf.js
