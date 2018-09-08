const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music, msg }) => {
  if (music.player.playing) {
    return msg.reply('music is not paused rn smh')
  }

  await music.pause(false)

  return 'there you go, music resumed'
}, {
  triggers: ['resume'],
  description: 'Resume any paused song'
})
