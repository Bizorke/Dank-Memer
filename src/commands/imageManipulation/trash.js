const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['trash', 'garbage'],
  description: 'lol ur trash',
  reqURL: 'http://127.0.0.1:5000/api/trash'
})
