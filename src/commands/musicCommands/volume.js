const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music, args, msg }) => {
  if (!music.player.playing) {
    return msg.reply('Im not playing music rn dude')
  }

  const volume = args[0]

  if (Number.isNaN(volume) || volume <= 0 || volume > 100) {
    return 'volume must be a number between 1 and 100'
  }

  await music.volume(Number(args))

  return `changed volume to ${volume}`
}, {
  triggers: ['volume'],
  description: 'changes the volume of the music'
})
