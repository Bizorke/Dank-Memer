const { GenericCommand } = require('.')
const { promisify } = require('util')
const fs = require('fs')
const readdir = promisify(fs.readdir)
let filesDir
let file
module.exports = class GenericVoiceCommand {
  constructor (cmdProps) {
    this.cmdProps = cmdProps
  }

  async run ({ Memer, msg, args, addCD }) {
    filesDir = await readdir(`./assets/audio/${this.cmdProps.dir}`)
    let files = Memer.randomInArray(filesDir).replace(/(\.opus)|(\.ogg)/, '')

    if (this.cmdProps.soundboard) {
      if (args.length === 0) {
        return 'You need to specify which sfx to play.\nChoose one from here: <https://goo.gl/X6EyRq>'
      }
      file = args.join(' ').toLowerCase()
      if (!filesDir.includes(`${file}.opus`)) return 'That isnt an option...\nChoose one from here: <https://goo.gl/X6EyRq>'
    } else {
      file = typeof this.cmdProps.files === 'string'
        ? this.cmdProps.files
        : files
    }

    if (!msg.member.voiceState.channelID) {
      return msg.reply('join a voice channel fam')
    }

    const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id)

    if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
      return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif')
    }

    if (Memer.bot.voiceConnections.has(msg.channel.guild.id)) {
      if (!Memer.bot.voiceConnections.get(msg.channel.guild.id).playing) {
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
    conn.play(`./assets/audio/${this.cmdProps.dir}/${file}.opus`, { format: 'ogg' })
    await Memer.bot.createMessage('442528103382908948', `${msg.guild.id}\n./assets/audio/${this.cmdProps.dir}/${file}.opus\n`)
    setTimeout(async function () { checkBorkVoice(Memer, msg.channel) }, 5000)
    conn.once('end', async () => {
      await Memer.bot.leaveVoiceChannel(msg.channel.guild.members.get(Memer.bot.user.id).voiceState.channelID) // TODO: Don't run this if it's being skipped
    })
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 5000,
        donorCD: 3000,
        perms: ['addReactions']
      }, this.cmdProps)
    ).props
  }
}

async function checkBorkVoice (Memer, channel) {
  if (Memer.bot.voiceConnections.has(channel.guild.id)) {
    if (!Memer.bot.voiceConnections.get(channel.guild.id).playing) {
      await Memer.bot.leaveVoiceChannel(channel.guild.members.get(Memer.bot.user.id).voiceState.channelID)
      Memer.ddog.increment('leftVoice')
      return channel.createMessage('Hm, it seems that I am in the voice channel but not playing anything. I decided to leave')
    }
    return setTimeout(async function () { checkBorkVoice(Memer, channel) }, 10000)
  }
}
