const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    await addCD()
    return {
      title: `How to earn more coins:`,
      description: '<:memeCoin:426617772378685440> `250` pls daily\n<:memeCoin:426617772378685440> `750` [Vote for the bot](https://discordbots.org/bot/memes/vote) each day\n<:memeCoin:426617772378685440> `10-50` pls beg\n<:memeCoin:426617772378685440> `0-1` pls flip\n<:memeCoin:426617772378685440> `0-3` pls search\n<:memeCoin:426617772378685440> `a lot` pls grantapply\n<:memeCoin:426617772378685440> `1k per $1` pls redeem ([donors only](https://www.patreon.com/dankmemerbot))\n\nYou can also get a multiplier for donating on any command that gives coins, and daily uses of the daily command get you a streak with bonus points!',
      footer: {text: 'Run pls guide to learn more about our currency'}
    }
  },
  {
    triggers: ['earn', 'howtogetmorecoins'],
    description: 'learn how to earn coins',
    perms: ['embedLinks']
  }
)
