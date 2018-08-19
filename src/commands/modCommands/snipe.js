const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let channel = msg.args.resolveChannel() || msg.channel

    if (!Memer.snipe) {
      Memer.snipe = {}
    }
    if (!Memer.snipe[msg.channel.guild.id]) {
      Memer.snipe[msg.channel.guild.id] = {}
    }
    if (!Memer.snipe[msg.channel.guild.id][channel.id]) {
      return 'There\'s nothing to snipe!'
    }
    await addCD()
    let user = Memer.bot.users.get(Memer.snipe[msg.channel.guild.id][channel.id].userID)
    return { author: { name: `${user.username}#${user.discriminator}`, icon_url: user.dynamicAvatarURL() },
      description: Memer.snipe[msg.channel.guild.id][channel.id].content }
  },
  {
    triggers: ['snipe', 'sniper'],
    usage: '{command} [channel]',
    description: 'Shows the last deleted message from a specified channel',
    modPerms: ['manageMessages']
  }
)
