const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['fart', 'toot'],
  description: 'ew!',

  existingConn: 'I only have one butthole, dude. Please wait until the current sound is done or the ear-poo ghost will visit you in your sleep!',
  dir: 'farts',
  ext: 'opus',
  message: 'I recorded this myself. Enjoy. 🌬'
});
