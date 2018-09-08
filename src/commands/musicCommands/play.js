const { GenericMusicCommand } = require('../../models')
const { LoadType: { TRACK_LOADED, PLAYLIST_LOADED, SEARCH_RESULT, NO_MATCHES, LOAD_FAILED } } = require('lavalink')
const linkRegEx = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g

module.exports = new GenericMusicCommand(async ({ Memer, music, args, msg }) => {
  if (!msg.member.voiceState.channelID) {
    return msg.reply('join a voice channel fam')
  }

  if (!music.voiceState) {
    await music.player.join(msg.member.voiceState.channelID)
  }
  let response
  const queryString = msg.args.gather()
  if (!queryString && music.queue[0]) {
    await music._play()
    return `Loaded \`${music.queue[0].info.title}\` from last session`
  } else if (!queryString) {
    return 'look mate this isn\'t rocket science, enter a search query or link to play'
  }
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
      return `Queued **${tracks.length}** songs from **${playlistInfo.name}**, happy now? jeez`
    case SEARCH_RESULT:
      await music.addSong(tracks[0])
      return `Queued \`${tracks[0].info.title}\``
    case NO_MATCHES:
      return 'Unable to find any videos by that query, what are the odds. Pretty high if you are dumb I guess'
    case LOAD_FAILED:
      return 'I couldn\'t load that song. This may be because the song has been claimed or it\'s private. How unlucky'
  }
}, {
  triggers: ['play', 'add'],
  description: 'add a song to queue'
})
