const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg, addCD}) => {
    await addCD()
    const emojis = [':first_place:', ':second_place:', ':third_place:']

    let pls = await Memer.db.topCoins()
    pls = await Promise.all(pls.map(async g => Object.assign(await Memer.ipc.fetchUser(g.id), { coin: g.coin })))
    return {
      title: 'Top 10 Richest Users',
      description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.coin} - ${u.username}#${u.discriminator}`).join('\n')
    }
  },
  {
    triggers: ['rich', 'richest', 'toponepercent'],
    description: 'see who the top 10 richest users are!'
  }
)
