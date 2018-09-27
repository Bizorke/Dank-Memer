/** @typedef {import('./GenericCommand').CommandProps} CommandProps */

const GenericCommand = require('./GenericCommand')
module.exports = class GenericVoiceCommand {
  /**
   * @param {CommandProps} cmdProps
   */
  constructor (cmdProps) {
    this.cmdProps = cmdProps
  }

  async run ({ Memer, msg, args, addCD }) {
    const music = Memer.musicManager.get(msg.channel.guild.id)
    let response = await Memer.redis.get(`cachedplaylist-${this.cmdProps.dir}`)
      .then(res => res ? JSON.parse(res) : undefined)
    if (!response) {
      response = await music.node.load(encodeURIComponent(`${Memer.config.links.youtube[this.cmdProps.dir]}`))
      Memer.redis.set(`cachedplaylist-${this.cmdProps.dir}`, JSON.stringify(response))
    }

    let { tracks } = response

    if (music.sfxautoplay.enabled && msg.member !== music.sfxautoplay.host) {
      return `You can't play any sound effects right now because **${music.sfxautoplay.host.user.username}** has started a \`mememusic\` autoplay session. Meme music will continuously play until the host leaves, or someone stops the music using \`pls stop\``
    }

    if (args.length) {
      // Repeat function
      let donor = await Memer.db.checkDonor(msg.author.id)
      if ((args.includes('-autoplay') || args.includes('-repeat')) && donor) {
        music.sfxautoplay = { enabled: !music.sfxautoplay.enabled, host: msg.member }
        msg.channel.createMessage('nice, meme music will keep playing until you leave the channel or stop the music\nYou can also use `pls mememusic -autoplay` again to turn this off')
      } else {
        // Search
        tracks = tracks.filter(track => track.info ? track.info.title.toLowerCase().includes(args.join(' ').toLowerCase()) : track)
        if (!tracks.length) {
          return 'your search returned no results damn'
        }
      }
    }

    if (!tracks[0]) {
      return 'Seems like this didn\'t work, sad.'
    }
    const song = Memer.randomInArray(tracks)

    if (this.cmdProps.soundboard) {
      if (args.length === 0) {
        return 'You need to specify which sfx to play.\nChoose one from here: <https://goo.gl/X6EyRq>'
      }
      let file = args.join(' ').toLowerCase()
      if (!this.files.includes(`${file}.opus`)) return 'That isnt an option...\nChoose one from here: <https://goo.gl/X6EyRq>'
    }

    if (!msg.member.voiceState.channelID) {
      return msg.reply('join a voice channel fam')
    }

    const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id)

    if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
      return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif')
    }

    if (music.player) {
      if (!music.playing) {
        await music.reset()
      }
      if (this.cmdProps.skipIfPlaying && music.playing) {
        await music.reset()
      }
      if (music.playing && !this.cmdProps.skipIfPlaying) {
        return this.cmdProps.existingConn
      }
    }

    await addCD()

    if (this.cmdProps.np) {
      msg.channel.createMessage({ embed: { title: 'Now Playing...', description: song.info.title } })
    } else if (this.cmdProps.message) {
      msg.channel.createMessage(this.cmdProps.message)
    } else {
      msg.addReaction(this.cmdProps.reaction)
    }

    await music.player.join(msg.member.voiceState.channelID)
    await music.ready
    if (music.queue[0]) {
      music.queue = []
    }

    let promises = []
    promises.push(await music.addSong(song))
    await Promise.all(promises)
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 3000,
        donorCD: 1000,
        perms: ['addReactions']
      }, this.cmdProps)
    ).props
  }
}
