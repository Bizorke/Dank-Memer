const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let perms = msg.channel.permissionsOf(msg.author.id)
    let reason
    const permissions = msg.channel.permissionsOf(Memer.bot.user.id)
    if (!permissions.has('banMembers')) {
      return 'oi, shouldnt I have ban permissions before I try to ban someone?'
    }
    if (!perms.has('banMembers')) {
      return 'lol you do not have ban members perms and you know it'
    }
    let user = msg.args.resolveUser()
    if (!user) {
      return 'hey dumb, give me a user to ban via tagging them or id'
    }
    if (user.id === msg.channel.guild.ownerID) {
      return 'do you really think I can ban the server owner? Learn how to discord, thanks'
    }
    if (user.id === Memer.bot.user.id) {
      return 'not gonna ban myself, thanks'
    }
    if (msg.args.args.length === 0) {
      msg.channel.createMessage('for what reason (respond within 30s or bad mod)')
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (prompt) {
        reason = prompt.content
      } else {
        reason = 'No reason given'
      }
    }

    let banned = user
    await addCD()
    const hahayes = `${banned.username}#${banned.discriminator}`
    Memer.bot.banGuildMember(msg.channel.guild.id, banned.id, `${reason} | banned by ${msg.author.username}`)
      .then(() => { return msg.channel.createMessage(`\`${hahayes}\` was banned, good fricken riddance`) })
      .catch((err) => {
        msg.channel.createMessage(`looks like I dont have perms to ban \`${banned.username}#${banned.discriminator}\`, I guess I have a lower role than them ¯\\_(ツ)_/¯`)
        throw err
      })
  },
  {
    triggers: ['ban', 'hackban'],
    usage: '{command}',
    description: 'Warning, this will ban your target if the bot has the correct permissions',
    perms: []
  }
)
