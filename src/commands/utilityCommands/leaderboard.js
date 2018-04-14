const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    const emojis = [':first_place:', ':second_place:', ':third_place:']

    let pls = await Memer.db.topPls()
    let you = await Memer.db.getPls(msg.channel.guild.id)
    pls = await Promise.all(pls.map(async g => Object.assign(await Memer.ipc.fetchGuild(g.id), { pls: g.pls })))
    return {
      title: 'Top 10 servers (Commands Ran)',
      description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.coin} - ${u.username}#${u.discriminator}`).join('\n'),
      footer: { text: `Your server has ran ${you.pls} commands` }
    }
  },
  {
    triggers: ['leaderboard', 'lb'],
    description: 'this is in beta, pls no breaking it'
  }
)
