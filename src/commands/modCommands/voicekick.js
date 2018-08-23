const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let channel = msg.channel.guild.channels.filter(c => c.type === 2).find(c => c.name.toLowerCase() === msg.args.args[0].toLowerCase())
    msg.args.args.splice(0, 1)
    if (!channel) {
      return 'hey dumb, give me a voice channel to kick people from'
    }
    let users = msg.args.gather().toLowerCase() === 'everyone' ? channel.voiceMembers : msg.args.resolveUsers()
    users = users.filter(user => channel.voiceMembers.has(user.id))
    if (!users.length) {
      return 'oi mate, you\'ve gotta give me a user (or multiple) in the voice channel to kick!'
    }

    await addCD()
    const hahayes = `Voicekick by ${msg.author.username}#${msg.author.discriminator}`
    msg.channel.guild.createChannel(channel.name, channel.type, hahayes, channel.parentID)
      .then(async (newchannel) => {
        let promises = []
        for (let user of users) {
          const member = channel.voiceMembers.get(user.id)
          promises.push(
            member.edit({ channelID: newchannel.id }).catch(() => {})
          )
        }

        await Promise.all(promises).then(async () => {
          await newchannel.delete(hahayes)
          msg.channel.createMessage(`I successfully removed ${promises.length} ${promises.length === 1 ? 'person' : 'people'} from **${newchannel.name}**`)
        })
      })
      .catch((err) => {
        throw err
      })
  },
  {
    triggers: ['voicekick', 'vckick'],
    usage: '{command} [channel] [user | everyone]',
    description: 'Warning, this will recreate the target voice channel if the bot has the correct permissions',
    modPerms: ['manageChannels']
  }
)
