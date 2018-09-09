const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({msg}) => (`\`${msg.channel.guild.shard.latency}ms\``),
  {
    triggers: ['ping'],
    description: 'test cmd plz ignore'
  }
)
