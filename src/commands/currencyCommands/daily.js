const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    await Memer.db.addCoins(msg.author.id, 250)
    let coins = await Memer.db.getCoins(msg.author.id)
    await addCD()
    return {
      title: 'Here are your 250 daily coins',
      description: `Now you have ${coins.coin} to spend on gambling :)\nOr if you want more coins, you can always 'pls beg'...`,
      thumbnail: {url: 'https://dankmemer.lol/coin.png'},
      footer: {text: 'spend it all in one place ok'}
    }
  },
  {
    triggers: ['daily'],
    cooldown: 86400000,
    cooldownMessage: 'I\'m not made of money dude, wait {cooldown}',
    description: 'Get your daily injection of meme coins'
  }
)
