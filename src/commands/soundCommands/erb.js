const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['erb', 'epicrapbattles', 'rap'],
  description: 'Play a random epic rap battle of history',

  reaction: '🎤',
  dir: 'erb',
  ext: 'opus',
  np: true,
<<<<<<< Updated upstream:src/commands/soundCommands/erb.js
  skipIfPlaying: true,
  ownerOnly: true
})
=======
  skipIfPlaying: true
});
>>>>>>> Stashed changes:scripts/soundCommands/erb.js
