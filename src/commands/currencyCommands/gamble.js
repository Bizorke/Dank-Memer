const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let coins = await Memer.db.getCoins(msg.author.id)

    let bet = args[0]
    if (!bet) {
      return { title: 'You need to bet something.' }
    }
    if (bet < 1) {
      return { title: 'You can\'t bet less than 1 coin you dumbass.' }
    }
    if (isNaN(bet)) {
      if (bet === 'all') {
        bet = coins.coin
      } else if (bet === 'half') {
        bet = Math.round(coins.coin / 2)
      } else {
        return { title: 'You have to bet actual coins, dont try to break me.' }
      }
    }
    if (!Number.isInteger(Number(bet))) {
      return { title: 'AHA! You cannot break me anymore! Must be a whole number, dumb butt.' }
    }
    if (coins.coin === 0) {
      return { title: 'You have no coins.' }
    }
    if (bet > coins.coin) {
      return { title: `You only have ${coins.coin.toLocaleString()} coins, dont bluff me.` }
    }

    await addCD()
    let blahblah = Math.random()

    if (blahblah >= 0.95) {
      let winAmount = Math.random() + 1
      let random = Math.round(Math.random())
      winAmount = winAmount + random
      let winnings = Math.round(bet * winAmount)
      const donor = await Memer.db.isDonor(msg.author.id)
      if (donor) {
        winnings = Math.round(winnings + (winnings * 0.35))
      }
      if (winnings === bet) {
        return 'You broke even. This means you\'re lucky I think?'
      }

      await Memer.db.addCoins(msg.author.id, winnings)
      Memer.ddog.incrementBy('gambling.winnings', Number(winnings))
      return {
        title: `Damn it, you won ${winnings.toLocaleString()} coins.`,
        description: `Now you've got ${(coins.coin + parseInt(winnings)).toLocaleString()}.`,
        footer: {text: `Multiplier ${donor ? '35%' : '0%'} | Percent of bet won: ${winAmount.toFixed(2) * 100}%`}
      }
    } else if (blahblah >= 0.65) {
      let winAmount = Math.random() + 0.4
      let winnings = Math.round(bet * winAmount)
      const donor = await Memer.db.isDonor(msg.author.id)
      if (donor) {
        winnings = Math.round(winnings + (winnings * 0.35))
      }
      if (winnings === bet) {
        return 'You broke even. This means you\'re lucky I think?'
      }

      await Memer.db.addCoins(msg.author.id, winnings)
      Memer.ddog.incrementBy('gambling.winnings', Number(winnings))
      return {
        title: `Damn it, you won ${winnings.toLocaleString()} coins.`,
        description: `Now you've got ${(coins.coin + parseInt(winnings)).toLocaleString()}.`,
        footer: {text: `Multiplier ${donor ? '35%' : '0%'} | Percent of bet won: ${winAmount.toFixed(2) * 100}%`}
      }
    } else {
      await Memer.db.removeCoins(msg.author.id, bet)
      Memer.ddog.incrementBy('gambling.losings', Number(bet))
      return {
        title: `Lmfao you lost ${Number(bet).toLocaleString()} coins.`,
        description: `Now you've got ${((coins.coin - bet) < 0 ? 0 : coins.coin - bet).toLocaleString()}.`,
        footer: {text: 'You are really bad at this. I suggest not doing this anymore.'}
      }
    }
  },
  {
    triggers: ['gamble', 'bet'],
    cooldown: 5e3,
    donorCD: 2e3,
    description: 'Take your chances at gambling. Warning, I am very good at stealing your money.',
    cooldownMessage: 'If I let you bet whenever you wanted, you\'d be a lot more poor. Wait ',
    missingArgs: 'You gotta gamble some of ur coins bro, `pls gamble #/all/half` for example, dummy'
  }
)
