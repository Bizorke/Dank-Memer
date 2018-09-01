const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['knowyourlocation'],
  description: 'Dank Memer would like to know your location',

  textLimit: 125,
  textOnly: true
})
