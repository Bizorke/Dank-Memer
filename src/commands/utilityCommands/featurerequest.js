const { GenericCommand } = require('../../models/')
const VENT_CID = '430835458000420864'

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    await Memer.bot.createMessage(VENT_CID, { embed: {
      title: 'New request:',
      author: { name: `${msg.author.username}#${msg.author.discriminator} | ${msg.author.id}` },
      description: args.join(' '),
      fields: [{ name: 'Sent from:', value: `#${msg.channel.name} in ${msg.channel.guild.name}` }],
      color: Memer.randomColor(),
      footer: { text: `Guild ID: ${msg.channel.guild.id}` },
      timestamp: new Date()
    }})

    return 'Your feature request has been sent to the developers. Feel free to suggest more after the cooldown.'
  }, {
    triggers: ['featurerequest'],
    description: 'Use this command to request a feature you\'d like the bot to have.',
    missingArgs: 'Use this command to request a feature you\'d like the bot to have. Try again'
  }
)
