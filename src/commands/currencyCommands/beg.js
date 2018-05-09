const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let chances = Math.floor(Math.random() * 40) + 1
    chances = chances + 10

    let coins = await Memer.db.getCoins(msg.author.id)
    const donor = await Memer.db.isDonor(msg.author.id)
    if (donor) {
      chances = Math.round(chances + (chances * 0.5))
    }
    await addCD()
    await Memer.db.addCoins(msg.author.id, chances)
    let voted = await Memer.db.isVoter(msg.author.id)
    if (!voted) {
      msg.channel.createMessage('Looks like you have not voted before!\nIf you go here and vote, you can get 750 coins each day that you do it!\n<https://discordbots.org/bot/memes/vote>')
    }
    return {
      title: `Guys, watch this. ${msg.author.username} is about to beg.`,
      description: `**${msg.author.username}**: pls give me coins, you're the best meme bot ever...\n**Best Meme Bot ever**: Ok fine you little bitch. I grant you ${chances} coins, now you have ${(coins.coin + chances).toLocaleString()}`,
      footer: { text: `Multiplier: ${donor ? '50%' : '0%'}` }
    }
  },
  {
    triggers: ['beg', 'gib'],
    cooldown: 5e5,
    donorCD: 2e5,
    cooldownMessage: 'Stop begging so much, you can have more coins in ',
    description: 'haha ur poor so you have to beg for coins lmaoooo'
  }
)
