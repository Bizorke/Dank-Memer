const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let allTags = await Memer.db.getAllTags(msg.channel.guild.id)
    let mappedTags = allTags.map(tag => `**\`${tag.name}\`**`)
    if (!mappedTags.length) {
      return 'This server has no tags!'
    }
    return `Here is a list of all of the tags that are on **${msg.channel.guild.name}**:\n` +
    `${mappedTags.slice(0, -2).join(', ')}${(mappedTags.slice(0, -2).length ? ', ' : '')}${mappedTags.slice(-2).join(' and ')}`
  }, {
    triggers: ['listtags', 'listtag', 'lstags'],
    description: 'Lists all of the available tags created on this server',
    usage: '{command}'
  }
)
