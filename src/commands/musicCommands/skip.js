const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ Memer, music, msg }) => {
  const maxVotes = 3
  const isDJ = msg.member.roles && msg.channel.guild.roles ? msg.member.roles.some(id => msg.channel.guild.roles.get(id).name.toLowerCase() === 'dj') : false
  const stored = await Memer.redis.getAsync(`music-skipvotes-${msg.channel.guild.id}`)
    .then(res => res ? JSON.parse(res) : undefined)

  if (isDJ || music.channel.voiceMembers.length <= 2) { // check if less than or equal to 2, including currrent user and bot
    await music.stop()
  } else {
    Memer.redis.setAsync(`music-skipvotes-${msg.channel.guild.id}`, JSON.stringify({ song: music.queue[0].info.title, votes: stored.votes + 1 }))
    return `this is so sad we only need ${maxVotes - (stored.votes + 1)}`
  }

  return 'alright, skipped the current song'
}, {
  triggers: ['skip', 'next'],
  description: 'Skips the current song'
})
