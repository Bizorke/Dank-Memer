const { GenericCommand } = require('../../models/')
const dMessage = 'Congrats, your application for a coin grant has been accepted!'

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    if (!args[1]) {
      return 'you need a user id and amount to grant'
    }
    if (!args[2]) {
      args.push(dMessage)
    }
    let [id, amount, ...message] = args
    Memer.db.addCoins(id, Number(amount))
    try {
      const channel = await Memer.bot.getDMChannel(id)
      await channel.createMessage({ embed: {
        color: Memer.randomColor(),
        title: 'Re: Your grant application',
        description: `${message.join(' ')}\n\nAmount Granted: ${amount}`,
        footer: { text: 'Happy gambling!' }
      }})
      msg.addReaction('📧')
    } catch (e) {
      msg.addReaction('❌')
      return `**Fuck!** *${e.message}*`
    }
  }, {
    triggers: ['grant'],
    usage: '{command} <id> <amount> [message]',
    description: 'melmsie stinks',
    ownerOnly: true
  }
)
