const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    let pls = await Memer.db.topCoins()
    let [a, b, c, d, e] = pls
    let numOne = await Memer.ipc.fetchUser(a.id)
    let numTwo = await Memer.ipc.fetchUser(b.id)
    let numThree = await Memer.ipc.fetchUser(c.id)
    let numFour = await Memer.ipc.fetchUser(d.id)
    let numFive = await Memer.ipc.fetchUser(e.id)
    // console.log(numOne.name)
    // let top = pls.map(oof => `${Memer.ipc.fetchGuild(oof.id).name}: ${oof.pls} commands ran.`)
    return {
      title: 'Top 5 Richest Users',
      description: `🥇 ${a.coin} - ${numOne.username + '#' + numOne.discriminator}\n🥈 ${b.coin} - ${numTwo.username + '#' + numTwo.discriminator}\n🥉 ${c.coin} - ${numThree.username + '#' + numThree.discriminator}\n👏 ${d.coin} - ${numFour.username + '#' + numFour.discriminator}\n👏 ${e.coin} - ${numFive.username + '#' + numFive.discriminator}`
    }
  },
  {
    triggers: ['rich', 'richest'],
    description: 'this is in beta, pls no breaking it'
  }
)
