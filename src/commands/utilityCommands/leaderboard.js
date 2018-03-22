const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    let pls = await Memer.db.topPls()
    let you = await Memer.db.getPls(msg.channel.guild.id)
    let [a, b, c, d, e] = pls
    let numOne = await Memer.ipc.fetchGuild(a.id)
    let numTwo = await Memer.ipc.fetchGuild(b.id)
    let numThree = await Memer.ipc.fetchGuild(c.id)
    let numFour = await Memer.ipc.fetchGuild(d.id)
    let numFive = await Memer.ipc.fetchGuild(e.id)
    return {
      title: 'Top 5 servers (Commands Ran)',
      description: `🥇 ${a.pls} - ${numOne.name}\n🥈 ${b.pls} - ${numTwo.name}\n🥉 ${c.pls} - ${numThree.name}\n👏 ${d.pls} - ${numFour.name}\n👏 ${e.pls} - ${numFive.name}`,
      footer: { text: `Your server has ran ${you.pls} commands` }
    }
  },
  {
    triggers: ['leaderboard', 'lb'],
    description: 'this is in beta, pls no breaking it'
  }
)
