const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    let pls = await Memer.db.topPls()
    let [a, b, c] = pls
    let numOne = await Memer.ipc.fetchGuild(a.id)
    let numTwo = await Memer.ipc.fetchGuild(b.id)
    let numThree = await Memer.ipc.fetchGuild(c.id)
    // console.log(numOne.name)
    // let top = pls.map(oof => `${Memer.ipc.fetchGuild(oof.id).name}: ${oof.pls} commands ran.`)
    return {
      title: 'Top 3 servers (Commands Ran)',
      description: `${a.pls} - ${numOne.name}\n${b.pls} - ${numTwo.name}\n${c.pls} - ${numThree.name}`
    }
  },
  {
    triggers: ['leaderboard', 'lb'],
    description: 'this is in beta, pls no breaking it'
  }
)
