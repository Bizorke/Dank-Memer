const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['theone', 'thememe'],
  description: 'I AM THE ONE',

  existingConn: 'I can only talk so much my dude, wait until I\'m done with whatever sound is playing before trying',
  reaction: '👍',
  dir: 'theone',
  ext: 'opus',
<<<<<<< Updated upstream:src/commands/soundCommands/theone.js
  files: 'theone',
  ownerOnly: true
})
=======
  files: 'theone'
});
>>>>>>> Stashed changes:scripts/soundCommands/theone.js
