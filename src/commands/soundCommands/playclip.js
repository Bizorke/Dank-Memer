<<<<<<< Updated upstream:src/commands/soundCommands/playclip.js
const GenericVoiceCommand = require('../../models/GenericVoiceCommand')
=======
const { GenericSoundboardCommand } = require('../../models/');
>>>>>>> Stashed changes:scripts/soundCommands/playclip.js

module.exports = new GenericVoiceCommand({
  triggers: ['playclip'],
  description: 'Plays a custom sound clip',
  usage: '{command} <clipname>',
<<<<<<< Updated upstream:src/commands/soundCommands/playclip.js
  existingConn: 'Develop the technology to speak two different things simultaneously and then we\'ll talk.',
  ownerOnly: true
})
=======
  existingConn: 'Develop the technology to speak two different things simultaneously and then we\'ll talk.'
});
>>>>>>> Stashed changes:scripts/soundCommands/playclip.js
