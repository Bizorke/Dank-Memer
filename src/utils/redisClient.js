const Redis = require('ioredis')

module.exports = (hostAddr) => new Promise(resolve => {
  const client = new Redis({host: hostAddr || '127.0.0.1'})

  client.on('error', (err) => {
    console.error(err)
  })

  client.on('ready', resolve.bind(null, client))
})
