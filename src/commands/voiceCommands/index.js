const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '🎵 Music',
  description: 'Here are some basic music commands with pre-loaded playlists. Want custom music? Pay for premium meme bot, or use some other bot idk'
}
