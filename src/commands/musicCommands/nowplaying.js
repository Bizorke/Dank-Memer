const { GenericMusicCommand } = require('../../models')
const { format } = require('../../utils/misc')

module.exports = new GenericMusicCommand(async ({ music, msg }) => {
  if (!music.player.playing) {
    return msg.reply('Im not playing music rn dude')
  }

  const { nowPlaying } = music

  return {
    description: `[${nowPlaying.info.title}](${nowPlaying.info.uri})`,
    fields: [
      { name: 'Author', value: nowPlaying.info.author, inline: true },
      { name: 'Livestream?', value: nowPlaying.info.isStream ? 'Yes' : 'No', inline: true },
      { name: 'Length', value: nowPlaying.info.isStream ? '∞ (Livestream)' : format(nowPlaying.info.length / 1000), inline: true }
    ]
  }
}, {
  triggers: ['nowplaying', 'np'],
  description: 'shows information about the current playing track'
})
