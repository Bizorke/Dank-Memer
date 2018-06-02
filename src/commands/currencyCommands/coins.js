const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let user = msg.args.resolveUser(true)
    if (user) {
      let coins = await Memer.db.getCoins(user.id)
      await addCD()
      return {
        title: `${user.username} has ${coins.coin.toLocaleString()} coins.`,
        description: `To learn more about Dank Memer's currency, run \`pls guide\`\nTo see possible ways of earning more coins, do \`pls earn\``,
        thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
        footer: {text: 'Why are you snooping on their coins?'}
      }
    } else {
      let coins = await Memer.db.getCoins(msg.author.id)
      await addCD()
      return {
        title: `You have ${coins.coin.toLocaleString()} coins.`,
        description: `To learn more about Dank Memer's currency, run \`pls guide\`\nTo see possible ways of earning more coins, do \`pls earn\`\n[Vote](https://discordbots.org/bot/270904126974590976/vote) each 24hr for 750 coins!`,
        thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
        footer: {text: 'Hey stupid, do not spend it all in one place.'}
      }
    }
  },
  {
    triggers: ['coins', 'bal', 'balance'],
    description: 'u got dis many coins ok',
    perms: ['embedLinks']
  }
)
