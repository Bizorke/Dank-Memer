const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music, args, msg }) => {
  if (!music.player.playing) {
    return msg.reply('what are you thinking i\'m not playing any music lmao')
  }

  const volume = args[0]

  if (Number.isNaN(volume) || volume <= 0 || volume > 100) {
    return 'Volume must be a number between 1 and 100'
  }

  await music.volume(Number(args))

  return `Volume changed to **${volume}**`
}, {
  triggers: ['volume'],
  description: 'changes the volume of the music'
})
