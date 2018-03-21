const { GenericCommand } = require('../../models/')
const dMessage = 'Bad news, you have had some coins revoked.'

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    if (!args[1]) {
      return 'you need a user id and amount to revoke'
    }
    if (!args[2]) {
      args.push(dMessage)
    }
    let [id, amount, ...message] = args
    let remove = Number(amount)
    let current = Memer.db.getUser(id)
    if ((current.coin - remove) < 0) {
      remove = current.coin
    }
    Memer.db.removeCoins(id, remove)
    try {
      const channel = await Memer.bot.getDMChannel(id)
      await channel.createMessage({ embed: {
        color: 14242639,
        title: 'lul get rekt',
        description: `${message.join(' ')}\n\nAmount Revoked: ${amount}`,
        footer: { text: 'bye bish' }
      }})
      msg.addReaction('📧')
    } catch (e) {
      msg.addReaction('❌')
      return `**Fuck!** *${e.message}*`
    }
  }, {
    triggers: ['revoke'],
    usage: '{command} <id> <amount> [message]',
    description: 'melmsie stinks',
    ownerOnly: true
  }
)
