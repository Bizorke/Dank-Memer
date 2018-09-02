const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let tag = msg.args.gather()
    if (!tag) {
      return 'you need to give me a tag to post smh'
    }
    let allTags = await Memer.db.getAllTags(msg.channel.guild.id)
    let retrievedTag = allTags.filter(found => found.name === tag.toLowerCase())
    if (!retrievedTag[0]) {
      return 'There\'s no tag that exists under that name'
    }
    return retrievedTag[0].text
  }, {
    triggers: ['tag'],
    description: 'Posts the contents of a tag',
    usage: '{command} [tag name]'
  }
)
