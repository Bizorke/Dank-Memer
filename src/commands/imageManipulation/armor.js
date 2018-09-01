const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['armor', 'armour'],
  description: 'Nothing can get through this armor!',

  textLimit: 125,
  textOnly: true
})
