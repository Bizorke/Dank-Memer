const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['boo'],
  description: 'AAHHHH',

  textLimit: 125,
  textOnly: true
})
