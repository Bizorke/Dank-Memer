
const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` permissions.'
    }
    let channel = msg.args.resolveChannel()
    if (!channel) {
      return 'come on man give me a channel name or id to autopost NSFW content to'
    }
    let type = msg.args.gather()
    if (!['4k', 'boobs', 'butt', 'lesbian', 'gif'].includes(type.toLowerCase())) {
      return `You need to provide a valid porn category for me to post to <#${channel.id}>.\nYou can pick from \`4k\`, \`boobs\`, \`butt\`, \`lesbian\` or \`gif\`\nFor example: \`pls autonsfw <#${channel.id}> butt`
    }

    let check = await Memer.db.getAutonsfwChannel(msg.channel.guild.id)
    if (check === channel.id) {
      return `<#${channel.id}> has already been set up to autopost NSFW content.`
    }
    await Memer.db.addAutonsfwChannel(msg.channel.guild.id, channel.id, type)
    await addCD()

    return check ? `<#${channel.id}> will now post NSFW content every 5 minutes.` : `Autonsfw posts will now appear in **<#${channel.id}>** instead of <#${check}>`
  },
  {
    triggers: ['autonsfw'],
    description: 'Set up a channel to automatically post porn to'
  }
)
