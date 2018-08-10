const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let reason
    let id = msg.args.args[0]
    if (!id) {
      return 'aye, ur gonna need to give me an id buddy'
    }
    let user = Memer.bot.users.get(id) // TODO: need a more consistent way of fetching the user via ID
    if (msg.args.args.length === 0) {
      msg.channel.createMessage('for what reason (respond within 30s or bad mod)')
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (prompt) {
        reason = prompt.content
      } else {
        reason = 'No reason given'
      }
    } else {
      reason = msg.args.args.join(' ')
    }

    let unbanned = user
    await addCD()
    const hahayes = `${unbanned.username}#${unbanned.discriminator}`
    let banlist = await Memer.bot.getGuildBans(msg.channel.guild.id)
    if (banlist.includes(id)) { // TODO: not sure if this is working
      msg.channel.createMessage('that person isn\'t even banned lol good one')
    }
    let modlog = await Memer.db.fetchModlog(msg.channel.guild.id)
    Memer.bot.unbanGuildMember(msg.channel.guild.id, unbanned.id, 1, `${reason} | banned by ${msg.author.username}`)
      .then(() => {
        if (modlog) {
          Memer.bot.createMessage(modlog, `**${hahayes}** was unbanned by **${msg.author.username}#${msg.author.discriminator}**\nReason: *${reason}*`)
        }
        return msg.channel.createMessage(`\`${hahayes}\` has been granted back into the server, for better or for worse`)
      })
      .catch((err) => {
        msg.channel.createMessage(`I wasn't able to unban that person for some reason, check that i've got the correct permissions and try again.`)
        throw err
      })
  },
  {
    triggers: ['unban', 'removeban', 'rmban'],
    usage: '{command} [id] [reason]',
    description: 'Unbans any person who has previously been banned from this server. Requires a valid user ID',
    modPerms: ['banMembers']
  }
)
