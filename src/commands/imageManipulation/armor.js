const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['armor', 'armour'],
  description: 'Nothing can get through this armor!',

  requiredArgs: 'You need to provide text for the armor meme, try again',
  textLimit: 21,
  textOnly: true
})
