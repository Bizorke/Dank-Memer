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
        thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
        footer: {text: 'Why are you snooping on their coins?'}
      }
    } else {
      let coins = await Memer.db.getCoins(msg.author.id)
      let voted = await Memer.db.isVoter(msg.author.id)
      if (!Number.isInteger(coins.coin)) {
        coins = Memer.db.fixCoins(msg.author.id)
      }
      await addCD()
      if (!voted) {
        msg.channel.createMessage('Looks like you have not voted before!\nIf you go here and vote, you can get 750 coins each day that you do it!\n<https://discordbots.org/bot/memes/vote>')

        return {
          title: `You have ${coins.coin.toLocaleString()} coins.`,
          description: `To learn more about Dank Memer's currency, run \`pls guide\`\nTo see possible ways of earning more coins, do \`pls earn\``,
          thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
          footer: {text: 'Hey stupid, do not spend it all in one place.'}
        }
      }
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
