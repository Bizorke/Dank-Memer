const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    let pls = await Memer.db.topUsers()
    let you = await Memer.db.fetchUser(msg.author.id)
    let [a, b, c, d, e] = pls
    let numOne = await Memer.ipc.fetchUser(a.id)
    let numTwo = await Memer.ipc.fetchUser(b.id)
    let numThree = await Memer.ipc.fetchUser(c.id)
    let numFour = await Memer.ipc.fetchUser(d.id)
    let numFive = await Memer.ipc.fetchUser(e.id)
    return {
      title: 'Top 5 users (Commands Ran)',
      description: `🥇 ${a.pls} - ${numOne.username + '#' + numOne.discriminator}\n🥈 ${b.pls} - ${numTwo.username + '#' + numTwo.discriminator}\n🥉 ${c.pls} - ${numThree.username + '#' + numThree.discriminator}\n👏 ${d.pls} - ${numFour.username + '#' + numFour.discriminator}\n👏 ${e.pls} - ${numFive.username + '#' + numFive.discriminator}`,
      footer: { text: `You have ran ${you.pls} commands` }
    }
  },
  {
    triggers: ['topusers', 'ulb'],
    description: 'this is in beta, pls no breaking it'
  }
)
