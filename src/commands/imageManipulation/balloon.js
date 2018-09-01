const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['balloon'],
  description: 'You can\'t pop this balloon.',

  textLimit: 125,
  textOnly: true
})
