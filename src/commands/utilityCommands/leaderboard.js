const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    let pls = await Memer.db.topPls()
    let [a, b, c, d, e] = pls
    let numOne = await Memer.bot.guilds.get(a.id)
    let numTwo = await Memer.bot.guilds.get(b.id)
    let numThree = await Memer.bot.guilds.get(c.id)
    let numFour = await Memer.bot.guilds.get(d.id)
    let numFive = await Memer.bot.guilds.get(e.id)
    // console.log(numOne.name)
    // let top = pls.map(oof => `${Memer.ipc.fetchGuild(oof.id).name}: ${oof.pls} commands ran.`)
    return {
      title: 'Top 5 servers (Commands Ran)',
      description: `🥇 ${a.pls} - ${numOne.name}\n🥈 ${b.pls} - ${numTwo.name}\n🥉 ${c.pls} - ${numThree.name}\n👏 ${d.pls} - ${numFour.name}\n👏 ${e.pls} - ${numFive.name}`
    }
  },
  {
    triggers: ['leaderboard', 'lb'],
    description: 'this is in beta, pls no breaking it'
  }
)
