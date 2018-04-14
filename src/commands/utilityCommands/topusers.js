const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    const emojis = [':first_place:', ':second_place:', ':third_place:']

    let pls = await Memer.db.topUsers()
    let you = await Memer.db.getUser(msg.author.id)
    pls = await Promise.all(pls.map(async g => Object.assign(await Memer.ipc.fetchUser(g.id), { pls: g.pls })))
    return {
      title: 'Top 10 users (Commands Ran)',
      description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.pls} - ${u.username}#${u.discriminator}`).join('\n'),
      footer: { text: `You have ran ${you.pls} commands` }
    }
  },
  {
    triggers: ['topusers', 'ulb'],
    description: 'this is in beta, pls no breaking it'
  }
)
