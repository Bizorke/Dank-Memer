const { GenericCommand } = require('../../models/')
let min = 500

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    if (!msg.mentions[0]) {
      return 'try running the command again, but this time actually tag someone to steal from'
    }
    if (msg.author.id === msg.mentions[0].id) {
      return 'hey stupid, seems pretty dumb to steal from urself'
    }
    let perpCoins = await Memer.db.getCoins(msg.author.id)
    let victimCoins = await Memer.db.getCoins(msg.mentions[0].id)
    let donor = await Memer.db.isDonor(msg.mentions[0].id)
    if (perpCoins.coin < min) {
      return `You need at least ${min} coins to try and rob someone.`
    }
    if (victimCoins.coin < min) {
      return `The victim doesn't have at least ${min} coins, not worth it man`
    }
    if (victimCoins.coin > 1e12) {
      victimCoins.coin = 1e12
    }
    if (donor < 5) { // $1-$4 gets 5% shields
      victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.05)
    } else if (donor < 10 && donor > 4) { // $5-$9 gets 25% shields
      victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.25)
    } else if (donor < 15 && donor > 9) { // $10-$14 gets 60% shields
      victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.6)
    } else if (donor < 20 && donor > 14) { // $15-$19 gets 80% shields
      victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.8)
    } else if (donor > 19) { // $20+ gets 95% shields
      victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.95)
    }
    await addCD()
    let stealingOdds = Math.floor(Math.random() * 100) + 1

    if (stealingOdds <= 75) { // fail section
      Memer.db.removeCoins(msg.author.id, min)
      Memer.db.addCoins(msg.mentions[0].id, min)
      Memer.ddog.increment('stealFail')
      return `You were caught! You paid the person you stole from **${min}** coins.`
    } else if (stealingOdds > 75 && stealingOdds <= 95) { // 10% payout
      let worth = Math.round(victimCoins.coin * 0.1)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      Memer.ddog.increment('stealSmall')
      return `You managed to steal a small amount before leaving! 💸\nYour payout was **${worth.toLocaleString()}** coins.`
    } else if (stealingOdds > 95 && stealingOdds <= 98) { // 40% payout
      let worth = Math.round(victimCoins.coin * 0.4)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      Memer.ddog.increment('stealLarge')
      return `You managed to steal a large amount before leaving! 💰\nYour payout was **${worth.toLocaleString()}** coins.`
    } else { // full theft up to 1 trillion
      let worth = Math.round(victimCoins.coin)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      Memer.ddog.increment('stealMAX')
      return `You managed to steal a TON before leaving! 🤑\nYour payout was **${worth.toLocaleString()}** coins.`
    }
  },
  {
    triggers: ['steal', 'rob', 'ripoff'],
    cooldown: 8e5,
    donorCD: 2e5,
    perms: ['embedLinks'],
    description: 'Take your chances at stealing from users. Warning, you will lose money if you get caught!',
    cooldownMessage: 'Woahhh there, you need some time to plan your next hit. Wait ',
    missingArgs: 'You need to tag someone to steal from'
  }
)
