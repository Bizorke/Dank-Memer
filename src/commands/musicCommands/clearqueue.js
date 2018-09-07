const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music }) => {
  music.clear()

  return 'okay i clearled the queue, only the playing song is left'
}, {
  triggers: ['clearqueue', 'clearq'],
  description: 'clears the complete queue beside the playing track'
})
