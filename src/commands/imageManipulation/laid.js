const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['laid', 'getlaid'],
  description: 'lol rekt'
})
