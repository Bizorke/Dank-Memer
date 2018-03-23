const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    await addCD()
    return {
      title: `How to earn more coins:`,
      description: '<:memeCoin:426617772378685440> `250` pls daily\n<:memeCoin:426617772378685440> `500` [Vote for the bot](https://discordbots.org/bot/memes/vote) each day\n<:memeCoin:426617772378685440> `10-50` pls beg\n<:memeCoin:426617772378685440> `0-1` pls flip\n<:memeCoin:426617772378685440> `0-3` pls search\n<:memeCoin:426617772378685440> `a lot` pls grantapply',
      footer: {text: 'Run pls guide to learn more about coins'}
    }
  },
  {
    triggers: ['earn'],
    description: 'learn how to earn coins'
  }
)
