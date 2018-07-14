const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let { streak } = await Memer.db.getUser(msg.author.id)

    if (streak && Date.now() - streak.time > 172800000) { // 24 hours, 2 days because one-day cooldown
      await Memer.db.resetStreak(msg.author.id)
      streak = 1
    } else {
      await Memer.db.addStreak(msg.author.id)
      if (streak) {
        streak = streak.streak + 1
      } else {
        streak = 0
      }
    }

    let coinsEarned = 25
    if (streak > 1) {
      coinsEarned = coinsEarned + Math.round((0.02 * coinsEarned) * streak)
    }
    await Memer.db.addPocket(msg.author.id, coinsEarned)
    await addCD()

    return {
      title: `Here are your daily coins, ${msg.author.username}`,
      description: `**${coinsEarned} coins** were placed in your pocket.\n\nYou can get another 25 coins by voting! ([Click Here](https://discordbots.org/bot/memes/vote))`,
      thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
      footer: {text: `Streak: ${streak} days (+${Math.round((0.02 * coinsEarned) * streak)} coins)`}
    }
  },
  {
    triggers: ['daily', '24hr'],
    cooldown: 864e5,
    donorBlocked: true,
    cooldownMessage: 'I\'m not made of money dude, wait ',
    description: 'Get your daily injection of meme coins'
  }
)
