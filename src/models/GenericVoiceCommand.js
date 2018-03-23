const { GenericCommand } = require('.')

module.exports = class GenericVoiceCommand {
  constructor (cmdProps) {
    this.cmdProps = cmdProps
  }

  async run ({ Memer, msg, addCD }) {
    const file = typeof this.cmdProps.files === 'string'
      ? this.cmdProps.files
      : Math.floor(Math.random() * this.cmdProps.files + 1)

    if (!msg.member.voiceState.channelID) {
      return msg.reply('join a voice channel fam')
    }

    const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id)

    if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
      return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif')
    }

    if (Memer.bot.voiceConnections.has(msg.channel.guild.id)) {
      if (this.cmdProps.skipIfPlaying) {
        Memer.bot.voiceConnections.get(msg.channel.guild.id).stopPlaying()
      } else {
        return this.cmdProps.existingConn
      }
    }

    await addCD()

    msg.addReaction(this.cmdProps.reaction)
    const conn = await Memer.bot.joinVoiceChannel(msg.member.voiceState.channelID)
    const isOpus = !this.cmdProps.ext || this.cmdProps.ext === 'opus'

    conn.play(`./assets/audio/${this.cmdProps.dir}/${file}.${this.cmdProps.ext || 'opus'}`, isOpus ? { format: 'ogg' } : {})
    conn.once('end', async () => {
      await Memer.bot.leaveVoiceChannel(msg.channel.guild.members.get(Memer.bot.user.id).voiceState.channelID) // TODO: Don't run this if it's being skipped
      if (Memer.bot.voiceConnections.has(msg.channel.guild.id)) {
        Memer.bot.voiceConnections.remove(Memer.bot.voiceConnections.get(msg.channel.guild.id))
      }
    })
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 10000,
        perms: ['addReactions']
      }, this.cmdProps)
    ).props
  }
}
