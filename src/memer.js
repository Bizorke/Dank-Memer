const config = require('./config.json')
const { Master: Sharder } = require('eris-sharder')
const { post } = require('snekfetch')
const r = require('rethinkdbdash')()
const StatsD = require('node-dogstatsd').StatsD
let s = new StatsD()

const master = new Sharder(config.token, '/mainClass.js', {
  stats: true,
  name: 'aeth hand',
  webhooks: config.webhooks,
  clientOptions: {
    disableEvents: {
      CHANNEL_PINS_UPDATE: true,
      USER_SETTINGS_UPDATE: true,
      USER_NOTE_UPDATE: true,
      RELATIONSHIP_ADD: true,
      RELATIONSHIP_REMOVE: true,
      GUILD_BAN_ADD: true,
      GUILD_BAN_REMOVE: true,
      TYPING_START: true,
      MESSAGE_DELETE: true,
      MESSAGE_DELETE_BULK: true,
      MESSAGE_UPDATE: true
    },
    disableEveryone: true,
    messageLimit: 0
  },
  shards: config.shardCount || 1,
  statsInterval: 5000
})

master.on('stats', res => {
  s.gauge('bot.guilds', res.guilds)
  s.gauge('bot.users', res.users)
  s.gauge('bot.voice', res.voice)
  s.gauge('bot.mem', res.mem)
  r.table('stats')
    .insert({ id: 1, stats: res }, { conflict: 'update' })
    .run()
})

process.on('SIGINT', () => {
  r.table('stats')
    .get(1)
    .delete()
    .run()
})

if (require('cluster').isMaster && !config.dev) {
  setInterval(async () => {
    const { stats: { guilds } } = await r.table('stats')
      .get(1)
      .run()

    for (const botlist of config.botlists) {
      post(botlist.url)
        .set('Authorization', botlist.token)
        .send({
          [`server${botlist.url.includes('carbonitex') ? '' : '_'}count`]: guilds,
          key: botlist.token
        })
        .end()
    }
  }, 5 * 60 * 1000)
}
