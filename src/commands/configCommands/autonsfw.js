
const GenericCommand = require('../../models/GenericCommand')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    if (!await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'This feature is only available on **Premium** servers.\nTo learn more about how to redeem a premium server, visit our Patreon https://www.patreon.com/dankmemerbot'
    }
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
      await Memer.db.removeAutonsfwChannel(msg.channel.guild.id)
      return `I'll no longer autopost NSFW content in <#${channel.id}>.`
    }

    let type = msg.args.nextArgument()
    if (!['4k', 'boobs', 'ass', 'lesbian', 'gif'].includes(type.toLowerCase())) {
      return `You need to provide a valid porn category for me to post to <#${channel.id}>.\nYou can pick from \`4k\`, \`boobs\`, \`ass\`, \`lesbian\` or \`gif\`\nFor example: \`pls autonsfw #${channel.name} 4k\``
    }
    const translation = {
      'lesbian': 'lesbians',
      'gif': 'Gifs'
    }

    let interval = Number(msg.args.nextArgument())
    if (!interval || !Number.isInteger(interval) || Number.isNaN(interval)) {
      interval = 5
    }
    await Memer.db.addAutonsfwChannel(msg.channel.guild.id, channel.id, interval, translation[type] || type)
    await addCD()

    return check ? `Changed autonsfw channel from <#${check.channel}> to **<#${channel.id}>**` : `<#${channel.id}> will now post NSFW content (\`${type}\`) every **${interval} minutes**`
  },
  {
    triggers: ['autonsfw'],
    usage: '{command} [channel] [type] [interval in minutes]',
    cooldown: 1e4,
    donorBlocked: true,
    description: 'Set up a channel to automatically post porn to'
  }
)
