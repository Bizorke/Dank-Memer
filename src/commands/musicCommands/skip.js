const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music }) => {
  await music.stop()

  return 'alright, skipped the current song'
}, {
  triggers: ['skip', 'next'],
  description: 'Skips the current song'
})
