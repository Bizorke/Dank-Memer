const { GenericVoiceCommand } = require('../../models/')

module.exports = new GenericVoiceCommand({
  triggers: ['sfx'],
  description: 'A FREE soundboard!',

  reaction: '💀',
  existingConn: 'I only have voice, dude. Please wait until the current sound is done, you assbutt',
  dir: 'sfx',
  ext: 'opus',
  soundboard: true
})
