const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['floor', 'theflooris'],
  usage: '{command} <something to make the floor>',
  description: 'hi, no desc for you',

  requiredArgs: 'You need to add something to to make the floor, try again.',
  textLimit: 57
})
