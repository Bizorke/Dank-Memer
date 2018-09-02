const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['humansgood'],
  description: 'Humans are good',

  textLimit: 71,
  textOnly: true
})
