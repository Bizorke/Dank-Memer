const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    if (!msg.mentions[0]) {
      return {description: 'who r u giving coins to, dumb'}
    }
    if (!args[1]) {
      return {description: 'so are you just like, sharing air?'}
    }
    let given = Number(args[0]) || Number(args[1])
    if (!given) {
      return 'you have to to actually share a number, dummy. Not ur dumb feelings'
    }
    if (!Number.isInteger((Number(given)))) {
      return { title: 'AHA! You cannot break me anymore! Must be a whole number, dumb butt.' }
    }
    let giverCoins = await Memer.db.getCoins(msg.author.id)
    let takerCoins = await Memer.db.getCoins(msg.mentions[0].id)
    if (!Number.isInteger(giverCoins.coin)) {
      giverCoins = Memer.db.fixCoins(msg.author.id)
    }
    if (!Number.isInteger(takerCoins.coin)) {
      takerCoins = Memer.db.fixCoins(msg.mentions[0].id)
    }
    if (given > giverCoins.coin) {
      return {description: `You only have ${giverCoins.coin} coins, you can't share that many`}
    }
    if (given < 0) {
      return {description: 'You can\'t share 0 coins you dumb'}
    }
    if (given > 1e6) {
      await Memer.bot.createMessage('447982225246519296', { embed: {
        title: 'Shared',
        author: { name: `${msg.author.username}#${msg.author.discriminator} | ${msg.author.id}` },
        description: `Amount: ${given.toLocaleString()}`,
        fields: [{ name: 'Sent from:', value: `#${msg.channel.name} in ${msg.channel.guild.name}` }],
        color: Memer.randomColor(),
        footer: { text: `Guild ID: ${msg.channel.guild.id}` },
        timestamp: new Date()
      }})
    }

    await addCD()
    await Memer.db.addCoins(msg.mentions[0].id, given)
    await Memer.db.removeCoins(msg.author.id, given)
    return {description: `You gave ${msg.mentions[0].username} ${given.toLocaleString()} coins, now you have ${(giverCoins.coin - given).toLocaleString()} and they've got ${(takerCoins.coin + given).toLocaleString()}`}
  },
  {
    triggers: ['share', 'give'],
    cooldown: 1e4,
    donorCD: 1000,
    description: 'share some coins with someone',
    missingArgs: 'You need to choose who to share with and how many coins dummy'
  }
)
