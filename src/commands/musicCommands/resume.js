const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music, msg }) => {
  if (music.player.playing) {
    return msg.reply('music is not paused rn dude')
  }

  await music.pause(false)

  return 'okay i resumed the music boi'
}, {
  triggers: ['resume'],
  description: 'resume the current music'
})
