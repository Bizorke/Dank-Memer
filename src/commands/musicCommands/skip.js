const { GenericMusicCommand } = require('../../models')

module.exports = new GenericMusicCommand(async ({ Memer, music, msg }) => {
  const userCount = music.voiceChannel.voiceMembers.filter(u => !u.bot).length
  const requiredVotes = userCount === 2 ? 2 : (userCount % 2 === 0 ? userCount / 2 + 1 : Math.ceil(userCount / 2))
  const isDJ = msg.member.roles && msg.channel.guild.roles ? msg.member.roles.some(id => msg.channel.guild.roles.get(id).name.toLowerCase() === 'dj') : false
  if (isDJ || music.voiceChannel.voiceMembers.size <= 2) { // check if less than or equal to 2, including current user and bot
    await music.stop()
    if (music.vote) {
      music.resetVote()
    }
  } else {
    if (!music.vote) {
      music.startVote(msg.author.id)
      return `this is so sad we only need ${requiredVotes - music.vote.voted.length} more`
    } else {
      if (music.vote.voted.includes(msg.author.id)) {
        return 'you already voted dummy'
      }
      if (music.vote.voted.length + 1 >= requiredVotes) {
        music.resetVote()
        await music.stop()
      } else {
        music.vote.voted.push(msg.author.id)
        return `this is so sad we only need ${requiredVotes - music.vote.voted.length} more`
      }
    }
  }
  return 'alright, skipped the current song'
}, {
  triggers: ['skip', 'next'],
  description: 'Skips the current song'
})
