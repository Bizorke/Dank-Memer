const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['changemymind'],
  description: 'well come on change my mind',

  textLimit: 149,
  textOnly: true
})
