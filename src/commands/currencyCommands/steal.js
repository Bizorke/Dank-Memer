const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    if (!msg.mentions[0]) {
      return {description: 'try running the command again, but this time actually tag someone to steal from'}
    }
    let perpCoins = await Memer.db.getCoins(msg.author.id)
    let victimCoins = await Memer.db.getCoins(msg.mentions[0].id)
    let donor = await Memer.db.isDonor(msg.mentions[0].id)
    let shield
    if (perpCoins.coin < 1000) {
      return { title: 'You need at least 1000 to try and rob someone.' }
    }
    if (Memer.config.devs.includes(msg.mentions[0].id) && !Memer.config.devs.includes(msg.author.id)) {
      Memer.db.removeCoins(msg.author.id, 1000)
      return { title: 'Tried stealing from the devs? There goes 1000 of your coins. Nice job.' }
    }
    if (victimCoins.coin < 1000) {
      return { title: 'The victim doesn\'t have at least 1000 coins, not worth it man' }
    }
    if (victimCoins.coin > 20e3) {
      victimCoins.coin = 20e3
    }
    if (donor) {
      if (donor < 5) { // $1-$4 gets 5% shields
        shield = '5%'
        victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.05)
      } else if (donor < 10 && donor > 4) { // $5-$9 gets 25% shields
        shield = '25%'
        victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.25)
      } else if (donor < 15 && donor > 9) { // $10-$14 gets 60% shields
        shield = '60%'
        victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.6)
      } else if (donor < 20 && donor > 14) { // $15-$19 gets 80% shields
        shield = '80%'
        victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.8)
      } else if (donor > 19) { // $20+ gets 95% shields
        shield = '95%'
        victimCoins.coin = victimCoins.coin - (victimCoins.coin * 0.95)
      }
    } else {
      shield = '0%'
    }
    await addCD()
    let stealingOdds = Math.floor(Math.random() * 100) + 1

    if (stealingOdds <= 90) { // fail section
      Memer.db.removeCoins(msg.author.id, 1000)
      Memer.db.addCoins(msg.mentions[0].id, 1000)
      return {
        title: `You got caught! 🚓`,
        description: `You were forced to pay the person you attempted to steal from **1000 coins** as a penalty!`
      }
    } else if (stealingOdds > 90 && stealingOdds <= 97) { // 10% payout
      let worth = Math.round(victimCoins.coin * 0.1)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      return {
        title: `${msg.author.username} got away! 💸`,
        description: `You managed to steal a small amount before leaving!\nYour payout was **${worth.toLocaleString()} coins.`,
        footer: { text: `Victim Shields: ${shield} | Payout: 10%` }
      }
    } else if (stealingOdds > 97 && stealingOdds <= 99) { // 40% payout
      let worth = Math.round(victimCoins.coin * 0.4)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      return {
        title: `${msg.author.username} got away! 💸`,
        description: `You managed to steal a decent amount before leaving!\nYour payout was **${worth.toLocaleString()} coins.`,
        footer: { text: `Victim Shields: ${shield} | Payout: 40%` }
      }
    } else { // full theft up to 10k
      let worth = Math.round(victimCoins.coin)
      Memer.db.addCoins(msg.author.id, worth)
      Memer.db.removeCoins(msg.mentions[0].id, worth)
      return {
        title: `${msg.author.username} got away! 💰`,
        description: `You managed to steal a TON before leaving!\nYour payout was **${worth.toLocaleString()} coins.`,
        footer: { text: `Victim Shields: ${shield} | Payout: MAX` }
      }
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
