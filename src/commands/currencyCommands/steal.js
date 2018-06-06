const { GenericCommand } = require('../../models/')
let min = 500

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let user = msg.args.resolveUser(true)
    if (!user) {
      return 'try running the command again, but this time actually mention someone to steal from'
    }
    if (msg.author.id === user.id) {
      return 'hey stupid, seems pretty dumb to steal from urself'
    }
    let perpCoins = await Memer.db.getCoins(msg.author.id)
    let victimCoins = await Memer.db.getCoins(user.id)
    let donor = await Memer.db.isDonor(user.id)
    if (perpCoins.coin < min) {
      return `You need at least ${min} coins to try and rob someone.`
    }
    if (victimCoins.coin < min) {
      return `The victim doesn't have at least ${min} coins, not worth it man`
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

    if (stealingOdds <= 50) { // fail section
      let punish
      if ((perpCoins.coin * 0.05) < 500) {
        punish = 500
      } else {
        punish = perpCoins.coin * 0.05
      }
      Memer.db.removeCoins(msg.author.id, Math.round(punish))
      Memer.db.addCoins(user.id, Math.round(punish))
      Memer.ddog.increment('stealFail')
      return `You were caught! You paid the person you stole from **${Math.round(punish)}** coins.`
    } else if (stealingOdds > 50 && stealingOdds <= 80) { // 30% payout
      let worth = Math.round(victimCoins.coin * 0.3)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(user.id, worth)
      Memer.ddog.increment('stealSmall')
      if (!user.bot) {
        const channel = await Memer.bot.getDMChannel(user.id)
        await channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}** has stolen **${worth.toLocaleString()}** coins from you!`)
      }
      return `You managed to steal a small amount before leaving! 💸\nYour payout was **${worth.toLocaleString()}** coins.`
    } else if (stealingOdds > 80 && stealingOdds <= 90) { // 50% payout
      let worth = Math.round(victimCoins.coin * 0.5)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(user.id, worth)
      Memer.ddog.increment('stealLarge')
      if (!user.bot) {
        const channel = await Memer.bot.getDMChannel(user.id)
        await channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}** has stolen **${worth.toLocaleString()}** coins from you!`)
      }
      return `You managed to steal a large amount before leaving! 💰\nYour payout was **${worth.toLocaleString()}** coins.`
    } else { // full theft up to 1 trillion
      let worth = Math.round(victimCoins.coin)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(user.id, worth)
      Memer.ddog.increment('stealMAX')
      if (!user.bot) {
        const channel = await Memer.bot.getDMChannel(user.id)
        await channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}** has stolen **${worth.toLocaleString()}** coins from you!`)
      }
      return `You managed to steal a TON before leaving! 🤑\nYour payout was **${worth.toLocaleString()}** coins.`
    }
  },
  {
    triggers: ['steal', 'rob', 'ripoff'],
    cooldown: 2e5,
    donorCD: 1e5,
    perms: ['embedLinks'],
    description: 'Take your chances at stealing from users. Warning, you will lose money if you get caught!',
    cooldownMessage: 'Woahhh there, you need some time to plan your next hit. Wait ',
    missingArgs: 'You need to tag someone to steal from'
  }
)
