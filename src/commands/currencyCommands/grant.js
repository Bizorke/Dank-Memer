const { GenericCommand } = require('../../models/')
const dMessage = 'Congrats, your application for a coin grant has been accepted!'

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let perms = msg.member.roles.some(id => msg.channel.guild.roles.get(id).id === '430836345913737238')
    if (!perms) {
      return
    }
    let max
    if (msg.member.roles.some(id => msg.channel.guild.roles.get(id).id === '430836254653808642')) {
      max = 10000
    } else {
      max = 1000
    }

    if (!args[1]) {
      return 'you need a user id and amount to grant'
    }
    if (!args[2]) {
      args.push(dMessage)
    }
    let [id, amount, ...message] = args
    if (amount > max) {
      return 'you do not have enough permission to grant this amount'
    }
    Memer.db.addCoins(id, Number(amount))
    try {
      const channel = await Memer.bot.getDMChannel(id)
      await channel.createMessage({ embed: {
        color: Memer.randomColor(),
        title: 'Re: Your grant application',
        description: `${message.join(' ')}\n\nAmount Granted: ${amount}`,
        footer: { text: 'Happy gambling!' }
      }})
      return `<:approveSign:428024864897761280> Grant sent!`
    } catch (e) {
      msg.addReaction('❌')
      return `**Fuck!** *${e.message}*`
    }
  }, {
    triggers: ['grant'],
    usage: '{command} <id> <amount> [message]',
    description: 'melmsie stinks'
  }
)
