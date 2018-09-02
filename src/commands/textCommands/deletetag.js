const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!Memer.bot.getChannel(msg.channel.id).permissionsOf(msg.author.id).has('banMembers')) {
      return 'Only people with `Ban Members` can remove tags.'
    }
    const tagName = msg.args.args[0]
    let results = await Memer.db.getTag(msg.channel.guild.id, tagName)
    if (!results) {
      return 'There is no tag with that name'
    }
    Memer.db.removeTag(msg.channel.guild.id, tagName)
    return `Successfully removed tag **${tagName}**`
  }, {
    triggers: ['deletetag', 'deltag'],
    description: 'Deletes an existing tag',
    usage: '{command} [tag name]'
  }
)
