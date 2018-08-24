const r = require('rethinkdbdash')()
const tables = [
  'automeme',
  'blocked',
  'cooldowns',
  'donors',
  'guildUsage',
  'guilds',
  'stats',
  'tags',
  'updates',
  'users'
]
const secondary = [
  'pocket',
  'pls',
  'spam'
]

async function byebye (r) {
  tables.forEach(name => {
    r.tableCreate(name).run()
    console.log(`${name} table created`)
  })

  setTimeout(() => {
    secondary.forEach(name => {
      r.table('users').indexCreate(name).run()
      console.log(`${name} index created`)
    })
  }, 10 * 1000)
}

byebye(r)
