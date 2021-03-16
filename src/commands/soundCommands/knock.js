const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['knock'],
  description: 'Troll your friends with the classic twitch knock prank!',

  existingConn: 'I can only knock so much my dude, wait until I\'m done with whatever sound is playing before trying',
  reaction: '👍',
  dir: 'knock',
  ext: 'opus',
  files: 'knock',
  ownerOnly: true
});
