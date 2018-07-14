const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg}) => {
    const gConfig = await Memer.db.getGuild(msg.channel.guild.id) || await Memer.db.createGuild(msg.channel.guild.id)

    const prefix = gConfig.prefix

    return 'Right '
  },
  {
    triggers: ['serverconf', 'config'],
    description: 'show your server configuration'
  }
)
