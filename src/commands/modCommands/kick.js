const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let perms = msg.channel.permissionsOf(msg.author.id)
    let reason
    const permissions = msg.channel.permissionsOf(Memer.bot.user.id)
    if (!permissions.has('kickMembers')) {
      return 'oi, shouldnt I have kick permissions before I can kick someone?'
    }
    if (!perms.has('kickMembers')) {
      return 'lol you do not have kick members perms and you know it'
    }
    let user = msg.args.resolveUser()
    if (!user) {
      return 'hey dumb, give me a user to kick via tagging them or id'
    }
    if (user.id === msg.channel.guild.ownerID) {
      return 'do you really think I can kick the server owner? Learn how to discord, thanks'
    }
    if (user.id === Memer.bot.user.id) {
      return 'not gonna kick myself, thanks'
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

    let kicked = user
    await addCD()
    const hahayes = `${kicked.username}#${kicked.discriminator}`
    Memer.bot.kickGuildMember(msg.channel.guild.id, kicked.id, `${reason} | kicked by ${msg.author.username}`)
      .then(() => { return msg.channel.createMessage(`\`${hahayes}\` was kicked, rekt af`) })
      .catch((err) => {
        msg.channel.createMessage(`looks like I dont have perms to kick \`${kicked.username}#${kicked.discriminator}\`, I guess I have a lower role than them ¯\\_(ツ)_/¯`)
        throw err
      })
  },
  {
    triggers: ['kick', 'boot'],
    usage: '{command}',
    description: 'Warning, this will kick your target if the bot has the correct permissions',
    perms: []
  }
)
