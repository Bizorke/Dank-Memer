const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg, addCD}) => {
    await addCD()
    let pls = await Memer.db.topCoins()

    let [a, b, c, d, e, f, g, h, i, j] = pls
    let numOne = await Memer.bot.users.get(a.id)
    let numTwo = await Memer.bot.users.get(b.id)
    let numThree = await Memer.bot.users.get(c.id)
    let numFour = await Memer.bot.users.get(d.id)
    let numFive = await Memer.bot.users.get(e.id)
    let numSix = await Memer.bot.users.get(f.id)
    let numSeven = await Memer.bot.users.get(g.id)
    let numEight = await Memer.bot.users.get(h.id)
    let numNine = await Memer.bot.users.get(i.id)
    let numTen = await Memer.bot.users.get(j.id)

    return {
      title: 'Top 10 Richest Users',
      description: `🥇 ${a.coin} - ${numOne.username + '#' + numOne.discriminator}\n🥈 ${b.coin} - ${numTwo.username + '#' + numTwo.discriminator}\n🥉 ${c.coin} - ${numThree.username + '#' + numThree.discriminator}\n👏 ${d.coin} - ${numFour.username + '#' + numFour.discriminator}\n👏 ${e.coin} - ${numFive.username + '#' + numFive.discriminator}\n👏 ${f.coin} - ${numSix.username + '#' + numSix.discriminator}\n👏 ${g.coin} - ${numSeven.username + '#' + numSeven.discriminator}\n👏 ${h.coin} - ${numEight.username + '#' + numEight.discriminator}\n👏 ${i.coin} - ${numNine.username + '#' + numNine.discriminator}\n👏 ${j.coin} - ${numTen.username + '#' + numTen.discriminator}`
    }
  },
  {
    triggers: ['rich', 'richest'],
    description: 'see who the top 10 richest users are!'
  }
)
