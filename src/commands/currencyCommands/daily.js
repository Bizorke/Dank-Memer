const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let { streak } = await Memer.db.getStreak(msg.author.id)

    if (streak && Date.now() - streak.time > 172800000) { // 24 hours, 2 days because one-day cooldown
      await Memer.db.resetStreak(msg.author.id)
      streak = 1
    } else {
      await Memer.db.addStreak(msg.author.id)
      streak = ~~streak.streak + 1
    }

    let coinsEarned = 250 + Math.round(2.5 * streak)
    await Memer.db.addCoins(msg.author.id, coinsEarned)
    let coins = await Memer.db.getCoins(msg.author.id)
    await addCD()

    return {
      title: `Here are your ${coinsEarned} daily coins`,
      description: `(Streak: \`${streak}x\`)\nNow you have ${coins.coin} to spend on gambling :)\nOr if you want more coins, you can always 'pls beg'...`,
      thumbnail: {url: 'https://dankmemer.lol/coin.png'},
      footer: {text: 'spend it all in one place ok'}
    }
  },
  {
    triggers: ['daily'],
    cooldown: 86400000,
    cooldownMessage: 'I\'m not made of money dude, wait {cooldown}',
    description: 'Get your daily injection of meme coins'
  }
)
