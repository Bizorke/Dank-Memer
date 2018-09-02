
const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` permissions.'
    }
    let channel = msg.args.resolveChannel()
    if (!channel) {
      return 'come on you gotta give me a channel name or id to autopost NSFW content to'
    }
    if (!channel.nsfw) {
      return 'You can\'t post NSFW content in a non-NSFW marked channel!'
    }

    let check = await Memer.db.getAutonsfwChannel(msg.channel.guild.id)
    if (check.channel === channel.id) {
      await Memer.db.removeAutomemeChannel(msg.channel.guild.id)
      return `I'll no longer autopost NSFW content in <#${channel.id}>.`
    }

    let type = msg.args.gather()
    if (!['4k', 'boobs', 'ass', 'lesbian', 'gif'].includes(type.toLowerCase())) {
      return `You need to provide a valid porn category for me to post to <#${channel.id}>.\nYou can pick from \`4k\`, \`boobs\`, \`butt\`, \`lesbian\` or \`gif\`\nFor example: \`pls autonsfw #${channel.name} butt\``
    }

    await Memer.db.addAutonsfwChannel(msg.channel.guild.id, channel.id, type)
    await addCD()

    return check ? `Changed autonsfw channel from <#${check.channel}> to **<#${channel.id}>**` : `<#${channel.id}> will now post NSFW content every 5 minutes`
  },
  {
    triggers: ['autonsfw'],
    description: 'Set up a channel to automatically post porn to'
  }
)
