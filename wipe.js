const r = require('rethinkdbdash')()

async function byebye (r) {
  r.tableDrop('users').run()
  console.log('deleted user table')
  setTimeout(() => {
    console.log('creating new table')
    r.tableCreate('users').run()
    setTimeout(() => {
      r.table('users').indexCreate('pocket').run()
      r.table('users').indexCreate('bank').run()
      r.table('users').indexCreate('pls').run()
      r.table('users').indexCreate('spam').run()
      r.table('users').indexCreate('won').run()
      r.table('users').indexCreate('lost').run()
      r.table('users').indexCreate('donor').run()
    }, 5000)
  }, 5000)
}

byebye(r)
