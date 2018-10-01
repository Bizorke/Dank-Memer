const { GenericMusicCommand } = require('../../models');
const { format } = require('../../utils/misc');

module.exports = new GenericMusicCommand(async ({ music, msg }) => {
  if (!music.player.playing) {
    return msg.reply('what are you thinking i\'m not playing any music lmao');
  }

  const { nowPlaying } = music;

  return {
    description: `[${nowPlaying.info.title}](${nowPlaying.info.uri})`,
    fields: [
      { name: 'Author', value: nowPlaying.info.author, inline: true },
      { name: 'Livestream?', value: nowPlaying.info.isStream ? 'Yes' : 'No', inline: true },
      { name: 'Length', value: nowPlaying.info.isStream ? '∞ (Livestream)' : format(nowPlaying.info.length / 1000), inline: true }
    ]
  };
}, {
  triggers: ['nowplaying', 'np'],
  requiresPremium: true,
  description: 'Shows information about the current playing track'
});
