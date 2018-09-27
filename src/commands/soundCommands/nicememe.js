const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['nicememe'],
  description: 'Let your friend know their meme was nice.',

  existingConn: 'I can only speak so much my dude, wait until I\'m done with whatever sound is playing before trying',
  reaction: '👍',
  dir: 'meme',
  ext: 'opus',
  message: 'Nice meme.',
<<<<<<< Updated upstream:src/commands/soundCommands/nicememe.js
  files: 'nice',
  ownerOnly: true
})
=======
  files: 'nice'
});
>>>>>>> Stashed changes:scripts/soundCommands/nicememe.js
