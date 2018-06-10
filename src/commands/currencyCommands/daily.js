const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let { streak } = await Memer.db.getStreak(msg.author.id)

    if (streak && Date.now() - streak.time > 172800000) { // 24 hours, 2 days because one-day cooldown
      await Memer.db.resetStreak(msg.author.id)
      streak = 1
    } else {
      await Memer.db.addStreak(msg.author.id)
      if (streak) {
        streak = streak.streak + 1
      } else {
        streak = 1
      }
    }

    let coinsEarned = 12000
    if (streak > 1) {
      coinsEarned = coinsEarned + Math.round((0.02 * coinsEarned) * streak)
    }
    const donor = await Memer.db.checkDonor(msg.author.id)
    if (donor) {
      coinsEarned = Math.round(coinsEarned + (coinsEarned * 0.35))
    }
    await Memer.db.addCoins(msg.author.id, coinsEarned)
    await addCD()

    return {
      title: `Here are your ${coinsEarned.toLocaleString()} daily coins`,
      description: `If you would like to learn more about different ways to spend and earn coins, run \`pls guide\` and read up on all we have to offer!`,
      thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
      footer: {text: `Streak: ${streak} (+${2.5 * streak}) | Multiplier ${donor ? '35%' : '0%'}`}
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
