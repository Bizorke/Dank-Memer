module.exports = class Music {
  constructor (client, guildID) {
    this.client = client
    this.id = guildID
    this.loop = false
    this.preparing = false
    this.queue = []
    this.player.on('event', this._handleEvent.bind(this))
    this._channelID = null
    this.ready = this._loadQueue()
    this.vote = null
  }

  addSong (song, unshift) {
    if (unshift) {
      this.queue.unshift(song)
    } else {
      this.queue.push(song)
    }
    return this._play()
  }

  startVote (voter) {
    this.vote = {
      voted: [voter],
      timeout: setTimeout(this._handleVoteTimeout.bind(this), 6e4)
    }
    return this.vote
  }

  resetVote () {
    clearTimeout(this.vote.timeout)
    this.vote = null
  }

  reset () {
    if (this.queue.length) {
      this.clear()
    }
    if (this.loop) {
      this.loop = false
    }
    if (this.playing) {
      return this.stop()
    }
  }

  pause (boolean = true) {
    return this.player.pause(boolean)
  }

  shuffle () {
    return this._shuffle(this.queue)
  }

  remove (index) {
    return this.queue.splice(index, 1)
  }

  clear () {
    this.queue.length = 1
  }

  stop () {
    return this.player.stop()
  }

  endSession () {
    this._saveQueue()
    this.client.musicManager._map.delete(this.id)
    this.player.leave()
    return this.player.destroy()
  }

  volume (volume) {
    return this.player.setVolume(volume)
  }

  async _play (options) {
    if (this.busy || !this.queue.length) {
      return
    }
    this.preparing = true
    const { track } = this.nowPlaying
    await this.player.play(track, options)
    this.preparing = false
  }

  _saveQueue () {
    if (this.queue[0]) {
      this.client.redis.setAsync(`queue-${this.id}`, JSON.stringify(this.queue, 'EX', 60 * 60 * 24))
        .catch(() => {})
    } else {
      this.client.redis.delAsync(`queue-${this.id}`)
        .catch(() => {})
    }
  }

  _handleVoteTimeout () {
    this.vote = null
    return this._send(`The vote to skip the current song ended because not enough users voted in time`)
  }

  async _loadQueue () {
    const queue = await this.client.redis.getAsync(`queue-${this.id}`)
      .catch(() => null)
    if (queue) {
      this.queue = JSON.parse(queue)
    }
    return true
  }

  _handleEvent (event) {
    const shifted = this.queue.shift()
    if (event.type === 'TrackEndEvent') {
      return this._finished(event, shifted)
    } else if (event.type === 'TrackExceptionEvent') {
      return this._failed(event)
    } else {
      return this._stuck()
    }
  }

  _finished (event, shifted) {
    if (this.vote) {
      this.resetVote()
      this._send(`The vote to skip the song \`${shifted.info.title}\` has been cancelled because the song just ended`)
    }
    if (this.loop && shifted) {
      this.queue.push(shifted)
    }
    if (this.queue.length === 0) {
      return this.player.leave()
    }
    return this._play()
  }

  _failed (event) {
    return this._send(`:rage: Something went wrong whilst playing the hecking song: \`${event.error}\`\nAutomatically skipped to the next song in the queue.`)
  }

  _stuck () {
    this._send('heck, something went wrong when playing the current track, sorry bout that\nAutomatically skipped to the next song in the queue.')
    return this._play()
  }

  _shuffle (queue) {
    let firstSong = queue.shift()
    let currentIndex = queue.length
    let randomIndex
    let temporaryValue

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = queue[currentIndex]
      queue[currentIndex] = queue[randomIndex]
      queue[randomIndex] = temporaryValue
    }

    queue.unshift(firstSong)

    return queue
  }

  _send (content) {
    const { channel } = this
    return channel.createMessage(content).catch(() => null)
  }

  get guild () {
    return this.client.bot.guilds.get(this.id)
  }

  get channel () {
    return this.client.bot.guilds.get(this.id).channels.get(this._channelID)
  }

  get voiceChannel () {
    const guild = this.client.bot.guilds.get(this.id)
    return guild.channels.get(guild.members.get(this.client.bot.user.id).voiceState.channelID)
  }

  set channel (id) {
    this._channelID = id
  }

  get busy () {
    return this.playing || this.paused || this.preparing
  }

  get status () {
    return this.player.status
  }

  get playing () {
    return this.player.playing
  }

  get paused () {
    return this.player.paused
  }

  get player () {
    return this.client.lavalink.get(this.id)
  }

  get node () {
    return this.player.node
  }

  get nowPlaying () {
    return this.queue[0]
  }
}
