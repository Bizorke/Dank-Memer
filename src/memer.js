/**
 *  Dank Memer: A discord memebot, made to spread dreams of memes, and memes of dreams
 *  Copyright (C) 2018 Dank Memer Team (dankmemerbot@gmail.com)
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const config = require('./config.json')
const { Master: Sharder } = require('eris-sharder')
const { post } = require('./utils/http')
const r = require('rethinkdbdash')()

const master = new Sharder(config.token, '/mainClass.js', {
  stats: true,
  name: config.name || 'Dank Memer',
  webhooks: config.webhooks,
  clientOptions: config.clientOptions,
  shards: config.shardCount || 1,
  statsInterval: config.statsInterval || 1e4,
  clusters: config.clusters || undefined
})

master.on('stats', res => {
  r.table('stats')
    .insert({ id: 1, stats: res }, { conflict: 'update' })
    .run()
})

process.on('SIGINT', async () => {
  await r.table('stats')
    .get(1)
    .delete()
    .run()

  process.exit()
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
  }, 60 * 60 * 1000)
}

if (require('cluster').isMaster) setInterval(usage, 15 * 1000)

function usage () {
  console.log((process.memoryUsage()['rss'] / 1024 / 1024) + 'MB')
}
