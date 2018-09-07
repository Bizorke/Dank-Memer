const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music }) => {
  await music.stop()

  return 'okay i skipped the playing song'
}, {
  triggers: ['skip', 'next'],
  description: 'skips the current song'
})
