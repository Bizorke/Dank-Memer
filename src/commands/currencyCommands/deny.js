const { GenericCommand } = require('../../models/')
const dMessage = 'Your application for a grant has been denied.'

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let perms = msg.member.roles.some(id => msg.channel.guild.roles.get(id).id === '430836345913737238')
    if (!perms) {
      return
    }
    if (!args[0]) {
      return 'you need a user id to send the deny to'
    }
    if (!args[1]) {
      args.push(dMessage)
    }
    let [id, ...message] = args
    try {
      const channel = await Memer.bot.getDMChannel(id)
      await channel.createMessage({ embed: {
        color: Memer.randomColor(),
        title: 'Re: Your grant application',
        description: `${message.join(' ')}`,
        footer: { text: 'Better luck next application!' }
      }})
      return `<:denySign:428024864608354316> Grant denied`
    } catch (e) {
      msg.addReaction('❌')
      return `**Fuck!** *${e.message}*`
    }
  }, {
    triggers: ['deny'],
    hide: true,
    usage: '{command} <id> <amount> [message]',
    description: 'melmsie stinks'
  }
)
