
const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` permissions.'
    }
    let channel = msg.args.resolveChannel()
    if (!channel) {
      return 'come on man give me a channel name or id to autopost memes to'
    }

    let check = await Memer.db.getAutomemeChannel(msg.channel.guild.id)
    if (check === channel.id) {
      return `<#${channel.id}> has already been set up to autopost memes.`
    }
    await Memer.db.addAutomemeChannel(msg.channel.guild.id, channel.id)
    await addCD()

    return `<#${channel.id}> will now post memes every 5 minutes.`
  },
  {
    triggers: ['automeme'],
    usage: '{command} [channel]',
    cooldown: 1e4,
    donorBlocked: true,
    description: 'Set up a channel to automatically post memes to every 5 minutes'
  }
)
