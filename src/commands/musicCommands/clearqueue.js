const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ music }) => {
  music.clear()

  return 'The queue was successfully cleared'
}, {
  triggers: ['clearqueue', 'clearq'],
  description: 'Removes all items from the queue besides the current playing song'
})
