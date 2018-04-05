const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({msg}) => ({ description: `[ponk](https://www.youtube.com/watch?v=Cnq0vVPNPG8 "${msg.channel.guild.shard.latency.toFixed()}ms")` }),
  {
    triggers: ['ping'],
    description: 'test cmd plz ignore'
  }
)
