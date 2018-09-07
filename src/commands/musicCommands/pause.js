const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music, msg }) => {
  if (!music.player.playing) {
    return msg.reply('Im not playing music rn dude')
  }

  await music.pause()

  return 'okay i paused the music boi'
}, {
  triggers: ['pause'],
  description: 'pause the current music'
})
