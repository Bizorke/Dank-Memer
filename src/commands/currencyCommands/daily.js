const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
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
      // streak = streak.streak ? streak.streak + 1 : 1
    }

    let coinsEarned = 250
    if (streak > 1) {
      coinsEarned = 250 + Math.round(2.5 * streak)
    }
    const donor = await Memer.db.isDonor(msg.author.id)
    if (donor) {
      coinsEarned = Math.round(coinsEarned + (coinsEarned * 0.5))
    }
    await Memer.db.addCoins(msg.author.id, coinsEarned)
    let coins = await Memer.db.getCoins(msg.author.id)
    await addCD()

    return {
      title: `Here are your ${coinsEarned} daily coins`,
      description: `If you would like to learn more about different ways to spend and earn coins, run \`pls guide\` and read up on all we have to offer!`,
      thumbnail: {url: 'https://dankmemer.lol/coin.png'},
      footer: {text: `Total Coins: ${coins.coin} | Streak: ${streak} | Multiplier ${donor ? '50%' : '0%'}`}
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
