const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    try {
      if (!Memer.bot.getChannel(msg.channel.id).permissionsOf(msg.author.id).has('banMembers')) {
        return 'Only people with ban perms can add tags.'
      }
      if (!args[1]) {
        return 'You have the wrong syntax for this command.\nExample: pls addtag henlo u stink\nYou: pls tag henlo\nDank Memer: u stink'
      }
      const [ tagName, ...tagText ] = args
      Memer.db.addTag(msg.channel.guild.id, tagName, tagText.join(' '))
      return `Tag added: ${tagName}`
    } catch (err) {
      return err
    }
  }, {
    triggers: ['addtag'],
    usage: '{command} <id> <shit>',
    description: 'melmsie stinks'
  }
)
