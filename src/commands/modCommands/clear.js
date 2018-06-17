const { GenericCommand } = require('../../models/')

const cleanBoi = async (Memer, msg, args, messages) => {
  if (parseInt(args[1]) && args[1] > 1) {
    messages.length = Math.min(messages.length, args[1])
  } else if (parseInt(args[1]) < 2) {
    return 'hey after bot/user you need a number between 2 and 100'
  } else {
    messages.length = Math.min(messages.length, 10)
  }
  let amount = messages.length
  if (messages[0]) {
    msg.channel.deleteMessages(messages.map(m => m.id))
      .catch(() => {})
    let fin = await msg.channel.createMessage(`${amount} messages deleted.`)
    await msg.delete()
    await Memer.sleep(1500)
    return fin.delete()
  }
}

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let perms = msg.channel.permissionsOf(msg.author.id)
    if (!perms.has('manageMessages')) {
      return 'lol you do not have manage messages perms and you know it'
    }

    let messages = await msg.channel.getMessages(100)
    let user = msg.args.resolveUser(false, false)

    if (args && args[0] === 'bot') {
      await addCD()
      messages = messages.filter(m => m.author.id === Memer.bot.user.id && m.timestamp > Date.now() - 14 * 24 * 60 * 60 * 1000)
      await cleanBoi(Memer, msg, args, messages)
    } else if (user != null) {
      await addCD()
      messages = messages.filter(m => m.author.id === user.id && m.timestamp > Date.now() - 14 * 24 * 60 * 60 * 1000)
      await cleanBoi(Memer, msg, args, messages)
    } else {
      await addCD()
      messages = messages.filter(m => m.timestamp > Date.now() - 14 * 24 * 60 * 60 * 1000)
      await cleanBoi(Memer, msg, args, messages)
    }
  },
  {
    triggers: ['clean', 'purge', 'clear'],
    usage: '{command}',
    description: 'Will quickly clean the last 10 messages, or however many you specify.',
    perms: ['manageMessages', 'readMessageHistory']
  }
)
