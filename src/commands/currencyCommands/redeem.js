const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    const multiplier = await Memer.db.isDonor(msg.author.id)
    const winnings = Number(multiplier) * 1000
    await addCD()
    Memer.db.addCoins(msg.author.id, winnings)
    return {
      title: `${msg.author.username} has redeemed their monthly donor rewards!`,
      description: `You donated $${multiplier}, so you get ${winnings} coins!\nThank you for your support!`
    }
  },
  {
    triggers: ['redeem'],
    cooldown: 2592e6,
    donorOnly: true,
    cooldownMessage: 'You have to wait ',
    description: 'haha ur poor so you have to search for coins in a dumpster hahaha'
  }
)
