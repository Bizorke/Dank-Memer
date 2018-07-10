const { GenericCommand } = require('../../models/')

function isNewerThan2Weeks (msg) {
  return msg.timestamp > Date.now() - 14 * 24 * 60 * 60 * 1000
}

async function cleanBoi (Memer, msg, amount, messages) {
  messages.length = amount

  if (messages.length === 0) {
    return `whaddya want me to delete?`
  }

  const result = await msg.channel.deleteMessages(messages.map(m => m.id))
    .catch(err => err.message)

  if (result) {
    return `Something went wrong while deleting the messages\n\`\`\`\n${result}\`\`\``
  }

  const success = await msg.channel.createMessage(`Deleted ${messages.length} messages. Are ya happy now?`)
  await Memer.sleep(1500)
  return success.delete()
}

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    const perms = msg.channel.permissionsOf(msg.author.id)
    if (!perms.has('manageMessages')) {
      return 'lol you do not have manage messages perms and you know it'
    }

    await addCD()

    const messages = await msg.channel.getMessages(100)
    const maxPurge = Math.min(messages.length, 100)
    const purgeAmount = Math.min(Math.max(Number(msg.args.getArgument(0)) || 10, 0), maxPurge)

    switch (msg.args.nextArgument()) {
      case 'bot':
      case 'bots': // clean messages from any bots
        return cleanBoi(Memer, msg, purgeAmount, messages.filter(m => isNewerThan2Weeks(m) && m.author.bot))

      case 'user':
      case 'users': // clean messages from all users (or those specified) - excludes bots
        const senders = msg.args.resolveUsers()
        if (senders.length > 0) {
          return cleanBoi(Memer, msg, purgeAmount, messages.filter(m => isNewerThan2Weeks(m) && senders.some(user => user.id === m.author.id)))
        } else {
          return cleanBoi(Memer, msg, purgeAmount, messages.filter(m => isNewerThan2Weeks(m) && !m.author.bot))
        }

      default: // No arguments/matches, default to cleaning Memer's messages
        return cleanBoi(Memer, msg, purgeAmount, messages.filter(m => isNewerThan2Weeks(m) && m.author.id === Memer.bot.user.id))
    }
  },
  {
    triggers: ['clean', 'purge', 'clear'],
    usage: '{command} [amount] [bots|users] [users...]',
    description: 'Will quickly clean the last 10 messages, or however many you specify.',
    perms: ['manageMessages', 'readMessageHistory']
  }
)
