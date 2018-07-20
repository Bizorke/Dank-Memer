const { readdirSync } = require('fs')
const { join } = require('path')
const { get } = require('snekfetch')
const { Base } = global.memeBase || require('eris-sharder')
const { StatsD } = require('node-dogstatsd')

const msgHandler = require('./handlers/msgHandler.js')
const MessageCollector = require('./utils/MessageCollector.js')
const botPackage = require('../package.json')

class Memer extends Base {
  constructor (bot) {
    super(bot)

    this.log = require('./utils/logger.js')
    this.config = require('./config.json')
    this.r = require('rethinkdbdash')()
    this.db = require('./utils/dbFunctions.js')(this)
    this.ddog = new StatsD()
    this.cmds = []
    this.tags = {}
    this.indexes = {
      'meme': {},
      'joke': {},
      'copypasta': {},
      '4chan': {},
      'tifu': {},
      'wholesome': {},
      'prequel': {},
      'aww': {},
      'facepalm': {},
      'showerthoughts': {},
      'comics': {},
      'meirl': {},
      'hoppyboi': {},
      'surreal': {},
      'memeeconomy': {},
      'blacktwitter': {},
      'antijoke': {},
      'antiantijoke': {},
      'sequel': {}
    }
    Object.assign(this, require('./utils/misc.js'))
  }

  async launch () {
    this.redis = await require('./utils/redisClient.js')()

    this.loadCommands()
    this.createIPC()
    this.MessageCollector = new MessageCollector(this.bot)
    this.ddog.increment('function.launch')
    this.bot
      .on('ready', this.ready.bind(this))
      .on('guildCreate', this.guildCreate.bind(this))
      .on('guildDelete', this.guildDelete.bind(this))
      .on('messageCreate', msgHandler.handleMeDaddy.bind(this))
      .on('rawWS', this.rawWS.bind(this))
      .on('error', (error) => {
        this.log(error.stack, 'error')
      })

    global.memeBase || this.ready()
  }

  async ready () {
    this.log(`Ready: ${process.memoryUsage().rss / 1024 / 1024}`)
    this.bot.editStatus(null, {
      name: 'pls help',
      type: 0
    })
    this.ddog.increment('function.ready')

    this.mentionRX = new RegExp(`^<@!*${this.bot.user.id}>`)
    this.mockIMG = await get('https://pbs.twimg.com/media/DAU-ZPHUIAATuNy.jpg').then(r => r.body)
  }

  createIPC () {
    this.ipc.register('reloadCommands', () => {
      for (const path in require.cache) {
        if (path.includes('src/commands')) {
          delete require.cache[path]
        }
      }
      this.log('Commands reloaded probably')

      this.cmds = []
      this.loadCommands()
    })
    this.ipc.register('reloadMost', () => {
      for (const path in require.cache) {
        if (path.includes('src/utils') || path.includes('src/commands') || path.includes('src/models') || path.includes('src/assets') || path.includes('src/handlers')) {
          delete require.cache[path]
        }
      }
      this.cmds = []
      this.loadCommands()
      this.loadUtils()
      this.log('Most things reloaded probably')
    })
    this.ipc.register('reloadConfig', () => {
      for (const path in require.cache) {
        if (path.includes('src/config')) {
          delete require.cache[path]
        }
      }
      this.config = require('./config.json')
      this.log('Config reloaded probably')
    })
  }

  async loadUtils () {
    this.log = require('./utils/logger.js')
    this.db = require('./utils/dbFunctions.js')(this)
    this.redis = await require('./utils/redisClient.js')()
    Object.assign(this, require('./utils/misc.js'))
  }

  loadCommands () {
    this.ddog.increment('function.loadCommands')
    const categories = readdirSync(join(__dirname, 'commands'))

    for (const categoryPath of categories) {
      const category = require(join(__dirname, 'commands', categoryPath))
      for (const command of category.commands) {
        command.category = category.name
        command.description = category.description
        this.cmds.push(command)
      }
    }
  }

  guildCreate (guild) {
    this.ddog.increment('event.guildCreate')
    this.ddog.increment('total.guildsGained')
    const embed = {
      color: 12054271,
      description: this.intro,
      fields: [
        {name: 'Important Links', value: this.links}
      ],
      footer: { text: 'Join the support server if you have any questions!' }
    }
    guild.channels.get(guild.channels.filter(c => c.type === 0).map(c => c.id)[0]).createMessage({ embed })
      .catch(() => {})
  }

  guildDelete (guild) {
    this.ddog.increment('event.guildDelete')
    this.ddog.decrement('total.guildsGained')
    this.db.deleteGuild(guild.id)
  }

  rawWS (packet) {
    if (packet.guild_id) {
      this.bot.voiceConnections.voiceServerUpdate(packet)
    }
  }

  get package () {
    return botPackage
  }
}

module.exports = Memer
