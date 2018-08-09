const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let reason
    let users = msg.args.resolveUsers()
    for (let user of users) {
      if (user.id === msg.channel.guild.ownerID) {
        return 'do you really think I can ban the server owner? Learn how to discord, thanks'
      }
      if (user.id === Memer.bot.user.id) {
        return 'not gonna ban myself, thanks'
      }
    }
    if (!users) {
      return 'hey dumb, give me a user to ban via tagging them or id'
    }
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

    await addCD()
    let bannedUsers = []
    let modlog = await Memer.db.fetchModlog(msg.channel.guild.id)
    for (let banned in users) {
      await Memer.sleep(1000)
      const hahayes = `${banned.username}#${banned.discriminator}`
      Memer.bot.banGuildMember(msg.channel.guild.id, banned.id, 1, `${reason} | banned by ${msg.author.username}`)
        .then(() => {
          bannedUsers.push(banned)
          if (modlog) {
            Memer.bot.createMessage(modlog, `**${hahayes}** was banned by **${msg.author.username}#${msg.author.discriminator}**\nReason: *${reason}*`)
          }
        })
        .catch((err) => {
          throw err
        })
      msg.channel.createMessage(`\`${bannedUsers.map(m => `**${m.username}#${m.discriminator}**`).join(', ')}\` were banned, good fricken riddance`)
      if (bannedUsers < users) {
        let failed = users.length - bannedUsers.length
        msg.channel.createMessage(`I was unable to ban **${failed}** other ${failed === 1 ? 'person' : 'people'}. Check that they don't have a higher role than me and try again.`)
      }
    }
  },
  {
    triggers: ['massban', 'bigban'],
    usage: '{command} [user] [reason]',
    description: 'Warning, this will ban your target if the bot has the correct permissions',
    modPerms: ['banMembers']
  }
)
