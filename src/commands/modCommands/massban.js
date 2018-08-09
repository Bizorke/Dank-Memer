const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let reason
    let users = []
    let ids = msg.args.args.match(/[0-9]{15,21}/g)
    for (let userid of ids) {
      if (userid === msg.channel.guild.ownerID) {
        return 'do you really think I can ban the server owner? Learn how to discord, thanks'
      }
      if (userid === Memer.bot.user.id) {
        return 'not gonna ban myself, thanks'
      }
      let user = msg.channel.guild.members.get(userid)
      if (!user) {
        continue
      }
      users.push(user.user)
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
    let failed = 0
    banMember()
    async function banMember () {
      let modlog = await Memer.db.fetchModlog(msg.channel.guild.id)
      let banned = users.shift()
      const hahayes = `${banned.username}#${banned.discriminator}`
      Memer.bot.banGuildMember(msg.channel.guild.id, banned.id, 1, `${reason} | banned by ${msg.author.username}`)
        .then(async () => {
          if (modlog) {
            Memer.bot.createMessage(modlog, `**${hahayes}** was banned by **${msg.author.username}#${msg.author.discriminator}**\nReason: *${reason}*`)
          }
          bannedUsers.push(banned)
          if (users.length > 1) {
            await Memer.sleep(2000)
            return banMember()
          }
        })
        .catch((err) => {
          failed++
          throw err
        })
      msg.channel.createMessage(`\`${bannedUsers.map(m => `**${m.username}#${m.discriminator}**`).join(', ')}\` were banned, good fricken riddance`)
      if (failed) {
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
