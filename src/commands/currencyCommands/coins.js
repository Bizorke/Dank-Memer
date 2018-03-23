const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    if (msg.mentions[0]) {
      let coins = await Memer.db.getCoins(msg.mentions[0].id)
      if (!Number.isInteger(coins.coin)) {
        coins = Memer.db.fixCoins(msg.mentions[0].id)
      }
      await addCD()
      return {
        title: `They have ${coins.coin} coins.`,
        description: `To learn more about Dank Memer's currency, run \`pls guide\`\nTo see possible ways of earning more coins, do \`pls earn\``,
        thumbnail: {url: 'https://dankmemer.lol/coin.png'},
        footer: {text: 'Why are you snooping on their coins?'}
      }
    } else {
      let coins = await Memer.db.getCoins(msg.author.id)
      if (!Number.isInteger(coins.coin)) {
        coins = Memer.db.fixCoins(msg.author.id)
      }
      await addCD()
      return {
        title: `You have ${coins.coin} coins.`,
        description: `To learn more about Dank Memer's currency, run \`pls guide\`\nTo see possible ways of earning more coins, do \`pls earn\``,
        thumbnail: {url: 'https://dankmemer.lol/coin.png'},
        footer: {text: 'Hey stupid, do not spend it all in one place.'}
      }
    }
  },
  {
    triggers: ['coins'],
    description: 'u got dis many coins ok'
  }
)
