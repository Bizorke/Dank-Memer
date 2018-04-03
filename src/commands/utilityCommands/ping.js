const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({msg}) => ({ description: `no u *dabs on <@${msg.author.id}>*`, footer: { text: `${msg.channel.guild.shard.latency.toFixed()}ms` } }),
  {
    triggers: ['ping'],
    description: 'test cmd plz ignore'
  }
)
