const { GenericCommand } = require('.')
const { promisify } = require('util')
const fs = require('fs')
const readdir = promisify(fs.readdir)

module.exports = class GenericVoiceCommand {
  constructor (cmdProps) {
    this.cmdProps = cmdProps
  }

  async run ({ Memer, msg, addCD }) {
    let files = await readdir(`./assets/audio/${this.cmdProps.dir}`)
    files = Memer.randomInArray(files).replace(/(\.opus)|(\.ogg)/, '')

    const file = typeof this.cmdProps.files === 'string'
      ? this.cmdProps.files
      : files

    if (!msg.member.voiceState.channelID) {
      return msg.reply('join a voice channel fam')
    }

    const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id)

    if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
      return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif')
    }

    if (Memer.bot.voiceConnections.has(msg.channel.guild.id)) {
      if (!Memer.bot.voiceConnections.get(msg.channel.guild.id).speaking) {
        Memer.bot.voiceConnections.remove(Memer.bot.voiceConnections.get(msg.channel.guild.id))
      }
      if (this.cmdProps.skipIfPlaying && Memer.bot.voiceConnections.get(msg.channel.guild.id)) {
        Memer.bot.voiceConnections.get(msg.channel.guild.id).stopPlaying()
      } else {
        return this.cmdProps.existingConn
      }
    }

    await addCD()

    if (this.cmdProps.np) {
      let np = files.replace(/_+/g, ' ')
      msg.channel.createMessage({embed: {title: 'Now Playing...', description: np}})
    } else if (this.cmdProps.message) {
      msg.channel.createMessage(this.cmdProps.message)
    } else {
      msg.addReaction(this.cmdProps.reaction)
    }
    const conn = await Memer.bot.joinVoiceChannel(msg.member.voiceState.channelID)
    Memer.log(`Joining voicechannel ${msg.member.voiceState.channelID}\n` +
              `\tGuild: ${msg.channel.guild.id}\n` +
              `\tAlready connected?: ${Memer.bot.voiceConnections.has(msg.channel.guild.id)}`)
    conn.play(`./assets/audio/${this.cmdProps.dir}/${file}.${this.cmdProps.ext}`, { format: 'ogg' })
    conn.once('end', async () => {
      Memer.log(`[stream-end] Leaving voicechannel ${conn.channelID}\n\tGuild: ${msg.channel.guild.id}`)
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
        donorCD: 3000,
        perms: ['addReactions']
      }, this.cmdProps)
    ).props
  }
}
