const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let coins = await Memer.db.getCoins(msg.author.id)
    if (!Number.isInteger(coins.coin)) {
      coins = Memer.db.fixCoins(msg.author.id)
    }
    return {
      title: `You have ${coins.coin} coins.`,
      description: `You can spend any coins on gambling.\nOr you can beg me for more coins... 😏`,
      thumbnail: {url: 'https://dankmemer.lol/coin.png'},
      footer: {text: 'Hey stupid, do not spend it all in one place.'}
    }
  },
  {
    triggers: ['coins'],
    description: 'u got dis many coins ok'
  }
)
