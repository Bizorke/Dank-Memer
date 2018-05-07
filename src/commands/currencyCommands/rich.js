const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg, args, addCD}) => {
    await addCD()
    const emojis = [':first_place:', ':second_place:', ':third_place:']
    let stats = await Memer.db.getStats()
    if (stats.clusters[stats.clusters.length - 1].uptime === 0) {
      return 'bot is still loading, hold ur horses damn'
    }
    /* if (args && args[0] === '-all') {
      let pls = await Memer.db.topCoins()
      console.log('hi')
      pls = await Promise.all(pls.map(async g => Object.assign(await Memer.ipc.fetchUser(g.id), { coin: g.coin })))
      console.log('hi')
      return {
        title: 'Top 15 Global Richest Users',
        description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.coin.toLocaleString()} - ${u.username}#${u.discriminator}`).join('\n'),
        footer: { text: `Global Leaderboard` }
      }
    } else { */
    let pls = []
    let members = msg.channel.guild.members
    for (const ok of members) {
      let ding = await Memer.db.getUser(ok[0])
      pls.push(ding)
    }
    pls = pls.filter(u => u.coin > 0)
    pls = pls.sort((a, b) => b.coin - a.coin).slice(0, 5)
    pls = await Promise.all(pls.map(async g => Object.assign(await Memer.ipc.fetchUser(g.id), { coin: g.coin })))
    return {
      title: `richest users in this server`,
      description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.coin.toLocaleString()} - ${u.username}#${u.discriminator}`).join('\n'),
      footer: { text: `${msg.channel.guild.name} | global leaderboards coming soon` }
    }
    // }
  },
  {
    triggers: ['rich', 'richest', 'toponepercent'],
    description: 'see who the top 10 richest users are in your server, or globally!'
  }
)
