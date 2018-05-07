const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, args, msg}) => {
    const emojis = [':first_place:', ':second_place:', ':third_place:']
    /*
    if (args && args[0] === '-all') {
      let stats = await Memer.db.getStats()
      if (stats.clusters[stats.clusters.length - 1].uptime === 0) {
        return 'bot is still loading, hold ur horses damn'
      }
      const bigmeme = (id) => new Promise(resolve => {
        setTimeout(() => resolve({ id }), 1000)
        Memer.ipc.fetchUser(id)
          .then(resolve) // this is intentional and also stupid but still intentional
      })
      let pls = await Memer.db.topUsers()
      pls = await Promise.all(pls.map(async g => Object.assign(await bigmeme(g.id), { pls: g.pls })))
      return {
        title: 'Top 15 Users',
        description: pls.map((g, i) => `${emojis[i] || '👏'} ${g.pls.toLocaleString()} - ${g.username || ('LOL WHO DIS')}`).join('\n'),
        footer: { text: `Global Leaderboard` }
      }
    } else { */
    let stats = await Memer.db.getStats()
    if (stats.clusters[stats.clusters.length - 1].uptime === 0) {
      return 'bot is still loading, hold ur horses damn'
    }
    let pls = []
    let members = msg.channel.guild.members
    for (const ok of members) {
      let ding = await Memer.db.getUser(ok[0])
      pls.push(ding)
    }
    pls = pls.filter(u => u.pls > 0)
    pls = pls.sort((a, b) => b.pls - a.pls).slice(0, 5)
    pls = await Promise.all(pls.map(async g => Object.assign(await Memer.ipc.fetchUser(g.id), { pls: g.pls })))
    return {
      title: `who uses the bot the most`,
      description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.pls} - ${u.username}#${u.discriminator}`).join('\n'),
      footer: { text: `${msg.channel.guild.name}` }
    }
    // }
  },
  {
    triggers: ['topusers', 'ulb'],
    description: 'See who in your server (or globally) uses dank memer the most!'
  }
)
