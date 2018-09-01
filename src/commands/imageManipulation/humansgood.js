const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['humansgood'],
  description: 'Humans are good',

  textLimit: 125,
  textOnly: true
})
