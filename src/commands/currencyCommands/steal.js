const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    if (!msg.mentions[0]) {
      return {description: 'try running the command again, but this time actually tag someone to steal from'}
    }
    let perpCoins = await Memer.db.getCoins(msg.author.id)
    let victimCoins = await Memer.db.getCoins(msg.mentions[0].id)
    if (perpCoins.coin < 100) {
      return { title: 'You need at least 100 to try and rob someone.' }
    }
    if (Memer.config.devs.includes(msg.mentions[0].id) && !Memer.config.devs.includes(msg.author.id)) {
      Memer.db.removeCoins(msg.author.id, 100)
      return { title: 'Tried stealing from the devs? There goes 100 of your coins. Nice job.' }
    }
    if (victimCoins.coin < 100) {
      return { title: 'The victim doesn\'t have at least 100 coins, not worth it man' }
    }
    if (victimCoins.coin > 10e3) {
      victimCoins.coin = 10e3
    }
    await addCD()
    let stealingOdds = Math.floor(Math.random() * 100) + 1

    if (stealingOdds <= 90) { // fail section
      Memer.db.removeCoins(msg.author.id, 100)
      return 'You got caught and lost 100 coins!'
    } else if (stealingOdds < 90 && stealingOdds <= 97) { // 5% payout
      let worth = Math.round(victimCoins.coin * 0.05)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      return `You managed to steal a small amount before leaving!\nYour payout was **${worth} coins.**`
    } else if (stealingOdds < 97 && stealingOdds <= 99) { // 30% payout
      let worth = Math.round(victimCoins.coin * 0.3)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      return `You managed to steal a sizeable amount before leaving!\nYour payout was **${worth} coins.**`
    } else { // full theft up to 10k
      let worth = Math.round(victimCoins.coin)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      return `You managed to steal a sizeable amount before leaving!\nYour payout was **${worth} coins.**`
    }
  },
  {
    triggers: ['steal', 'rob', 'ripoff'],
    cooldown: 8e5,
    donorCD: 4e5,
    perms: ['embedLinks'],
    description: 'Take your chances at stealing from users. Warning, you will lose money if you get caught! The victim can lose no more than 10k coins.',
    cooldownMessage: 'Woahhh there, you need some time to plan your next hit. Wait ',
    missingArgs: 'You need to tag someone to steal from'
  }
)
