const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music, msg }) => {
  if (!music.player.playing) {
    return msg.reply('what are you thinking i\'m not playing any music lmao')
  }

  await music.pause()

  return 'okay i paused the music boi'
}, {
  triggers: ['pause'],
  description: 'pause the current music'
})
