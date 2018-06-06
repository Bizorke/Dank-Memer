const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    if (isNaN(msg.args.args[0])) {
      return 'You need to bet a real number'
    }
    const emotes = [':tangerine:', ':watermelon:', ':pear:', ':grapes:', ':cherries:', ':banana:', ':seven:']
    let slotsNums = []
    let random
    let slotString = '**[:slot_machine: l SLOTS ]\n-----------------\n**'
    let bet = Number(msg.args.args[0])
    bet = Math.round(bet)
    let winnings
    let result
    let count
    const { coin } = await Memer.db.getUser(msg.author.id)

    if (bet < 1) {
      return 'you need to bet at least one coin'
    }

    if (bet > Number(coin)) {
      return `I think we both know you only have ${coin}`
    }

    for (count = 0; count < 9; count++) {
      random = Memer.randomInArray(emotes)
      slotsNums.push(random)
      slotString += slotsNums[count] + ' '

      if (count === 2 || count === 5 || count === 8) {
        if (count === 5) { slotString += '**<<<**' }
        slotString += '\n'
      } else {
        slotString += ': '
      }
    }
    slotString += '**-----------------**\n'
    if (slotsNums[3] === slotsNums[4] && slotsNums[3] === slotsNums[5] && slotsNums[4] === slotsNums[5]) {
      slotString += '**| : : : WIN : : : |**'
      winnings = bet * 3
      result = `THREE MATCHES! You've tripled your bet`
      await addCD()
      await Memer.db.addCoins(msg.author.id, winnings)
    } else if (slotsNums[3] === slotsNums[4] || slotsNums[3] === slotsNums[5] || slotsNums[4] === slotsNums[5]) {
      slotString += '**| : : : WIN : : : |**'
      winnings = bet * 2
      result = `Two matches! You've doubled your bet`
      await addCD()
      await Memer.db.addCoins(msg.author.id, winnings)
    } else {
      slotString += '**| : : : LOSS : : : |**'
      winnings = bet * 0
      result = `No matches... You've lost`
      await Memer.db.removeCoins(msg.author.id, bet)
    }

    return `${slotString}\n\n${result} and won ${winnings} coins.`
  },
  {
    triggers: ['slots'],
    cooldown: 3e4,
    donorBlocked: true,
    cooldownMessage: 'You won less than an hour ago, you are going to bankrupt the house. Wait ',
    description: 'Take your chances at the slot machines!'
  }
)
