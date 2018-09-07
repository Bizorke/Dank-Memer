module.exports = class Music {
  constructor (client, guildID) {
    this.client = client
    this.id = guildID
    this.loop = false
    this.preparing = false
    this.queue = []
    this.player.on('event', this._handleEvent.bind(this))
    this._channelID = null
  }

  addSong (song) {
    this.queue.push(song)
    return this._play()
  }

  reset () {
    if (this.queue.length) this.clear()
    if (this.loop) this.loop = false
    if (this.playing) return this.stop()
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

  volume (volume) {
    return this.player.setVolume(volume)
  }

  async _play (options) {
    if (this.busy || !this.queue.length) return
    this.preparing = true
    const { track } = this.nowPlaying
    await this.player.play(track, options)
    this.preparing = false
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
    if (this.loop && shifted) this.queue.push(shifted)
    return this._play()
  }

  _failed (event) {
    // TODO add meme response
    return this._send(`\`[ERROR]\` ${event.error}\nSong was skipped due error.`)
  }

  _stuck () {
    // TODO add meme response
    this._send(`\`[Track Got Stuck]\` Skipped to the next one.`)
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
    return this.client.guilds.get(this.id)
  }

  get channel () {
    return this.client.channels.get(this.channelID)
  }

  set channel (id) {
    this.channelID = id
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
