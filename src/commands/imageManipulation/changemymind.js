const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['changemymind'],
  description: 'well come on change my mind',

  textLimit: 125,
  textOnly: true
})
