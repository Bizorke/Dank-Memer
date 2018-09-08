const { GenericMusicCommand } = require('../../models')
const { LoadType: { TRACK_LOADED, PLAYLIST_LOADED, SEARCH_RESULT, NO_MATCHES, LOAD_FAILED } } = require('lavalink')
const linkRegEx = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g

module.exports = new GenericMusicCommand(async ({ Memer, music, args, msg }) => {
  if (!msg.member.voiceState.channelID) {
    return msg.reply('join a voice channel fam')
  }

  if (!msg.channel.guild.members.get(Memer.bot.user.id).voiceState.channelID) await music.player.join(msg.member.voiceState.channelID)
  let response
  const queryString = args.join(' ')
  if (linkRegEx.test(queryString)) {
    response = await music.node.load(queryString)
  } else {
    response = await music.node.load(`ytsearch: ${encodeURIComponent(queryString)}`)
  }

  const { loadType, playlistInfo, tracks } = response
  switch (loadType) {
    case TRACK_LOADED:
      await music.addSong(tracks[0])
      return `Queued \`${tracks[0].info.title}\``
    case PLAYLIST_LOADED:
      const promises = []
      for (const song of tracks) promises.push(music.addSong(song))
      await Promise.all(promises)
      return `Queued **${tracks.length}** songs from **${playlistInfo.name}**`
    case SEARCH_RESULT:
      await music.addSong(tracks[0])
      return `Queued \`${tracks[0].info.title}\``
    case NO_MATCHES:
      return 'I\'ve found no match for the input you provided.'
    case LOAD_FAILED:
      return 'I couldn\'t load that song. This may be because the song has been claimed or it\'s private.'
  }
}, {
  triggers: ['play', 'add'],
  description: 'add a song to queue'
})
