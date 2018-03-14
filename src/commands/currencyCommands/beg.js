const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    const chances = Math.floor(Math.random() * 8) + 2

    let coins = await Memer.db.getCoins(msg.author.id)
    await addCD()
    await Memer.db.addCoins(msg.author.id, chances)
    return {
      title: `Guys, watch this. ${msg.author.username} is about to beg.`,
      description: `**${msg.author.username}**: pls give me coins, you're the best meme bot ever...\n**Best Meme Bot ever**: Ok fine you little bitch. I grant you ${chances} coins, now you have ${coins.coin + chances}`
    }
  },
  {
    triggers: ['beg'],
    cooldown: 60000,
    cooldownMessage: 'Stop begging so much, you can have more coins in {cooldown}.',
    description: 'haha ur poor so you have to beg for coins lmaoooo'
  }
)
